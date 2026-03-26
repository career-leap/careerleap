from django.urls import path
from . import views

urlpatterns = [
    path('', views.session_list, name='session_list'),
    path('availability/', views.session_availability, name='session_availability'),
    path('create/', views.create_session, name='create_session'),
    path('my-sessions/', views.my_sessions, name='my_sessions'),
    path('<uuid:session_id>/', views.session_detail, name='session_detail'),
    path('<uuid:session_id>/update/', views.update_session, name='update_session'),
    path('<uuid:session_id>/cancel/', views.cancel_session, name='cancel_session'),
]
