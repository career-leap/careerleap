import uuid
from django.db import models
from accounts.models import User


class MentorProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='mentor_profile'
    )
    hourly_rate = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        db_index=True
    )
    expertise = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True, db_index=True)
    total_sessions = models.IntegerField(default=0)
    average_rating = models.DecimalField(
        max_digits=2, 
        decimal_places=1, 
        default=0.0,
        db_index=True
    )
    bio = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mentor_profiles'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Mentor: {self.user.get_full_name()}"
    
    def update_rating(self, new_rating):
        if self.total_sessions > 0:
            total = self.average_rating * self.total_sessions
            self.average_rating = (total + new_rating) / (self.total_sessions + 1)
        else:
            self.average_rating = new_rating
        self.total_sessions += 1
        self.save()
