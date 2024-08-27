from django.db import models
from django.contrib.auth import get_user_model
from monsters.models import Monster

UserModel = get_user_model()

# Create your models here.
class Post(models.Model):
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    posted_date = models.DateTimeField(null=False)
    is_repost = models.BooleanField(default=False)
    is_reply = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    creator = models.ForeignKey(UserModel, related_name="posts", on_delete=models.SET_NULL, null=True)
    who_liked = models.ManyToManyField(UserModel, related_name="liked_posts", blank=True)
    who_reposted = models.ManyToManyField(UserModel, related_name="reposts", blank=True)
    parent = models.ForeignKey("self", related_name="comments", on_delete=models.SET_NULL, blank=True, null=True)
    parent_deleted = models.BooleanField(default=False)
    monster = models.OneToOneField(Monster, on_delete=models.CASCADE, null=True, blank=True)
    # is_deleted = models.BooleanField(default=False)
