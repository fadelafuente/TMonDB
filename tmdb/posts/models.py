from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.
class Post(models.Model):
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    reposts_count = models.IntegerField(default=0)
    posted_date = models.DateTimeField(null=False)
    is_repost = models.BooleanField(default=False)
    is_reply = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    creator = models.ForeignKey(UserModel, related_name="posts", on_delete=models.CASCADE)

    '''
    TO BE ADDED:
    who_liked = models.ManyToManyField(userModel, related_name="likes")
    who_reposted = models.ManyToManyField(userModel, related_name="reposts")
    comments = models.ManyToManyField("self", related_name="parent_post")
    '''
