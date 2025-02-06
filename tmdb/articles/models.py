from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.
class Article(models.Model):
    creator = models.ForeignKey(UserModel, related_name="articles", on_delete=models.SET_NULL, null=True, blank=True)
    who_liked = models.ManyToManyField(UserModel, related_name="liked_posts", blank=True)
    who_reposted = models.ManyToManyField(UserModel, related_name="reposts", blank=True)