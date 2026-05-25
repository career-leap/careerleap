from rest_framework import serializers
from .models import Lead


class LeadJourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'full_name', 'email', 'phone', 'location',
            'career_stage', 'current_goal', 'track_interest', 'career_priority',
            'start_timeline', 'info_call_availability', 'preferred_contact_method',
            'source_channel', 'message',
            'gdpr_consent', 'marketing_consent',
            'source_page', 'utm_source', 'utm_medium', 'utm_campaign',
        ]

    def validate_email(self, value):
        return value.lower().strip()

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required.")
        return value.strip()

    def validate_gdpr_consent(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the privacy policy to continue.")
        return value

    def validate_current_goal(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError("Select at least one goal.")
        return value
