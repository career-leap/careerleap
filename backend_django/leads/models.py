import uuid
from django.db import models


class Lead(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    ]

    TYPE_CHOICES = [
        ('participant', 'Participant Lead'),
        ('mentor', 'Mentor Lead'),
        ('partner', 'Partner Lead'),
        ('institutional', 'Institutional Lead'),
        ('general', 'General Lead'),
    ]

    TEMPERATURE_CHOICES = [
        ('hot', 'Hot'),
        ('warm', 'Warm'),
        ('cold', 'Cold'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=100)

    career_stage = models.CharField(max_length=100)
    current_goal = models.JSONField(default=list)
    track_interest = models.CharField(max_length=100)
    career_priority = models.CharField(max_length=100)

    start_timeline = models.CharField(max_length=100)
    info_call_availability = models.CharField(max_length=20)
    preferred_contact_method = models.CharField(max_length=50)
    source_channel = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField(blank=True, null=True)

    gdpr_consent = models.BooleanField(default=False)
    marketing_consent = models.BooleanField(default=False)

    lead_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    lead_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general')
    lead_score = models.IntegerField(default=0)
    lead_temperature = models.CharField(max_length=10, choices=TEMPERATURE_CHOICES, default='cold')

    source_page = models.CharField(max_length=255, blank=True, null=True)
    utm_source = models.CharField(max_length=255, blank=True, null=True)
    utm_medium = models.CharField(max_length=255, blank=True, null=True)
    utm_campaign = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f"{self.full_name} — {self.lead_type} ({self.lead_temperature}, {self.lead_score})"
