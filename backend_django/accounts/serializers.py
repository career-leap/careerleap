import re
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from mentors.models import MentorProfile

User = get_user_model()


def validate_password_strength(password):
    """
    Validate password meets security requirements:
    - Minimum 10 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 10:
        raise ValidationError('Password must be at least 10 characters long.')
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError('Password must contain at least one uppercase letter.')
    
    if not re.search(r'[a-z]', password):
        raise ValidationError('Password must contain at least one lowercase letter.')
    
    if not re.search(r'\d', password):
        raise ValidationError('Password must contain at least one digit.')
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;/`~]', password):
        raise ValidationError('Password must contain at least one special character.')
    
    common_passwords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome']
    if password.lower() in common_passwords:
        raise ValidationError('This password is too common. Please choose a more unique password.')
    
    return password


class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorProfile
        fields = ['id', 'hourly_rate', 'expertise', 'is_available', 
                  'total_sessions', 'average_rating', 'bio']


class UserSerializer(serializers.ModelSerializer):
    mentor_profile = MentorProfileSerializer(read_only=True)

    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)
    yearsOfExperience = serializers.IntegerField(source='years_of_experience', read_only=True)
    profilePicture = serializers.CharField(source='profile_picture', read_only=True)
    isVerified = serializers.BooleanField(source='is_verified', read_only=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    lastLoginAt = serializers.DateTimeField(source='last_login_at', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'firstName', 'lastName', 'role', 
                  'bio', 'industry', 'yearsOfExperience', 'location',
                  'profilePicture', 'isVerified', 'isActive', 
                  'lastLoginAt', 'createdAt', 'mentor_profile']
        read_only_fields = ['id', 'isVerified', 'isActive', 'lastLoginAt', 'createdAt']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # Accept camelCase from frontend
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    
    class Meta:
        model = User
        fields = ['email', 'password', 'firstName', 'lastName', 'role']
    
    def validate_password(self, value):
        try:
            validate_password_strength(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
    
    def validate_role(self, value):
        valid_roles = ['mentee', 'mentor', 'admin']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(valid_roles)}")
        # Prevent self-registration as admin
        if value == 'admin':
            raise serializers.ValidationError("Admin accounts cannot be self-registered.")
        return value
    
    def create(self, validated_data):
        user_data = {
            'email': validated_data.get('email'),
            'password': validated_data.get('password'),
            'first_name': validated_data.get('first_name'),
            'last_name': validated_data.get('last_name'),
            'role': validated_data.get('role', 'mentee')
        }
        
        user = User.objects.create_user(**user_data)
        
        if user.role == 'mentor':
            MentorProfile.objects.create(
                user=user,
                hourly_rate=0,
                is_available=True
            )
        
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserUpdateSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=False)
    lastName = serializers.CharField(source='last_name', required=False)
    yearsOfExperience = serializers.IntegerField(source='years_of_experience', required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'bio', 'industry', 'location', 'yearsOfExperience']
    
    def validate_yearsOfExperience(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Years of experience cannot be negative.")
        return value
