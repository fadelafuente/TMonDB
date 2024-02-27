from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.
class Post(models.Model):
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    comments_count = models.IntegerField(default=0)
    posted_date = models.DateTimeField(null=False)
    is_repost = models.BooleanField(default=False)
    is_reply = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    creator = models.ForeignKey(UserModel, related_name="posts", on_delete=models.PROTECT)
    who_liked = models.ManyToManyField(UserModel, related_name="liked_posts", blank=True)
    who_reposted = models.ManyToManyField(UserModel, related_name="reposts", blank=True)

    '''
    TO BE ADDED:
    comments = models.ManyToManyField("self", related_name="parent_post")
    '''
