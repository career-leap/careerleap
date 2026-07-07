import secrets
import hashlib
import logging
from datetime import datetime, timedelta
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from rest_framework import status, generics, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.contrib.auth import get_user_model
from django_ratelimit.decorators import ratelimit
from .serializers import UserSerializer, UserCreateSerializer, LoginSerializer, UserUpdateSerializer

logger = logging.getLogger(__name__)

User = get_user_model()


# Rate limit key function
def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def generate_reset_token():
    """Generate a cryptographically secure random token"""
    return secrets.token_urlsafe(32)


def hash_token(token):
    """Hash token for storage (constant time comparison)"""
    return hashlib.sha256(token.encode()).hexdigest()


def send_reset_email(user, reset_link):
    """Send password reset email to user"""
    subject = 'Reset Your CareerLeap Password'
    
    # Plain text message
    message = f"""Hello {user.first_name},

You requested a password reset for your CareerLeap account.

Click the link below to reset your password:
{reset_link}

This link will expire in 30 minutes.

If you didn't request this reset, you can safely ignore this email.

Best regards,
The CareerLeap Team
"""
    
    # HTML message
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800;">CareerLeap</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Reset Your Password</h2>
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hello {user.first_name or 'there'},
                            </p>
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                You requested a password reset for your CareerLeap account. Click the button below to reset your password:
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{reset_link}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                This link will expire in <strong style="color: #6b7280;">30 minutes</strong>.
                            </p>
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 15px 0 0 0;">
                                If you didn't request this reset, you can safely ignore this email.
                            </p>
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="{reset_link}" style="color: #4f46e5; word-break: break-all;">{reset_link}</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 12px 12px;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                                © 2026 CareerLeap. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'accessToken': str(refresh.access_token),
        'refreshToken': str(refresh)
    }


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/h', block=True, method='POST')
def register(request):
    """Register a new user - Rate limited to 5 per hour per IP"""
    serializer = UserCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email already exists
    email = serializer.validated_data.get('email')
    if User.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'message': 'Email already registered'
        }, status=status.HTTP_409_CONFLICT)
    
    # Create user
    user = serializer.save()
    tokens = get_tokens_for_user(user)
    
    response = Response({
        'success': True,
        'message': 'User registered successfully',
        'user': UserSerializer(user).data,
        'accessToken': tokens['accessToken'],
    })

    # Set refresh token as httpOnly cookie (not returned in body)
    response.set_cookie(
        'refreshToken',
        tokens['refreshToken'],
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite='Lax',
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return response


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='10/m', block=True, method='POST')
def login(request):
    """Login user - Rate limited to 10 per minute per IP"""
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_active:
        return Response({
            'success': False,
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.check_password(password):
        return Response({
            'success': False,
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Update last login
    user.update_last_login()
    
    tokens = get_tokens_for_user(user)
    
    response = Response({
        'success': True,
        'message': 'Login successful',
        'user': UserSerializer(user).data,
        'accessToken': tokens['accessToken'],
    })

    # Set refresh token as httpOnly cookie (not returned in body)
    response.set_cookie(
        'refreshToken',
        tokens['refreshToken'],
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite='Lax',
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    """Get current user info"""
    user = request.user
    serializer = UserSerializer(user)
    
    return Response({
        'success': True,
        'user': serializer.data
    })


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update current user's profile"""
    user = request.user
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        # Return updated user data
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': UserSerializer(user).data
        })
    
    return Response({
        'success': False,
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user and blacklist the refresh token from the httpOnly cookie."""
    refresh_token = request.COOKIES.get('refreshToken')

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass  # token was already invalid or expired

    response = Response({
        'success': True,
        'message': 'Logged out successfully'
    })

    response.delete_cookie('refreshToken')
    return response


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    """Accept refresh token only from httpOnly cookie."""
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        request = self.context['request']
        refresh_token = request.COOKIES.get('refreshToken')

        if not refresh_token:
            raise serializers.ValidationError({
                'refresh': 'Refresh token is required.'
            })

        attrs['refresh'] = refresh_token
        return super().validate(attrs)


class CookieTokenRefreshView(TokenRefreshView):
    """Refresh access token and rotate the refresh token.

    Uses rest_framework_simplejwt's rotation/blacklist logic so old refresh
    tokens cannot be reused after a successful refresh.
    """
    serializer_class = CookieTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError:
            return Response({
                'success': False,
                'message': 'Invalid or expired refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({
            'success': True,
            'accessToken': serializer.validated_data['access'],
        })

        # If rotation produced a new refresh token, set it as httpOnly cookie
        if 'refresh' in serializer.validated_data:
            response.set_cookie(
                'refreshToken',
                serializer.validated_data['refresh'],
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60  # 7 days
            )

        return response


# =============================================================================
# PASSWORD RESET VIEWS
# =============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='3/h', block=True, method='POST')
def forgot_password(request):
    """
    Request a password reset link.
    Always returns success to prevent email enumeration.
    Rate limited to 3 requests per hour per IP.
    """
    email = request.data.get('email', '').lower().strip()
    
    # Validate email format
    if not email:
        return Response({
            'success': False,
            'message': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Rate limiting check (3 requests per hour per email)
    rate_limit_key = f"pwd_reset_rate:{email}"
    request_count = cache.get(rate_limit_key, 0)
    
    if request_count >= 3:
        return Response({
            'success': False,
            'message': 'Too many requests. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    try:
        user = User.objects.get(email=email, is_active=True)
        
        # Generate token and store hashed version
        token = generate_reset_token()
        hashed_token = hash_token(token)
        
        # Store in cache with 30 minute expiry
        cache_key = f"pwd_reset:{hashed_token}"
        cache.set(cache_key, str(user.id), timeout=1800)  # 30 minutes
        
        # Increment rate limit counter (1 hour expiry)
        cache.set(rate_limit_key, request_count + 1, timeout=3600)
        
        # Build reset link
        frontend_url = settings.FRONTEND_URL.rstrip('/')
        reset_link = f"{frontend_url}/reset-password?token={token}"
        
        # Send email
        send_reset_email(user, reset_link)
        
    except User.DoesNotExist:
        # Don't reveal if email exists or not
        pass
    
    # Always return same response to prevent email enumeration
    return Response({
        'success': True,
        'message': 'If an account exists with this email, you will receive a password reset link shortly.'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/h', block=True, method='POST')
def reset_password(request):
    """
    Reset password using token from email.
    Validates token, updates password, invalidates token.
    Rate limited to 5 attempts per hour per IP.
    """
    token = request.data.get('token', '')
    new_password = request.data.get('new_password', '')
    confirm_password = request.data.get('confirm_password', '')
    
    # Validate inputs
    if not token:
        return Response({
            'success': False,
            'message': 'Reset token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not new_password:
        return Response({
            'success': False,
            'message': 'New password is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({
            'success': False,
            'message': 'Passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({
            'success': False,
            'message': 'Password must be at least 8 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Hash token and look up in cache
    hashed_token = hash_token(token)
    cache_key = f"pwd_reset:{hashed_token}"
    user_id = cache.get(cache_key)
    
    if not user_id:
        return Response({
            'success': False,
            'message': 'Invalid or expired reset token'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id, is_active=True)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        # Invalidate the token
        cache.delete(cache_key)
        
        # Send confirmation email
        send_mail(
            subject='Your CareerLeap Password Has Been Changed',
            message=f"""Hello {user.first_name or 'there'},

Your CareerLeap password has been successfully changed.

If you didn't make this change, please contact support immediately.

Best regards,
The CareerLeap Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        
        return Response({
            'success': True,
            'message': 'Password reset successfully. Please log in with your new password.'
        })
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid or expired reset token'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='10/m', block=True, method='GET')
def validate_reset_token(request):
    """
    Validate if a reset token is still valid.
    Used by frontend to show appropriate UI before form submission.
    Rate limited to 10 checks per minute per IP.
    """
    token = request.query_params.get('token', '')
    
    if not token:
        return Response({
            'success': False,
            'valid': False,
            'message': 'Token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    hashed_token = hash_token(token)
    cache_key = f"pwd_reset:{hashed_token}"
    user_id = cache.get(cache_key)
    
    if not user_id:
        return Response({
            'success': False,
            'valid': False,
            'message': 'Invalid or expired token'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'success': True,
        'valid': True,
        'message': 'Token is valid'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method=['POST'])
def contact_form(request):
    """
    Handle contact form submissions.
    Sends an email to info@career-leap.academy with the form data.
    Rate limited to 5 submissions per minute per IP.
    """
    # Check if request was rate limited
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Too many requests. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    # Get form data
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip()
    subject = request.data.get('subject', '').strip()
    message = request.data.get('message', '').strip()
    
    # Validate required fields
    if not all([name, email, subject, message]):
        return Response({
            'success': False,
            'message': 'All fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate email format
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email(email)
    except ValidationError:
        return Response({
            'success': False,
            'message': 'Invalid email address'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Construct email
    email_subject = f"Contact Form: {subject}"
    email_body = f"""New message from CareerLeap contact form:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This message was sent from the CareerLeap website contact form.
"""
    
    try:
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['info@career-leap.academy'],
            fail_silently=False,
        )
        
        return Response({
            'success': True,
            'message': 'Your message has been sent successfully. We will get back to you soon.'
        })
    except Exception as e:
        logger.error(f"Contact form email failed to send: {e}")
        return Response({
            'success': False,
            'message': 'Failed to send message. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
