from datetime import datetime
from django.db import models

# Create your models here.
class Post(models.Model):
    class meta:
        ordering = ['-id']

    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    reposts_count = models.IntegerField(default=0)
    posted_date = models.DateTimeField(default=datetime.now().astimezone())
    is_repost = models.BooleanField(default=False)
    is_reply = models.BooleanField(default=False)

    '''
    TO BE ADDED:
    creator = models.ForeignKey(userModel, related_name="posts", on_delete=models.CASCADE)
    who_liked = models.ManyToManyField(userModel, related_name="likes")
    who_reposted = models.ManyToManyField(userModel, related_name="reposts")
    comments = models.ManyToManyField("self", related_name="parent_post")
    '''
