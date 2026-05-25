from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 'email', 'lead_type', 'lead_score',
        'lead_temperature', 'lead_status', 'location',
        'created_at',
    ]
    list_filter = [
        'lead_type', 'lead_temperature', 'lead_status',
        'location', 'career_stage', 'start_timeline',
        'created_at',
    ]
    search_fields = ['full_name', 'email', 'phone', 'message']
    readonly_fields = [
        'lead_score', 'lead_type', 'lead_temperature',
        'created_at', 'updated_at',
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
