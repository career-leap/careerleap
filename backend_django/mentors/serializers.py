from rest_framework import serializers
from .models import MentorProfile
from accounts.serializers import UserSerializer


class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = MentorProfile
        fields = ['id', 'user', 'hourly_rate', 'expertise', 'is_available',
                  'total_sessions', 'average_rating', 'bio', 'created_at']


class MentorProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorProfile
        fields = ['hourly_rate', 'expertise', 'is_available', 'bio']
