from django.urls import path
from . import views

urlpatterns = [
    path('journey/', views.create_journey_lead, name='create_journey_lead'),
]
