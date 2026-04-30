from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("event_type", "page_path", "user_id", "session_id", "created_at")
    list_filter = ("event_type", "created_at")
    search_fields = ("page_path", "user_id", "session_id")
    readonly_fields = ("id", "created_at")
    date_hierarchy = "created_at"
