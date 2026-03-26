from django.contrib import admin
from .models import MentorProfile


@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'hourly_rate', 'is_available', 'total_sessions', 'average_rating']
    list_filter = ['is_available']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    ordering = ['-created_at']
