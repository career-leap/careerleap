from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('me/', views.get_me, name='get_me'),
    path('profile/', views.update_profile, name='update_profile'),
    path('logout/', views.logout, name='logout'),
    path('refresh/', views.CookieTokenRefreshView.as_view(), name='refresh'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('validate-reset-token/', views.validate_reset_token, name='validate_reset_token'),
    path('contact/', views.contact_form, name='contact_form'),
]
