import os
import magic
from rest_framework import serializers
from .models import FileUpload


# Maximum file size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024

# Allowed MIME types
ALLOWED_MIME_TYPES = {
    # Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    # Note: Removed 'image/svg+xml' - potential XSS via embedded scripts
    # Documents
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv',
    # Code - Safe code files only
    'application/json', 'text/css',
    'text/x-python', 'application/x-python-code',
    # Note: Removed 'text/javascript' and 'text/html' - XSS vulnerabilities
    # Archives
    'application/zip', 'application/x-zip-compressed',
}

# Dangerous file extensions that are never allowed
DANGEROUS_EXTENSIONS = {
    '.exe', '.bat', '.cmd', '.sh', '.php', '.jsp', '.asp', '.aspx',
    '.dll', '.bin', '.scr', '.msi', '.com', '.vbs', '.js', '.jar',
    '.py', '.rb', '.pl', '.cgi', '.htaccess'
}


class FileUploadSerializer(serializers.ModelSerializer):
    """Serializer for file upload metadata"""
    
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    formatted_size = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FileUpload
        fields = [
            'id', 'original_filename', 'file', 'file_type', 'file_size',
            'formatted_size', 'description', 'category', 'is_public',
            'download_count', 'uploaded_at', 'updated_at',
            'user_name', 'user_email', 'user_role', 'file_url'
        ]
        read_only_fields = [
            'id', 'file_size', 'file_type', 'download_count',
            'uploaded_at', 'updated_at', 'formatted_size'
        ]
    
    def get_user_name(self, obj):
        """Get user's full name"""
        user = obj.user
        if user.first_name:
            return f"{user.first_name} {user.last_name or ''}".strip()
        return user.email
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_user_role(self, obj):
        return obj.user.role
    
    def get_file_url(self, obj):
        """Get the full URL for the file"""
        request = self.context.get('request')
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None


class FileUploadCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating file uploads"""
    
    file = serializers.FileField(required=True)
    
    class Meta:
        model = FileUpload
        fields = ['file', 'description', 'category', 'is_public']
    
    def validate_file(self, value):
        """Validate file size and type using python-magic"""
        # Validate file size
        if value.size > MAX_FILE_SIZE:
            raise serializers.ValidationError(
                f'File size too large. Maximum size is 50MB. Your file is {value.size / (1024 * 1024):.2f}MB.'
            )
        
        # Get file extension
        filename = value.name.lower()
        file_ext = os.path.splitext(filename)[1]
        
        # Check for dangerous extensions
        if file_ext in DANGEROUS_EXTENSIONS:
            raise serializers.ValidationError(
                f'File type "{file_ext}" is not allowed for security reasons.'
            )
        
        # Read file content for MIME type detection
        # Reset file pointer after reading
        value.seek(0)
        file_content = value.read(2048)  # Read first 2KB for MIME detection
        value.seek(0)
        
        # Detect MIME type using python-magic
        try:
            detected_mime = magic.from_buffer(file_content, mime=True)
        except magic.MagicException:
            detected_mime = value.content_type or 'application/octet-stream'
        
        # Validate MIME type
        if detected_mime not in ALLOWED_MIME_TYPES:
            raise serializers.ValidationError(
                f'File type "{detected_mime}" is not allowed. '
                f'Allowed types: images, documents, spreadsheets, presentations, and code files.'
            )
        
        # Store detected MIME type for later use
        self._detected_mime_type = detected_mime
        
        return value
    
    def create(self, validated_data):
        """Create file upload with metadata extraction"""
        file_obj = validated_data.pop('file')
        
        # Use detected MIME type from validation
        file_type = getattr(self, '_detected_mime_type', None) or file_obj.content_type or 'application/octet-stream'
        
        # Determine category from MIME type
        category_map = {
            'image': 'image',
            'application/pdf': 'document',
            'application/msword': 'document',
            'application/vnd.openxmlformats-officedocument': 'document',
            'application/vnd.ms-excel': 'spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml': 'spreadsheet',
            'application/vnd.ms-powerpoint': 'presentation',
            'application/vnd.openxmlformats-officedocument.presentationml': 'presentation',
            'application/json': 'code',
            'text/css': 'code',
            'text/x-python': 'code',
        }
        
        detected_category = 'other'
        for prefix, cat in category_map.items():
            if file_type.startswith(prefix) or prefix in file_type:
                detected_category = cat
                break
        
        # Use provided category or auto-detected
        category = validated_data.get('category', 'other')
        if category == 'other':
            category = detected_category
        
        upload = FileUpload.objects.create(
            user=self.context['request'].user,
            original_filename=file_obj.name,
            file=file_obj,
            file_type=file_type,
            file_size=file_obj.size,
            category=category,
            **validated_data
        )
        
        return upload


class FileUploadListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing uploads"""
    
    user_name = serializers.SerializerMethodField()
    formatted_size = serializers.ReadOnlyField()
    
    class Meta:
        model = FileUpload
        fields = [
            'id', 'original_filename', 'file_type', 'file_size',
            'formatted_size', 'category', 'uploaded_at', 'user_name'
        ]
    
    def get_user_name(self, obj):
        user = obj.user
        if user.first_name:
            return f"{user.first_name} {user.last_name or ''}".strip()
        return user.email
