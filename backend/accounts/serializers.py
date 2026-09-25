from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import serializers

from dbmodels.models import Users


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    # Accept "user" from frontend but normalize to DB's "public"
    role = serializers.ChoiceField(choices=["user", "public", "admin"], default="user")

    children = serializers.IntegerField(required=False, allow_null=True)
    activity = serializers.CharField(required=False, allow_null=True)

    secretKey = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate_children(self, value):
        if value is None:
            return None
        if value in (0, 1):
            return value
        raise serializers.ValidationError("children must be 0, 1, or null.")

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        role = attrs.get("role", "user")

        if role == "user":
            role = "public"
            attrs["role"] = "public"

        if Users.objects.filter(email=email).exists():
            raise serializers.ValidationError({"error": "An account with this email already exists."})

        if role != "public":
            attrs.pop("children", None)
            attrs.pop("activity", None)

        if role == "admin":
            secret = (attrs.get("secretKey") or "").strip()
            expected = getattr(settings, "ADMIN_SECRET_KEY", None)
            if not secret:
                raise serializers.ValidationError({"error": "Admin secret key is required."})
            if expected is None:
                raise serializers.ValidationError({"error": "Server admin secret key not configured."})
            if secret != expected:
                raise serializers.ValidationError({"error": "Invalid admin secret key."})

        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()
        raw_password = validated_data["password"]
        role = validated_data.get("role", "public")
        if role == "user":
            role = "public"

        now = timezone.now()

        return Users.objects.create(
            email=email,
            password=make_password(raw_password),  # hashed
            role=role,  # public/admin
            datecreated=now,
            children=validated_data.get("children") if role == "public" else None,
            activity=validated_data.get("activity") if role == "public" else None,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid email or password."})

        if not check_password(password, user.password):
            raise serializers.ValidationError({"error": "Invalid email or password."})

        attrs["user"] = user
        return attrs