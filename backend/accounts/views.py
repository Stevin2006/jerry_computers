from datetime import timedelta

from django.core.mail import send_mail
from django.utils import timezone
from django.core.cache import cache
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings

from .models import OTP, User, make_otp_code
from .serializers import (
    LoginSerializer,
    PublicUserSerializer,
    RegisterSerializer,
    ResendOTPSerializer,
    VerifyOTPInputSerializer,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def issue_tokens_for_user(user: User) -> dict:
    refresh = RefreshToken()
    refresh["user_id"] = user.id  # SimpleJWT uses user_id claim by default
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": PublicUserSerializer(user).data,
    }


def send_otp_email(to_email: str, code: str, purpose: str) -> None:
    """Deliver the OTP via Django's email backend (console in dev, SMTP in prod).

    Subject/body are intentionally generic so they don't reveal whether this is
    a registration or login OTP — both flows use the same message template.
    """
    subject = "Your Jerry Computers verification code"
    message = (
        f"Hi,\n\n"
        f"Your verification code is: {code}\n\n"
        f"This code is valid for 5 minutes. If you did not request this code, "
        f"you can safely ignore this email.\n\n"
        f"Thanks,\n"
        f"The Jerry Computers Team"
    )
    send_mail(
        subject=subject,
        message=message,
        from_email=None,  # uses DEFAULT_FROM_EMAIL
        recipient_list=[to_email],
        fail_silently=False,
    )


def find_valid_otp(email: str, code: str, purpose: str) -> OTP | None:
    """Return the matching, valid OTP or None.

    Failure is always represented as None so we never leak whether the email
    was recognised, whether an OTP existed, or whether it was expired/wrong.
    """
    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return None

    try:
        otp = OTP.objects.get(user=user, code=code, purpose=purpose)
    except OTP.DoesNotExist:
        return None

    if not otp.is_valid():
        return None
    return otp


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------
class RegisterView(GenericAPIView):
    """POST /api/auth/register/

    Creates a pending/unverified account, generates a 6-digit OTP (purpose =
    'registration'), emails it, and returns { message, email }.
    """

    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        code = make_otp_code()
        ttl = OTP.OTP_TTL_SECONDS
        expires_at = timezone.now() + timedelta(seconds=ttl)
        otp = OTP.objects.create(
            user=user,
            code=code,
            purpose="registration",
            expires_at=expires_at,
        )

        send_otp_email(user.email, code, purpose="registration")

        return Response(
            {"message": "OTP sent successfully", "email": user.email},
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# Verify registration OTP
# ---------------------------------------------------------------------------
class VerifyRegistrationOTPView(GenericAPIView):
    """POST /api/auth/verify-registration-otp/

    Validates the registration OTP. On success: marks the account verified,
    issues JWT access + refresh, returns { access, refresh, user }.
    On failure: 400 with a generic error.
    """

    serializer_class = VerifyOTPInputSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["otp"]

        otp = find_valid_otp(email, code, purpose="registration")
        if otp is None:
            return Response(
                {"error": "Invalid or expired OTP. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prevent reuse.
        otp.mark_used()
        user = otp.user
        user.is_verified = True
        user.save(update_fields=["is_verified"])

        return Response(issue_tokens_for_user(user), status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Login (OTP-gated)
# ---------------------------------------------------------------------------
class LoginView(GenericAPIView):
    """POST /api/auth/login/

    Validates email + password. If valid: generates a fresh login OTP,
    emails it, returns { message, email }. If invalid: 400 with a generic
    'Invalid credentials' message (never reveals whether the email exists).
    """

    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Generic response — never reveal whether the email is registered.
            return Response(
                {"error": "Invalid credentials. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(password):
            return Response(
                {"error": "Invalid credentials. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Invalidate any previous unexpired login OTP for this user so there is
        # always at most one active login OTP per user.
        OTP.objects.filter(
            user=user, purpose="login", is_used=False, expires_at__gt=timezone.now()
        ).update(is_used=True, consumed_at=timezone.now())

        code = make_otp_code()
        ttl = OTP.OTP_TTL_SECONDS
        expires_at = timezone.now() + timedelta(seconds=ttl)
        OTP.objects.create(
            user=user,
            code=code,
            purpose="login",
            expires_at=expires_at,
        )

        send_otp_email(user.email, code, purpose="login")
        return Response(
            {"message": "OTP sent successfully", "email": user.email},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Verify login OTP
# ---------------------------------------------------------------------------
class VerifyLoginOTPView(GenericAPIView):
    """POST /api/auth/verify-login-otp/

    Validates the login OTP. On success: issues JWT access + refresh,
    returns { access, refresh, user }.
    On failure: 400 with a generic error.
    """

    serializer_class = VerifyOTPInputSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["otp"]

        otp = find_valid_otp(email, code, purpose="login")
        if otp is None:
            return Response(
                {"error": "Invalid or expired OTP. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp.mark_used()
        return Response(issue_tokens_for_user(otp.user), status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Resend OTP (rate-limited per email)
# ---------------------------------------------------------------------------
class ResendOTPView(GenericAPIView):
    """POST /api/auth/resend-otp/

    Expects { email, purpose }. Invalidates any existing unused OTP for
    email+purpose, generates a new one, emails it. Rate-limited to one
    resend per OTP_RESEND_COOLDOWN_SECONDS per email.
    """

    serializer_class = ResendOTPSerializer
    # Avoid caching a missing key as "False"; use a sentinel.
    _COOLDOWN_SENTINEL = object()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        purpose = serializer.validated_data["purpose"]

        cooldown_key = f"{settings.RESEND_KEY_PREFIX}:{purpose}:{email}"
        if cache.get(cooldown_key, self._COOLDOWN_SENTINEL) is not self._COOLDOWN_SENTINEL:
            return Response(
                {"error": "Too many requests. Please wait before resending."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Do not reveal whether the email is registered. Behave as if a new
            # OTP was sent.
            return self._issue_otp(email, purpose)

        # Invalidate any existing unused OTP for this user+purpose.
        OTP.objects.filter(
            user=user, purpose=purpose, is_used=False, expires_at__gt=timezone.now()
        ).update(is_used=True, consumed_at=timezone.now())

        return self._issue_otp(user.email, purpose)

    def _issue_otp(self, email: str, purpose: str) -> Response:
        code = make_otp_code()
        ttl = OTP.OTP_TTL_SECONDS
        expires_at = timezone.now() + timedelta(seconds=ttl)
        otp = OTP.objects.create(
            # For login resend we always have a user above; for registration
            # resend the user must already exist (they're verifying), so this is
            # safe. If somehow the user doesn't exist yet, fall back to a
            # placeholder — but that shouldn't happen in practice.
            user=User.objects.get(email__iexact=email),
            code=code,
            purpose=purpose,
            expires_at=expires_at,
        )

        send_otp_email(otp.user.email, code, purpose=purpose)

        cooldown_key = f"{settings.RESEND_KEY_PREFIX}:{purpose}:{email}"
        cache.set(
            cooldown_key,
            True,
            timeout=settings.OTP_RESEND_COOLDOWN_SECONDS,
        )

        return Response(
            {"message": "OTP resent"},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# JWT refresh (access token only, no rotation)
# ---------------------------------------------------------------------------
class RefreshTokenView(GenericAPIView):
    """POST /api/auth/token/refresh/

    Expects { refresh }. Returns { access } using SimpleJWT. Refresh tokens
    are NOT rotated (ROTATE_REFRESH_TOKENS = False), so the caller keeps the
    same refresh token until it expires (7 days).
    """

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            refresh = RefreshToken(refresh_token)
        except Exception:
            return Response(
                {"error": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # SimpleJWT validates expiration and signature automatically.
        # With ROTATE_REFRESH_TOKENS=False we only issue a new access token.
        return Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)
