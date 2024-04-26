from .models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.db import IntegrityError
from rest_framework.response import Response
from .serializers import RegisterUserSerializer, UserProfileSeralizer
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

# import ValidationError from rest_framework.exceptions
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView


from django.db import IntegrityError
from rest_framework.exceptions import ValidationError


class RegisterUserView(generics.CreateAPIView):
    """Register a new user and return a token for the user"""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    serializer_class = RegisterUserSerializer

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            if response.status_code == status.HTTP_201_CREATED:
                user_id = response.data.get("id")
                user = User.objects.get(id=user_id)
                token = RegisterUserSerializer().get_token(user)
                response.data = token
            return response
        except ValidationError as exc:
            if "email" in exc.detail and "unique" in exc.detail["email"][0].lower():
                return Response(
                    {"detail": "An account with this email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response({"detail": exc.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""

    serializer_class = UserProfileSeralizer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get_object(self):
        return self.request.user
