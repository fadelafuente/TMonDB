from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from articles.models import Article, ArticleManager

UserModel = get_user_model()

class PostManager(ArticleManager):
    pass
    
class Post(models.Model):
    article = models.OneToOneField(Article, related_name='post', on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    posted_date = models.DateTimeField(default=timezone.now, blank=True)
    is_repost = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    parent = models.ForeignKey(Article, related_name='comments', on_delete=models.SET_NULL, blank=True, null=True)
    
    objects = PostManager()