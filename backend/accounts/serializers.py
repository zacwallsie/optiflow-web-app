from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import EmailValidator
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

logger = __import__("logging").getLogger(__name__)


class RegisterUserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    email = serializers.EmailField(
        validators=[EmailValidator(), UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ["id", "name", "email", "password", "token"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 8},
        }

    def get_token(self, user):
        token = RefreshToken.for_user(user)
        data = {"refresh": str(token), "access": str(token.access_token)}
        return data

    def create(self, validated_data):
        # Ensure that the create_user method is used to hash the password properly
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data.get("name"),
        )
        return user


class UserProfileSeralizer(serializers.ModelSerializer):
    """Use this serializer to get the user profile"""

    class Meta:
        model = User
        fields = ["id", "name", "email"]

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        return instance
