from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from django.utils import timezone

from articles.models import Article, ArticleManager

UserModel = get_user_model()

class PostManager(ArticleManager):
    def get_annotated_queryset(self, user, **kwargs):
        return super().get_annotated_queryset(user, **kwargs).annotate(user_commented=Q(parent__comments__article__creator__isnull=False) & 
                            Q(parent__comments__article__creator__id=user.id))
    
class Post(models.Model):
    article = models.OneToOneField(Article, related_name='post', on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    is_repost = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    parent = models.ForeignKey(Article, related_name='comments', on_delete=models.SET_NULL, blank=True, null=True)
    
    objects = PostManager()