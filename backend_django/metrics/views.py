import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from .models import Event

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
@ratelimit(key="ip", rate="60/m", method=["POST"])
def track_event(request):
    """
    Track an analytics event.
    Rate limited to 60 events per minute per IP.
    """
    if getattr(request, "limited", False):
        return Response(
            {"success": False, "message": "Rate limit exceeded."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    event_type = request.data.get("event_type", "").strip()
    page_path = request.data.get("page_path", "").strip()
    session_id = request.data.get("session_id", "").strip()
    metadata = request.data.get("metadata", {}) or {}

    if not event_type:
        return Response(
            {"success": False, "message": "event_type is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not session_id:
        return Response(
            {"success": False, "message": "session_id is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Truncate fields to safe lengths
    event_type = event_type[:64]
    page_path = page_path[:512]
    session_id = session_id[:64]

    # Extract user ID from JWT if authenticated
    user_id = ""
    if request.user and request.user.is_authenticated:
        user_id = str(request.user.id)

    try:
        Event.objects.create(
            event_type=event_type,
            page_path=page_path,
            user_id=user_id,
            session_id=session_id,
            metadata=metadata,
        )
        return Response({"success": True})
    except Exception as e:
        logger.error(f"Failed to track event: {e}")
        # Fail silently from the frontend perspective
        return Response({"success": True})
