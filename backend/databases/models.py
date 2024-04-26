from django.db import models
from django.conf import settings


class UserDatabase(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="databases"
    )
    name = models.CharField(max_length=100, unique=True)
    hostname = models.CharField(max_length=255, default="localhost")
    port = models.IntegerField(default=5432)
    db_username = models.CharField(max_length=100)
    db_password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "databases"

    def __str__(self):
        return self.name
