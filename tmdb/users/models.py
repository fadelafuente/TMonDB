from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Count, Case, When, Q
from django.utils import timezone
import re

# Create your models here.
class AppUserManager(BaseUserManager):
    def annotated_queryset(self, user, **kwargs):
        if user.is_authenticated:
            queryset = super().get_queryset().exclude(id__in=list(user.blocked.values_list('id', 
                        flat=True))).filter(**kwargs)
        else:
            queryset = super().get_queryset().filter(**kwargs)

        return queryset.annotate(following_count=Count('following', distinct=True),
                followers_count=Count('followers', distinct=True),
                user_follows=Case(When(Q(followers__in=[user.id]), then=True), default=False),
                current_user=Case(When(Q(id=user.id), then=True), default=False))

    def create_user(self, email, password=None, **kwargs):        
        email = self.normalize_email(email)
        self.inputValidation(email, kwargs['username'], password)

        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required')
        user = self.create_user(email, password, **kwargs)
        user.is_superuser = True
        user.save()
        return user
    
    def inputValidation(self, email, username, password):
        self.validateEmail(email)
        self.validateUsername(username)
        self.validatePassword(password)

    def validateEmail(self, email):
        if not email:
            raise ValueError('An email is required.')
        elif self.filter(email=email).exists():
            raise ValidationError('Account with that email already exists.')

    def validateUsername(self, username):
        if not username:
            raise KeyError('A username is required.')
        if self.filter(username=username).exists():
            raise ValueError('Account with that username already exists.')

    def validatePassword(self, password):
        if password:
            regex = re.compile('[@_!#$%^&*()<>?/|}{~:]')
            missing_requirements = []
            if len(password) < 8:
                missing_requirements.append('at least 8 characters')
            if len(password) > 20:
                missing_requirements.append('at most 20 characters')
            if not any(ele.isupper() for ele in password):
                missing_requirements.append('at least 1 uppercase')
            if not any(ele.islower() for ele in password):
                missing_requirements.append('at least 1 lowercase')
            if not any(ele.isdigit() for ele in password):
                missing_requirements.append('at least 1 number')
            if(regex.search(password) == None):
                missing_requirements.append('at least 1 special character')
            
            if missing_requirements:
                message = 'Password is missing: ' + ', '.join(requirement for requirement in missing_requirements) + '.'
                raise ValidationError(message)
    
class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username =  models.CharField(max_length=50, unique=True, blank=True)
    bio = models.TextField(default='This is where my bio would go, if I wrote one!', blank=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)
    blocking = models.ManyToManyField('self', symmetrical=False, related_name='blocked', blank=True)
    date_joined = models.DateTimeField(default=timezone.now, blank=True)

    # Considering removing:
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    # considering adding:
    # banner = models.ImageField(upload_to='', default='', null=True)
    # profile_picture = models.ImageField(upload_to='', default='', null=True)
    # people_you_may_know = models.ManyToManyField('self')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = AppUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']

    def get_username(self):
        return self.username
    
    def __str__(self) -> str:
        return self.username
