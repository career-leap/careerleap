from rest_framework import serializers
from .models import Session
from accounts.serializers import UserSerializer


class SessionSerializer(serializers.ModelSerializer):
    mentee = UserSerializer(read_only=True)
    mentor = UserSerializer(read_only=True)
    
    class Meta:
        model = Session
        fields = ['id', 'mentee', 'mentor', 'scheduled_at', 'duration', 
                  'status', 'topic', 'notes', 'price', 'payment_status',
                  'meeting_link', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['mentor', 'scheduled_at', 'duration', 'topic', 'price']
    
    def validate(self, data):
        # Ensure mentor is actually a mentor
        mentor = data.get('mentor')
        if mentor.role != 'mentor':
            raise serializers.ValidationError(
                'Selected user is not a mentor'
            )
        return data


class SessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        # SECURITY: Removed 'payment_status' - clients cannot mark sessions as paid
        fields = ['status', 'notes', 'meeting_link']
