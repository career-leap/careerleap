from django.contrib import admin
from .models import FileUpload


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'user', 'category', 'file_size', 'uploaded_at', 'download_count']
    list_filter = ['category', 'uploaded_at', 'is_public']
    search_fields = ['original_filename', 'description', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'file_size', 'file_type', 'download_count', 'uploaded_at', 'updated_at']
    date_hierarchy = 'uploaded_at'
    
    fieldsets = (
        ('File Information', {
            'fields': ('id', 'original_filename', 'file', 'file_type', 'file_size', 'formatted_size')
        }),
        ('Metadata', {
            'fields': ('user', 'description', 'category', 'is_public')
        }),
        ('Statistics', {
            'fields': ('download_count', 'uploaded_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def formatted_size(self, obj):
        return obj.formatted_size
    formatted_size.short_description = 'Size'
