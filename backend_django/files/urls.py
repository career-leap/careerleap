from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_uploads, name='list_uploads'),
    path('upload/', views.upload_file, name='upload_file'),
    path('categories/', views.get_categories, name='get_categories'),
    path('stats/', views.get_stats, name='get_stats'),
    path('<uuid:upload_id>/', views.get_upload_detail, name='get_upload_detail'),
    path('<uuid:upload_id>/delete/', views.delete_upload, name='delete_upload'),
    path('<uuid:upload_id>/download/', views.download_file, name='download_file'),
]
