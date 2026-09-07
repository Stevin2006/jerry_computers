from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# ---------------------------------------------------------------------------
# Role choices
# ---------------------------------------------------------------------------
class RoleChoice(models.TextChoices):
    USER = "user", _("Customer")
    ADMIN = "admin", _("Administrator")


# ---------------------------------------------------------------------------
# Custom user manager
# ---------------------------------------------------------------------------
class UserManager(BaseUserManager):
    """Creates and saves users by email (no username field)."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", RoleChoice.ADMIN)
        return self.create_user(email, password, **extra_fields)


# ---------------------------------------------------------------------------
# Custom user model
# ---------------------------------------------------------------------------
class User(AbstractBaseUser, PermissionsMixin):
    """Jerry Computers user.

    Login is by email. Public registration never sets ``role`` — it always
    defaults to ``user``. Admin accounts are created/managed through Django
    admin (or a future admin-only endpoint the frontend does not expose).
    """

    email = models.EmailField(
        _("email address"),
        unique=True,
        db_index=True,
        error_messages={
            "unique": _("A user with that email address already exists."),
        },
    )
    name = models.CharField(_("name"), max_length=150, blank=True)
    phone = models.CharField(
        _("phone"),
        max_length=32,
        blank=True,
        help_text=_("Optional contact number. Format is not enforced here."),
    )
    role = models.CharField(
        _("role"),
        max_length=10,
        choices=RoleChoice.choices,
        default=RoleChoice.USER,
    )
    is_verified = models.BooleanField(
        _("verified"),
        default=False,
        help_text=_("Whether the user has verified their email via OTP."),
    )
    phone_verified = models.BooleanField(
        _("phone verified"),
        default=False,
        help_text=_("Whether the user has verified their phone number."),
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into the admin site."),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)
    last_login = models.DateTimeField(_("last login"), blank=True, null=True)

    # Disambiguate the reverse accessors inherited from AbstractBaseUser and
    # PermissionsMixin so this custom model can coexist with Django's built-in
    # auth.User (which still exists in the project's auth app).
    groups = models.ManyToManyField(
        Group,
        verbose_name=_("groups"),
        blank=True,
        help_text=_(
            "The groups this user belongs to. A user will get all permissions "
            "granted to each of their groups."
        ),
        related_name="accounts_user_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_("user permissions"),
        blank=True,
        help_text=_("Specific permissions for this user."),
        related_name="accounts_user_set",
        related_query_name="user",
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name.strip() or self.email.split("@")[0]

    def get_short_name(self):
        return self.name.split(" ")[0] if self.name else self.email.split("@")[0]

    @property
    def is_admin(self):
        return self.role == RoleChoice.ADMIN


# ---------------------------------------------------------------------------
# One-time password (OTP)
# ---------------------------------------------------------------------------
class OTP(models.Model):
    """Email OTP used for registration verification and login.

    * One active OTP per user+purpose at a time.
    * Single-use: once verified it is marked used and cannot be reused.
    * Expires 5 minutes after creation.
    * After 5 wrong guesses the OTP is invalidated; the user must resend.
    """

    purpose_choices = models.TextChoices(
        "OTPPurpose",
        "registration login",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="otps",
        db_index=True,
    )
    code = models.CharField(_("code"), max_length=6)
    purpose = models.CharField(
        _("purpose"),
        max_length=12,
        choices=purpose_choices.choices,
        db_index=True,
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True, db_index=True)
    expires_at = models.DateTimeField(_("expires at"), db_index=True)
    is_used = models.BooleanField(_("used"), default=False, db_index=True)
    attempts = models.PositiveSmallIntegerField(
        _("wrong attempts"),
        default=0,
        help_text=_("Number of incorrect verification attempts."),
    )
    consumed_at = models.DateTimeField(
        _("consumed at"), null=True, blank=True
    )

    class Meta:
        verbose_name = _("one-time password")
        verbose_name_plural = _("one-time passwords")
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["user", "purpose", "is_used", "expires_at"],
                name="accounts_otp_active_idx",
            ),
        ]

    OTP_TTL_SECONDS = 5 * 60  # 5 minutes
    MAX_ATTEMPTS = 5

    def __str__(self):
        code_preview = f"{self.code[:1]}***{self.code[-1]}"
        return f"{self.purpose} · {code_preview} · {self.email}"

    @property
    def email(self):
        return self.user.email if self.user_id else ""

    def is_valid(self):
        """True when the OTP exists, is unused, has not expired, and is not locked."""
        if self.is_used:
            return False
        if self.attempts >= self.MAX_ATTEMPTS:
            return False
        return self.expires_at > timezone.now()

    def mark_used(self):
        self.is_used = True
        self.consumed_at = timezone.now()
        self.save(update_fields=["is_used", "consumed_at"])

    def record_wrong_attempt(self):
        if self.attempts >= self.MAX_ATTEMPTS:
            return
        self.attempts += 1
        if self.attempts >= self.MAX_ATTEMPTS:
            # Lock out by marking as used so no future attempt can succeed.
            self.is_used = True
            self.consumed_at = timezone.now()
        self.save(update_fields=["attempts", "is_used", "consumed_at"])


def make_otp_code() -> str:
    """Return a cryptographically random 6-digit code as a string (preserves leading zeros)."""
    import secrets
    return f"{secrets.randbelow(1_000_000):06d}"
