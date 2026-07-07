import uuid
import os
from django.db import models
from django.conf import settings


def user_upload_path(instance, filename):
    """Generate upload path: uploads/<user_id>/<filename>"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('uploads', str(instance.user.id), filename)


class FileUpload(models.Model):
    """Model for storing file upload metadata"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='file_uploads',
        db_index=True
    )
    
    # Original file info
    original_filename = models.CharField(max_length=255)
    file = models.FileField(upload_to=user_upload_path, max_length=500)
    file_type = models.CharField(max_length=100, blank=True)
    file_size = models.BigIntegerField()  # in bytes
    
    # Metadata
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=50,
        choices=[
            ('document', 'Document'),
            ('image', 'Image'),
            ('spreadsheet', 'Spreadsheet'),
            ('presentation', 'Presentation'),
            ('code', 'Code'),
            ('other', 'Other'),
        ],
        default='other'
    )
    
    # Status
    is_public = models.BooleanField(default=False, db_index=True)
    download_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    uploaded_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['user', '-uploaded_at']),
            models.Index(fields=['category']),
            models.Index(fields=['is_public', '-uploaded_at']),
        ]
    
    def __str__(self):
        return f"{self.original_filename} ({self.user.email})"
    
    def delete(self, *args, **kwargs):
        """Delete file from storage when model instance is deleted"""
        if self.file:
            # Store the path before calling parent's delete
            file_path = self.file.path if hasattr(self.file, 'path') else None
            if file_path and os.path.isfile(file_path):
                os.remove(file_path)
        super().delete(*args, **kwargs)
    
    @property
    def formatted_size(self):
        """Return human-readable file size"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        return f"{size:.2f} TB"
    
    @property
    def file_extension(self):
        """Get file extension"""
        return os.path.splitext(self.original_filename)[1].lower()
    
    @property
    def is_image(self):
        """Check if file is an image"""
        return self.file_type.startswith('image/')
    
    @property
    def is_document(self):
        """Check if file is a document"""
        return self.file_type in [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ]
