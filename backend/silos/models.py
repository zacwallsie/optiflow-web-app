from django.db import models, connection
from django.conf import settings
import uuid


class UserSilo(models.Model):
    id = models.UUIDField(
        primary_key=True, unique=True, default=uuid.uuid4, editable=False
    )  # Ensures each silo has a unique UUID
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="silos"
    )
    silo_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "silos"
        managed = True
        unique_together = (
            "user",
            "silo_name",
        )  # Ensures user cannot have duplicate schema names

    def __str__(self):
        return f"{self.schema_name} owned by {self.user}"
