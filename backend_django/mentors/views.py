from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Avg, Min, Max
from django_ratelimit.decorators import ratelimit
from .models import MentorProfile
from .serializers import MentorProfileSerializer, MentorProfileUpdateSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def mentor_list(request):
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 9))
    search = request.query_params.get('search', '')
    industry = request.query_params.get('industry', '')
    min_rate = request.query_params.get('minRate')
    max_rate = request.query_params.get('maxRate')
    sort_by = request.query_params.get('sortBy', 'rating')
    
    # Base queryset (select_related user to avoid N+1)
    mentors = MentorProfile.objects.filter(is_available=True).select_related('user')
    
    if search:
        mentors = mentors.filter(
            user__first_name__icontains=search
        ) | mentors.filter(
            user__last_name__icontains=search
        )
    
    if industry:
        mentors = mentors.filter(user__industry__iexact=industry)
    
    if min_rate:
        mentors = mentors.filter(hourly_rate__gte=float(min_rate))
    
    if max_rate:
        mentors = mentors.filter(hourly_rate__lte=float(max_rate))
    
    if sort_by == 'rating':
        mentors = mentors.order_by('-average_rating')
    elif sort_by == 'price_low':
        mentors = mentors.order_by('hourly_rate')
    elif sort_by == 'price_high':
        mentors = mentors.order_by('-hourly_rate')
    elif sort_by == 'experience':
        mentors = mentors.order_by('-total_sessions')
    
    total = mentors.count()
    pages = (total + limit - 1) // limit
    start = (page - 1) * limit
    end = start + limit
    mentors = mentors[start:end]
    
    serializer = MentorProfileSerializer(mentors, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data,
        'pagination': {
            'total': total,
            'page': page,
            'pages': pages,
            'limit': limit
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def mentor_filters(request):
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    industries = User.objects.filter(
        role='mentor',
        industry__isnull=False
    ).exclude(
        industry=''
    ).values_list('industry', flat=True).distinct()
    
    price_stats = MentorProfile.objects.filter(is_available=True).aggregate(
        min_price=Min('hourly_rate'),
        max_price=Max('hourly_rate')
    )
    
    return Response({
        'success': True,
        'data': {
            'industries': list(industries),
            'priceRange': {
                'min': price_stats['min_price'] or 0,
                'max': price_stats['max_price'] or 500
            }
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='60/m', method=['GET'])
def mentor_detail(request, mentor_id):
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    try:
        mentor = MentorProfile.objects.select_related('user').get(id=mentor_id)
        serializer = MentorProfileSerializer(mentor)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    except MentorProfile.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Mentor not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='20/m', method=['PUT', 'PATCH'])
def update_mentor_profile(request):
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    try:
        mentor_profile = MentorProfile.objects.select_related('user').get(user=request.user)
    except MentorProfile.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Mentor profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MentorProfileUpdateSerializer(
        mentor_profile, 
        data=request.data, 
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': MentorProfileSerializer(mentor_profile).data
        })
    
    return Response({
        'success': False,
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
