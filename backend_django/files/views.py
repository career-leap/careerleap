import os
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.db import models
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import FileUpload
from .serializers import (
    FileUploadSerializer,
    FileUploadCreateSerializer,
    FileUploadListSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for file lists"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_uploads(request):
    """
    List file uploads with optional filtering.
    Query params:
    - category: Filter by category
    - my_uploads: 'true' to show only current user's uploads
    - search: Search in filename and description
    """
    queryset = FileUpload.objects.all()
    
    # Filter by category
    category = request.query_params.get('category')
    if category:
        queryset = queryset.filter(category=category)
    
    # Filter by current user
    my_uploads = request.query_params.get('my_uploads')
    if my_uploads == 'true':
        queryset = queryset.filter(user=request.user)
    
    # Search
    search = request.query_params.get('search')
    if search:
        queryset = queryset.filter(
            models.Q(original_filename__icontains=search) |
            models.Q(description__icontains=search)
        )
    
    # Pagination
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    
    if page is not None:
        serializer = FileUploadListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = FileUploadListSerializer(queryset, many=True)
    return Response({
        'success': True,
        'uploads': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """Upload a new file"""
    serializer = FileUploadCreateSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        upload = serializer.save()
        
        # Return full details
        response_serializer = FileUploadSerializer(upload, context={'request': request})
        
        return Response({
            'success': True,
            'message': 'File uploaded successfully',
            'upload': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_upload_detail(request, upload_id):
    """Get detailed information about a specific upload"""
    try:
        upload = FileUpload.objects.get(id=upload_id)
    except FileUpload.DoesNotExist:
        return Response({
            'success': False,
            'message': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FileUploadSerializer(upload, context={'request': request})
    
    return Response({
        'success': True,
        'upload': serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_upload(request, upload_id):
    """Delete an upload (only owner or admin can delete)"""
    try:
        upload = FileUpload.objects.get(id=upload_id)
    except FileUpload.DoesNotExist:
        return Response({
            'success': False,
            'message': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check permission (only owner or admin can delete)
    if upload.user != request.user and request.user.role != 'admin':
        return Response({
            'success': False,
            'message': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Delete the file and record
    upload.delete()
    
    return Response({
        'success': True,
        'message': 'File deleted successfully'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, upload_id):
    """Download a file"""
    try:
        upload = FileUpload.objects.get(id=upload_id)
    except FileUpload.DoesNotExist:
        return Response({
            'success': False,
            'message': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check permission (must be owner, admin, or public file)
    if not upload.is_public and upload.user != request.user and request.user.role != 'admin':
        return Response({
            'success': False,
            'message': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Increment download count
    upload.download_count += 1
    upload.save(update_fields=['download_count'])
    
    # Return file response
    file_path = upload.file.path
    if not os.path.exists(file_path):
        return Response({
            'success': False,
            'message': 'File not found on server'
        }, status=status.HTTP_404_NOT_FOUND)
    
    response = FileResponse(
        open(file_path, 'rb'),
        as_attachment=True,
        filename=upload.original_filename
    )
    response['Content-Type'] = upload.file_type or 'application/octet-stream'
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_categories(request):
    """Get list of available categories with counts"""
    from django.db.models import Count
    
    categories = FileUpload.objects.values('category').annotate(
        count=Count('id')
    ).order_by('category')
    
    category_labels = dict(FileUpload._meta.get_field('category').choices)
    
    return Response({
        'success': True,
        'categories': [
            {
                'value': cat['category'],
                'label': category_labels.get(cat['category'], cat['category']),
                'count': cat['count']
            }
            for cat in categories
        ]
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    """Get file upload statistics"""
    from django.db.models import Sum, Count
    from django.utils import timezone
    from datetime import timedelta
    
    user = request.user
    
    # Total uploads
    total_uploads = FileUpload.objects.count()
    my_uploads = FileUpload.objects.filter(user=user).count()
    
    # Recent uploads (last 24 hours)
    one_day_ago = timezone.now() - timedelta(days=1)
    recent_uploads = FileUpload.objects.filter(uploaded_at__gte=one_day_ago).count()
    
    # Total storage used
    total_size = FileUpload.objects.aggregate(
        total=Sum('file_size')
    )['total'] or 0
    
    my_storage = FileUpload.objects.filter(user=user).aggregate(
        total=Sum('file_size')
    )['total'] or 0
    
    # Uploads by category
    category_counts = FileUpload.objects.values('category').annotate(
        count=Count('id')
    )
    
    return Response({
        'success': True,
        'stats': {
            'total_uploads': total_uploads,
            'my_uploads': my_uploads,
            'recent_uploads': recent_uploads,
            'total_storage_bytes': total_size,
            'my_storage_bytes': my_storage,
            'total_storage_formatted': format_size(total_size),
            'my_storage_formatted': format_size(my_storage),
            'by_category': {item['category']: item['count'] for item in category_counts}
        }
    })


def format_size(size_bytes):
    """Format byte size to human readable"""
    if size_bytes == 0:
        return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB']:
        if abs(size_bytes) < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"
