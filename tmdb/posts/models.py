from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Count, Q, Case, When
from django.utils import timezone

from articles.models import Article

UserModel = get_user_model()


class PostManager(models.Manager):
    def get_annotated_queryset(self, user):
        queryset = super().get_queryset()
        if user.is_authenticated:
            queryset = self.exclude(article__creator_id__in=list(user.blocking.values_list('id', flat=True)))
            queryset = queryset.exclude(article__creator_id__in=list(user.blocked.values_list('id', flat=True)))

        return queryset.annotate(likes_count=Count("article__who_liked", distinct=True),
                            reposts_count=Count("article__who_reposted", distinct=True),
                            comments_count=Count("article__comments", distinct=True),
                            is_current_user=Q(article__creator__id=user.id),
                            user_liked=Case(When(Q(article__who_liked__in=[user.id]), then=True), default=False),
                            user_reposted=Case(When(Q(article__who_reposted__in=[user.id]), then=True), default=False),
                            user_commented=Q(parent__comments__article__creator__isnull=False) & 
                            Q(parent__comments__article__creator__id=user.id))
    
class Post(models.Model):
    article = models.OneToOneField(Article, related_name="post", on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    posted_date = models.DateTimeField(default=timezone.now, blank=True)
    is_repost = models.BooleanField(default=False)
    is_reply = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    parent = models.ForeignKey(Article, related_name="comments", on_delete=models.SET_NULL, blank=True, null=True)
    objects = PostManager()