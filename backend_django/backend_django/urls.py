"""
URL configuration for backend_django project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/mentors/', include('mentors.urls')),
    path('api/sessions/', include('mentorship_sessions.urls')),
    path('api/files/', include('files.urls')),
    path('api/metrics/', include('metrics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
