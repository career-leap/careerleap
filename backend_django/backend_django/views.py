"""Project-level utility views."""
from django.http import JsonResponse


def health_check(request):
    """Simple health check endpoint for load balancers and monitoring."""
    return JsonResponse({
        'status': 'healthy',
        'service': 'careerleap-backend',
    })
