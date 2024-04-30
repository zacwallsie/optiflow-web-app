from rest_framework import serializers
from .models import UserSilo
from django.db import IntegrityError


class UserSiloSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSilo
        fields = ["id", "schema_name", "user", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def create(self, validated_data):
        # Assumes `user` is still automatically attached in the view.
        validated_data["user"] = self.context["request"].user
        try:
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError(
                {"detail": "This silo name is already used by you."}
            )
