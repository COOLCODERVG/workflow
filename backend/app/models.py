import random

from django.contrib.auth.models import AbstractUser, Permission, Group
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = _('department')
        verbose_name_plural = _('departments')

    def __str__(self):
        return self.name
    
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


#------------------- User Model --------------------
class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    
    # Generate 6-digit random ID
    id = models.IntegerField(default=random.randint(100000, 999999), unique=True, primary_key=True)
    pfp = models.TextField(default='https://i.ibb.co/R932cKN/logo.png')
    initials = models.CharField(max_length=3, default='')
    department = models.ManyToManyField(Department, blank=True)
    team_lead = models.ManyToManyField(Department, blank=True, related_name='team_leads')
    display_team_lead = models.ManyToManyField(Department, blank=True, related_name='display_team_leads')
    contract = models.FileField(upload_to='contracts/', blank=True, null=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    groups = models.ManyToManyField(
        Group,
        related_name='custom_users',
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        related_query_name='custom_user',
        verbose_name=_('groups'),
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_users',
        related_query_name='custom_user',
        blank=True,
        verbose_name=_('user permissions'),
        help_text=_('Specific permissions for this user.'),
    )    


#------------------- Task Model --------------------
class Task(models.Model):
    assigned_users = models.ManyToManyField(
        CustomUser,
        related_name='tasks_assigned',
        verbose_name=_('assigned users'),
    )
    created_user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='tasks_created',
        verbose_name=_('created user'),
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name=_('department'),
    )
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_due_date = models.DateField()
    task_status = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)

    class Meta:
        verbose_name = _('task')
        verbose_name_plural = _('tasks')


from datetime import datetime
#------------------- ProgReport Model --------------------
class ProgReport(models.Model):
    user = models.ForeignKey(
        CustomUser,
        related_name='proguser',
        verbose_name=_('proguser'),
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        related_name='task',
        verbose_name=_('task'),
        on_delete=models.SET_NULL,
        null=True,
    )
    report_title = models.CharField(max_length=500)
    report_description = models.TextField()
    report_url = models.URLField()
    time_spent = models.IntegerField()
    date_submitted = models.DateTimeField(default=datetime.today)
    


#------------------- Reset Password Email --------------------
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail, EmailMessage

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    # the below like concatinates your websites reset password url and the reset email token which will be required at a later stage
    email_plaintext_message = "Open the link to reset your password for Dyne EMS" + " " + "{}{} \n \nDidn't reset your password?, Please safely ignore this email. \n\nDyne Management Team".format(instance.request.build_absolute_uri("http://localhost:5173/reset-password-form/"), reset_password_token.key)
    
    """
        this below line is the django default sending email function, 
        takes up some parameter (title(email title), message(email body), from(email sender), to(recipient(s))
    """
    send_mail(
        # title:
        "Password Reset for {title}".format(title="Dyne Research"),
        # message:
        email_plaintext_message,
        # from:
        "info@yourcompany.com",
        # to:
        [reset_password_token.user.email],
        fail_silently=False,
    )

class SP(models.Model):
    SP_dict = models.CharField(max_length=100000, unique=True)