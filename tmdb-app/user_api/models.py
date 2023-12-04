from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
# from django.utils import timezone

# Create your models here.
class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("An email is required.")
        
        email = self.normalize_email(email)

        # if username is provided by user, create a random one?
        # if username is None:
        #   username = generateRandomUsername()

        # check if username already exists
        # if not AppUser.objects.filter(username="check").exists():
        #   raise ValueError("username already exists")


        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("An email is required.")
        if not password:
            raise ValueError("A password is required")
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.save()
        return user
    
class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username =  models.CharField(max_length=50)

    # Considering removing:
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    # considering adding:
    # bio = models.TextField(null=True)
    # profile_picture = models.ImageField(upload_to="", default="", null=True)
    # friends = models.ManyToManyField("self")
    # people_you_may_know = models.ManyToManyField("self")
    # date_joined = models.DateTimeField(default=timezone.now)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = AppUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_username(self):
        return self.username
    
    def __str__(self) -> str:
        return self.username
