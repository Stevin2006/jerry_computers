from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


# ---------------------------------------------------------------------------
# Public user shape returned inside JWT responses
# ---------------------------------------------------------------------------
class PublicUserSerializer(serializers.ModelSerializer):
    """Lightweight user representation returned in access/refresh responses.

    Includes at least id, email, name, role (plus phone, which is harmless
    and may be useful to the frontend).
    """

    class Meta:
        model = User
        fields = ["id", "email", "name", "role", "phone"]


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------
class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True,required=False)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True, default="")

    def validate(self, data):
        if User.objects.filter(email__iexact=data["email"]).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email address is already registered."}
            )
        return data

    def create(self, validated_data):
        # role is never accepted from the request; always default to "user".
        validated_data.pop("password_confirm", None)
        name = validated_data.get("name", "").strip()
        phone = validated_data.get("phone", "").strip()
        validated_data["name"] = name if name else ""
        validated_data["phone"] = phone if phone else ""
        return User.objects.create_user(
            email=validated_data["email"].lower(),
            password=validated_data["password"],
            name=validated_data.get("name", ""),
            phone=validated_data.get("phone", ""),
        )


# ---------------------------------------------------------------------------
# OTP verification (registration + login share the same input shape)
# ---------------------------------------------------------------------------
class VerifyOTPInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# ---------------------------------------------------------------------------
# Resend OTP
# ---------------------------------------------------------------------------
class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=["registration", "login"])

    def validate_email(self, value):
        # We accept any well-formed email; whether it maps to a real account is
        # decided in the view (login resend can be requested for any email, but
        # we still won't reveal existence).
        return value.lower()
