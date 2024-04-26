from rest_framework import serializers
from .models import UserDatabase


class UserDatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDatabase
        fields = [
            "id",
            "name",
            "hostname",
            "port",
            "db_username",
            "db_password",
            "created_at",
        ]
        extra_kwargs = {"db_password": {"write_only": True}}
