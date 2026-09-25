from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    """
    Extends Django's built-in User model.

    Fields:
    - role: "admin" or "user"
    - children: nullable boolean (maps to TINYINT(1))
    - activity: "low", "medium", or "high"
    """

    ROLE_CHOICES = (
        ("user", "user"),
        ("admin", "admin"),
    )

    ACTIVITY_CHOICES = (
        ("low", "low"),
        ("medium", "medium"),
        ("high", "high"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default="user"
    )

    children = models.BooleanField(
        null=True,
        blank=True
    )

    activity = models.CharField(
        max_length=10,
        choices=ACTIVITY_CHOICES,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.user.email} ({self.role})"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Ensures every User has a corresponding Profile.
    """
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()
