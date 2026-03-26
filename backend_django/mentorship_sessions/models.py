import uuid
from django.db import models
from accounts.models import User


class Session(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentee = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='mentee_sessions'
    )
    mentor = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='mentor_sessions'
    )
    scheduled_at = models.DateTimeField()
    duration = models.IntegerField(default=60)  # in minutes
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    topic = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES, 
        default='pending'
    )
    meeting_link = models.CharField(max_length=255, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Session: {self.mentee.get_full_name()} with {self.mentor.get_full_name()}"
