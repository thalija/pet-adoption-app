import jwt
from datetime import datetime, timedelta, timezone as dt_timezone

from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({"message": "Registration successful."}, status=status.HTTP_201_CREATED)


def _make_access_token(email: str, role: str) -> str:
    now = datetime.now(dt_timezone.utc)
    exp = now + timedelta(minutes=settings.JWT_ACCESS_TTL_MINUTES)

    payload = {
        "email": email,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


class TokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        token = _make_access_token(user.email, user.role)

        return Response(
            {
                "access": token,
                "token_type": "Bearer",
                "user": {
                    "email": user.email,
                    "role": user.role,
                    "children": user.children,
                    "activity": user.activity,
                },
            }
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # set by MariaDBJWTAuthentication
        db_user = getattr(request, "db_user", None)
        if not db_user:
            return Response({"error": "User not loaded."}, status=401)

        return Response(
            {
                "email": db_user.email,
                "role": db_user.role,
                "children": db_user.children,
                "activity": db_user.activity,
            }
        )