import jwt
from dataclasses import dataclass
from django.conf import settings
from rest_framework import authentication, exceptions
from dbmodels.models import Users


@dataclass
class SimpleUser:
    """
    Minimal user object that DRF permissions can use.
    """
    email: str
    role: str

    @property
    def is_authenticated(self) -> bool:
        return True


class MariaDBJWTAuthentication(authentication.BaseAuthentication):
    """
    Reads Authorization: Bearer <token>
    Validates JWT and loads the MariaDB Users row.
    """

    def authenticate(self, request):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None  # no credentials -> DRF will treat as unauthenticated

        token = auth.split(" ", 1)[1].strip()
        if not token:
            raise exceptions.AuthenticationFailed("Missing token")

        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        email = payload.get("email")
        if not email:
            raise exceptions.AuthenticationFailed("Invalid token payload")

        try:
            db_user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found")

        # Attach DB user for convenience
        request.db_user = db_user

        # Return (user, auth) tuple. user must have is_authenticated.
        return SimpleUser(email=db_user.email, role=db_user.role), token