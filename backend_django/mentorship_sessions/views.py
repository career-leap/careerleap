from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django_ratelimit.decorators import ratelimit
from django.db import transaction
from datetime import datetime, timedelta
from .models import Session
from .serializers import SessionSerializer, SessionCreateSerializer, SessionUpdateSerializer

User = get_user_model()


def _validate_status_transition(current_status, new_status, is_mentor, is_mentee):
    """Return {'valid': bool, 'message': str} for a requested status change."""
    allowed_statuses = {'pending', 'confirmed', 'completed', 'cancelled'}

    if new_status not in allowed_statuses:
        return {'valid': False, 'message': f'Invalid status "{new_status}".'}

    # Terminal statuses cannot be changed to anything else
    if current_status in ('completed', 'cancelled'):
        return {
            'valid': False,
            'message': f'Cannot change status of a {current_status} session.'
        }

    # Mentor can confirm pending sessions and complete confirmed sessions
    if is_mentor:
        if (current_status, new_status) in (('pending', 'confirmed'), ('confirmed', 'completed')):
            return {'valid': True, 'message': ''}

    # Both mentor and mentee can cancel pending or confirmed sessions
    if new_status == 'cancelled' and current_status in ('pending', 'confirmed'):
        return {'valid': True, 'message': ''}

    return {
        'valid': False,
        'message': (
            f'Cannot transition from "{current_status}" to "{new_status}" '
            f'as {"mentor" if is_mentor else "mentee"}.'
        )
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def session_list(request):
    """Get user's sessions (as mentee or mentor)"""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    user = request.user
    
    # Get sessions where user is either mentee or mentor (select_related to avoid N+1)
    sessions = Session.objects.filter(mentee=user) | Session.objects.filter(mentor=user)
    sessions = sessions.select_related('mentee', 'mentor').order_by('-created_at')
    
    serializer = SessionSerializer(sessions, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def session_availability(request):
    """Get available time slots for a mentor on a specific date"""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    mentor_id = request.query_params.get('mentorId')
    date_str = request.query_params.get('date')
    
    if not mentor_id or not date_str:
        return Response({
            'success': False,
            'message': 'mentorId and date are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse the date
        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Generate time slots (9 AM to 5 PM, hourly)
        slots = []
        for hour in range(9, 18):  # 9 AM to 5 PM
            slot_time = datetime.combine(selected_date, datetime.min.time().replace(hour=hour))
            time_iso = slot_time.isoformat()
            
            # Check if slot is already booked
            is_booked = Session.objects.filter(
                mentor_id=mentor_id,
                scheduled_at=slot_time,
                status__in=['pending', 'confirmed']
            ).exists()
            
            if not is_booked:
                slots.append({
                    'time': time_iso,
                    'hour': slot_time.strftime('%I:%M %p')  # Format like "09:00 AM"
                })
        
        return Response({
            'success': True,
            'data': slots
        })
    
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='10/m', method=['POST'])
def create_session(request):
    """Create a new session (booking)"""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    data = request.data.copy()
    
    # Handle both camelCase and snake_case
    if 'mentorId' in data:
        data['mentor'] = data.pop('mentorId')
    if 'scheduledAt' in data:
        data['scheduled_at'] = data.pop('scheduledAt')
    
    # SECURITY: Always compute price server-side from mentor's profile
    # Ignore any price sent by client to prevent manipulation
    from mentors.models import MentorProfile
    try:
        mentor_profile = MentorProfile.objects.get(user_id=data['mentor'])
        data['price'] = mentor_profile.hourly_rate
    except MentorProfile.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Selected mentor does not exist'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Prevent self-booking
    if str(data.get('mentor')) == str(request.user.id):
        return Response({
            'success': False,
            'message': 'You cannot book a session with yourself'
        }, status=status.HTTP_400_BAD_REQUEST)

    serializer = SessionCreateSerializer(data=data)

    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    mentor = serializer.validated_data['mentor']
    scheduled_at = serializer.validated_data['scheduled_at']

    # Atomic creation + select_for_update prevents race-condition double-booking
    try:
        with transaction.atomic():
            # Lock the mentor's existing active sessions for this slot
            existing = Session.objects.select_for_update().filter(
                mentor=mentor,
                scheduled_at=scheduled_at,
                status__in=['pending', 'confirmed']
            ).first()

            if existing:
                raise ValueError('This time slot is already booked')

            session = Session.objects.create(
                mentee=request.user,
                **serializer.validated_data
            )
    except ValueError as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_409_CONFLICT)
    
    # Send email notification to admin
    try:
        mentor = session.mentor
        mentee = session.mentee
        scheduled_at = session.scheduled_at
        
        email_subject = f"New Session Booking: {mentee.first_name} {mentee.last_name} with {mentor.first_name} {mentor.last_name}"
        email_body = f"""A new session has been booked on CareerLeap.

Session Details:
----------------
Mentee: {mentee.first_name} {mentee.last_name} ({mentee.email})
Mentor: {mentor.first_name} {mentor.last_name} ({mentor.email})
Date & Time: {scheduled_at.strftime('%B %d, %Y at %I:%M %p')}
Topic: {session.topic or 'Not specified'}
Duration: {session.duration} minutes
Status: {session.status}

Session ID: {session.id}
Booked at: {session.created_at.strftime('%B %d, %Y at %I:%M %p')}

---
This is an automated notification from CareerLeap.
"""
        
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['info@career-leap.academy'],
            fail_silently=True,
        )
    except Exception:
        # Don't fail the booking if email fails
        pass
    
    return Response({
        'success': True,
        'message': 'Session booked successfully',
        'data': SessionSerializer(session).data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def session_detail(request, session_id):
    """Get session details"""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    try:
        session = Session.objects.select_related('mentee', 'mentor').get(id=session_id)
        
        # Check if user is part of this session
        if session.mentee != request.user and session.mentor != request.user:
            return Response({
                'success': False,
                'message': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = SessionSerializer(session)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    except Session.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Session not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='20/m', method=['PUT', 'PATCH'])
def update_session(request, session_id):
    """Update session details with role-based status transitions."""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    try:
        session = Session.objects.select_related('mentee', 'mentor').get(id=session_id)

        # Check if user is part of this session
        if session.mentee != request.user and session.mentor != request.user:
            return Response({
                'success': False,
                'message': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)

        is_mentor = session.mentor == request.user
        is_mentee = session.mentee == request.user
        data = request.data.copy()

        # Status transition rules
        new_status = data.get('status')
        if new_status:
            valid_transition = _validate_status_transition(
                session.status, new_status, is_mentor, is_mentee
            )
            if not valid_transition['valid']:
                return Response({
                    'success': False,
                    'message': valid_transition['message']
                }, status=status.HTTP_403_FORBIDDEN)

        # Only mentors can set/update meeting links
        if 'meeting_link' in data and not is_mentor:
            return Response({
                'success': False,
                'message': 'Only the mentor can update the meeting link.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Do not allow updates to terminal sessions
        if session.status in ('completed', 'cancelled'):
            return Response({
                'success': False,
                'message': 'Cannot update a completed or cancelled session.'
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = SessionUpdateSerializer(
            session,
            data=data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Session updated successfully',
                'data': SessionSerializer(session).data
            })

        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except Session.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Session not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='10/m', method=['DELETE'])
def cancel_session(request, session_id):
    """Cancel a session"""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    try:
        session = Session.objects.select_related('mentee', 'mentor').get(id=session_id)

        # Check if user is part of this session
        if session.mentee != request.user and session.mentor != request.user:
            return Response({
                'success': False,
                'message': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)

        # Only pending or confirmed sessions can be cancelled
        if session.status not in ('pending', 'confirmed'):
            return Response({
                'success': False,
                'message': f'Cannot cancel a session with status "{session.status}".'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update status to cancelled
        session.status = 'cancelled'
        session.save()

        return Response({
            'success': True,
            'message': 'Session cancelled successfully'
        })

    except Session.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Session not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def my_sessions(request):
    """Get current user's sessions"""
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    user = request.user
    
    sessions = Session.objects.filter(mentee=user) | Session.objects.filter(mentor=user)
    sessions = sessions.select_related('mentee', 'mentor').order_by('-created_at')
    
    serializer = SessionSerializer(sessions, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })
