import uuid
from django.db import models


class Event(models.Model):
    """Stores website analytics events."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=64, db_index=True)
    page_path = models.CharField(max_length=512, blank=True, default="")
    user_id = models.CharField(max_length=64, blank=True, default="")
    session_id = models.CharField(max_length=64, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["event_type", "created_at"]),
            models.Index(fields=["page_path", "created_at"]),
        ]

    def __str__(self):
        return f"{self.event_type} | {self.page_path} | {self.created_at.isoformat()}"
