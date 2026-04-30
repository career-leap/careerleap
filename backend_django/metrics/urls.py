from django.urls import path
from . import views

urlpatterns = [
    path("track/", views.track_event, name="track_event"),
]
