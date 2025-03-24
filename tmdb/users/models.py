from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.db.models import Count, Case, When, Q
from django.utils import timezone

from articles.validators import MaxLengthValidator

def add_annotations(queryset, user):
    return queryset.annotate(following_count=Count('following', distinct=True),
                followers_count=Count('followers', distinct=True),
                user_follows=Case(When(Q(followers__in=[user.id]), then=True), default=False),
                current_user=Case(When(Q(id=user.id), then=True), default=False))

# Create your models here.
class AppUserManager(BaseUserManager):
    def get_annotated_queryset(self, user, **kwargs):
        if user.is_authenticated:
            queryset = super().get_queryset().exclude(id__in=list(user.blocked.values_list('id', 
                        flat=True))).filter(**kwargs)
        else:
            queryset = super().get_queryset().filter(**kwargs)

        return add_annotations(queryset, user)

    def create_user(self, email, password=None, **kwargs):        
        email = self.normalize_email(email)

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
    
class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username =  models.CharField(max_length=50, unique=True, blank=True)
    bio = models.TextField(default='This is where my bio would go, if I wrote one!', blank=True, validators=[MaxLengthValidator()])
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
