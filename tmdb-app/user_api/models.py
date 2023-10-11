from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.
class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("An email is required.")
        if not username:
            raise ValueError("A username is required.")
        if not password:
            raise ValueError("A password is required")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password=None):
        if not email:
            raise ValueError("An email is required.")
        if not username:
            raise ValueError("A username is required.")
        if not password:
            raise ValueError("A password is required")
        user = self.create_user(email, password)
        user.is_superuser = True
        user.save()
        return user
    
class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username =  models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    def get_username(self):
        return self.username
    
    def __str__(self) -> str:
        return self.username
