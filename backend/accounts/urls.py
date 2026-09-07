from django.urls import path

from . import views

urlpatterns = [
    # Registration
    path(
        "register/",
        views.RegisterView.as_view(),
        name="auth-register",
    ),
    path(
        "verify-registration-otp/",
        views.VerifyRegistrationOTPView.as_view(),
        name="auth-verify-registration-otp",
    ),
    # Login (OTP-gated)
    path(
        "login/",
        views.LoginView.as_view(),
        name="auth-login",
    ),
    path(
        "verify-login-otp/",
        views.VerifyLoginOTPView.as_view(),
        name="auth-verify-login-otp",
    ),
    # Resend OTP
    path(
        "resend-otp/",
        views.ResendOTPView.as_view(),
        name="auth-resend-otp",
    ),
    # JWT refresh — returns { access } only (no refresh rotation).
    path(
        "token/refresh/",
        views.RefreshTokenView.as_view(),
        name="token_refresh",
    ),
]
