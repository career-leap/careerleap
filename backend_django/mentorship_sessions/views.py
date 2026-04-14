from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
from .models import Session
from .serializers import SessionSerializer, SessionCreateSerializer, SessionUpdateSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_list(request):
    """Get user's sessions (as mentee or mentor)"""
    user = request.user
    
    # Get sessions where user is either mentee or mentor
    sessions = Session.objects.filter(mentee=user) | Session.objects.filter(mentor=user)
    sessions = sessions.order_by('-created_at')
    
    serializer = SessionSerializer(sessions, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_availability(request):
    """Get available time slots for a mentor on a specific date"""
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
def create_session(request):
    """Create a new session (booking)"""
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
        data['price'] = 0
    
    serializer = SessionCreateSerializer(data=data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create session with current user as mentee
    session = Session.objects.create(
        mentee=request.user,
        **serializer.validated_data
    )
    
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
def session_detail(request, session_id):
    """Get session details"""
    try:
        session = Session.objects.get(id=session_id)
        
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
def update_session(request, session_id):
    """Update session details"""
    try:
        session = Session.objects.get(id=session_id)
        
        # Check if user is part of this session
        if session.mentee != request.user and session.mentor != request.user:
            return Response({
                'success': False,
                'message': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = SessionUpdateSerializer(
            session,
            data=request.data,
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
def cancel_session(request, session_id):
    """Cancel a session"""
    try:
        session = Session.objects.get(id=session_id)
        
        # Check if user is part of this session
        if session.mentee != request.user and session.mentor != request.user:
            return Response({
                'success': False,
                'message': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)
        
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
def my_sessions(request):
    """Get current user's sessions"""
    user = request.user
    
    sessions = Session.objects.filter(mentee=user) | Session.objects.filter(mentor=user)
    sessions = sessions.order_by('-created_at')
    
    serializer = SessionSerializer(sessions, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })
