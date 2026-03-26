from django.contrib import admin
from .models import Session


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'mentee', 'mentor', 'scheduled_at', 'status', 'payment_status']
    list_filter = ['status', 'payment_status']
    search_fields = ['mentee__email', 'mentor__email', 'topic']
    ordering = ['-created_at']
