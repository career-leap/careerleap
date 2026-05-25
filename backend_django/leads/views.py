import logging
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from .models import Lead
from .serializers import LeadJourneySerializer

logger = logging.getLogger(__name__)

INTERNAL_RECIPIENT = 'info@career-leap.academy'


def calculate_lead_score(data):
    """Calculate lead score based on document-specified logic."""
    score = 0

    # Timeline urgency
    timeline_scores = {
        'Immediately': 30,
        'Within the next 2 weeks': 20,
        'Within 1 month': 10,
        'Later / just exploring': 5,
    }
    score += timeline_scores.get(data.get('start_timeline'), 0)

    # Info call availability
    call_scores = {'Yes': 25, 'Maybe': 10, 'No': 0}
    score += call_scores.get(data.get('info_call_availability'), 0)

    # Goals
    goals = data.get('current_goal', [])
    if 'Join a CareerLeap simulation cohort' in goals:
        score += 25
    if 'Build a job-ready portfolio' in goals:
        score += 15
    if 'Improve my CV and LinkedIn' in goals:
        score += 10
    if 'Prepare for interviews' in goals:
        score += 10

    # Preferred contact method
    if data.get('preferred_contact_method') == 'WhatsApp':
        score += 10

    # Location
    if data.get('location') == 'Germany':
        score += 15

    return score


def classify_lead(data):
    """Classify lead type based on document-specified logic."""
    goals = data.get('current_goal', [])
    stage = data.get('career_stage', '')
    track = data.get('track_interest', '')

    if 'Become a mentor' in goals:
        return 'mentor'
    if 'Partner with CareerLeap' in goals:
        return 'partner'
    if stage == 'University / organization representative':
        return 'institutional'
    if track == 'Partnership / Institutional Collaboration':
        return 'institutional'
    if any(g in goals for g in [
        'Join a CareerLeap simulation cohort',
        'Build a job-ready portfolio',
        'Improve my CV and LinkedIn',
        'Prepare for interviews',
    ]):
        return 'participant'

    return 'general'


def get_temperature(score):
    """Determine lead temperature from score."""
    if score >= 70:
        return 'hot'
    if score >= 40:
        return 'warm'
    return 'cold'


def send_internal_notification(lead):
    """Send internal email to CareerLeap team."""
    subject = 'New CareerLeap Journey Form Submission'

    goals = ', '.join(lead.current_goal) if isinstance(lead.current_goal, list) else lead.current_goal

    message = f"""New CareerLeap Journey Form Submission

Full Name: {lead.full_name}
Email: {lead.email}
Phone / WhatsApp: {lead.phone or 'N/A'}
Location: {lead.location}
Career Stage: {lead.career_stage}
Current Goal: {goals}
Track Interest: {lead.track_interest}
Career Priority: {lead.career_priority}
Start Timeline: {lead.start_timeline}
Info Call Availability: {lead.info_call_availability}
Preferred Contact Method: {lead.preferred_contact_method}
Source Channel: {lead.source_channel or 'N/A'}
Lead Type: {lead.get_lead_type_display()}
Lead Score: {lead.lead_score}
Lead Temperature: {lead.get_lead_temperature_display()}
Message: {lead.message or 'N/A'}
Submission Date: {lead.created_at.strftime('%Y-%m-%d %H:%M:%S')}
UTM Source: {lead.utm_source or 'N/A'}
UTM Medium: {lead.utm_medium or 'N/A'}
UTM Campaign: {lead.utm_campaign or 'N/A'}
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New CareerLeap Journey Submission</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
        <tr><td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                    <td style="padding:40px 40px 20px 40px;text-align:center;border-bottom:1px solid #e5e7eb;">
                        <h1 style="color:#4f46e5;margin:0;font-size:28px;font-weight:800;">CareerLeap</h1>
                        <p style="color:#6b7280;margin:8px 0 0 0;font-size:16px;">New Journey Form Submission</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px;">
                        <div style="margin-bottom:20px;">
                            <span style="display:inline-block;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;text-transform:uppercase;" 
                                style="background:{'#fee2e2;color:#991b1b' if lead.lead_temperature=='hot' else '#fef3c7;color:#92400e' if lead.lead_temperature=='warm' else '#e0e7ff;color:#3730a3'};">
                                {lead.get_lead_temperature_display()} Lead — Score: {lead.lead_score}
                            </span>
                            <span style="display:inline-block;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;text-transform:uppercase;background:#f3f4f6;color:#374151;margin-left:8px;">
                                {lead.get_lead_type_display()}
                            </span>
                        </div>
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#374151;line-height:1.6;">
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Full Name:</strong> {lead.full_name}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Email:</strong> {lead.email}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Phone:</strong> {lead.phone or 'N/A'}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Location:</strong> {lead.location}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Career Stage:</strong> {lead.career_stage}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Goals:</strong> {goals}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Track Interest:</strong> {lead.track_interest}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Career Priority:</strong> {lead.career_priority}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Start Timeline:</strong> {lead.start_timeline}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Info Call:</strong> {lead.info_call_availability}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Contact Method:</strong> {lead.preferred_contact_method}</td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#111827;">Source:</strong> {lead.source_channel or 'N/A'}</td></tr>
                            <tr><td style="padding:8px 0;"><strong style="color:#111827;">Message:</strong><br><span style="color:#6b7280;">{lead.message or 'N/A'}</span></td></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;background:#f9fafb;border-radius:0 0 12px 12px;">
                        <p style="color:#9ca3af;font-size:13px;margin:0;">© CareerLeap Academy. Submission received at {lead.created_at.strftime('%Y-%m-%d %H:%M:%S')}.</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[INTERNAL_RECIPIENT],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        logger.error(f"Failed to send internal lead notification: {e}")


def send_auto_reply(lead):
    """Send auto-reply email to the user."""
    first_name = lead.full_name.split()[0] if lead.full_name else 'there'

    subject = 'We received your CareerLeap journey request'

    message = f"""Hi {first_name},

Thank you for reaching out to CareerLeap.

We've received your submission and will review your information carefully. Based on your goals, we'll guide you toward the right next step — whether that is a simulation cohort, mentorship support, an info session, or a partnership conversation.

Our team will contact you soon.

Best regards,
CareerLeap Academy Team
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We received your request</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
        <tr><td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                    <td style="padding:40px 40px 20px 40px;text-align:center;border-bottom:1px solid #e5e7eb;">
                        <h1 style="color:#4f46e5;margin:0;font-size:28px;font-weight:800;">CareerLeap</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px;">
                        <h2 style="color:#111827;margin:0 0 20px 0;font-size:22px;font-weight:700;">We received your CareerLeap journey request</h2>
                        <p style="color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 20px 0;">
                            Hi {first_name},
                        </p>
                        <p style="color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 20px 0;">
                            Thank you for reaching out to CareerLeap.
                        </p>
                        <p style="color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 30px 0;">
                            We've received your submission and will review your information carefully. Based on your goals, we'll guide you toward the right next step — whether that is a simulation cohort, mentorship support, an info session, or a partnership conversation.
                        </p>
                        <p style="color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 30px 0;">
                            Our team will contact you soon.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                            <tr><td align="center">
                                <a href="{settings.FRONTEND_URL.rstrip('/')}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">Visit CareerLeap</a>
                            </td></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;background:#f9fafb;border-radius:0 0 12px 12px;">
                        <p style="color:#9ca3af;font-size:13px;margin:0;">Best regards,<br>CareerLeap Academy Team</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[lead.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        logger.error(f"Failed to send lead auto-reply to {lead.email}: {e}")


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method=['POST'])
def create_journey_lead(request):
    """
    Create a new lead from the Career Journey form.
    Rate limited to 5 submissions per minute per IP.
    """
    if getattr(request, 'limited', False):
        return Response({
            'success': False,
            'message': 'Too many requests. Please try again later.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    serializer = LeadJourneySerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    # Apply default values
    if not data.get('source_page'):
        data['source_page'] = 'CareerLeap Landing Page'

    # Compute lead classification, score, and temperature
    lead_type = classify_lead(data)
    lead_score = calculate_lead_score(data)
    lead_temperature = get_temperature(lead_score)

    # Create the lead
    lead = Lead.objects.create(
        full_name=data['full_name'],
        email=data['email'],
        phone=data.get('phone'),
        location=data['location'],
        career_stage=data['career_stage'],
        current_goal=data['current_goal'],
        track_interest=data['track_interest'],
        career_priority=data['career_priority'],
        start_timeline=data['start_timeline'],
        info_call_availability=data['info_call_availability'],
        preferred_contact_method=data['preferred_contact_method'],
        source_channel=data.get('source_channel'),
        message=data.get('message'),
        gdpr_consent=data['gdpr_consent'],
        marketing_consent=data.get('marketing_consent', False),
        lead_type=lead_type,
        lead_score=lead_score,
        lead_temperature=lead_temperature,
        source_page=data.get('source_page'),
        utm_source=data.get('utm_source'),
        utm_medium=data.get('utm_medium'),
        utm_campaign=data.get('utm_campaign'),
    )

    # Send emails
    send_internal_notification(lead)
    send_auto_reply(lead)

    logger.info(
        f"New lead created: {lead.full_name} ({lead.email}) — "
        f"Type: {lead.lead_type}, Score: {lead.lead_score}, Temp: {lead.lead_temperature}"
    )

    return Response({
        'success': True,
        'message': 'Thank you for starting your CareerLeap journey.',
        'lead_type': lead.get_lead_type_display(),
        'lead_score': lead.lead_score,
        'lead_temperature': lead.get_lead_temperature_display(),
    }, status=status.HTTP_201_CREATED)
