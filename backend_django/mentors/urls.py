from django.urls import path
from . import views

urlpatterns = [
    path('', views.mentor_list, name='mentor_list'),
    path('filters/', views.mentor_filters, name='mentor_filters'),
    path('<uuid:mentor_id>/', views.mentor_detail, name='mentor_detail'),
    path('profile/me/', views.update_mentor_profile, name='update_mentor_profile'),
]
