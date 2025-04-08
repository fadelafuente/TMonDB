from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Count, Q, Case, When
from django.utils import timezone


UserModel = get_user_model()

class ArticleManager(models.Manager):
    def get_annotated_queryset(self, user, **kwargs):
        if user.is_authenticated:
            queryset = super().get_queryset().exclude(article__creator_id__in=list(user.blocking.values_list('id', 
                        flat=True))).exclude(article__creator_id__in=list(user.blocked.values_list('id', flat=True))).filter(**kwargs)
        else:
            queryset = super().get_queryset().filter(**kwargs)

        return queryset.annotate(likes_count=Count('article__who_liked', distinct=True),
                            reposts_count=Count('article__who_reposted', distinct=True),
                            comments_count=Count('article__comments', distinct=True),
                            is_current_user=Q(article__creator__id=user.id),
                            user_liked=Case(When(Q(article__who_liked__in=[user.id]), then=True), default=False),
                            user_reposted=Case(When(Q(article__who_reposted__in=[user.id]), then=True), default=False),
                            user_commented=Q(article__comments__isnull=False) & Q(article__comments__article__creator__id=user.id))

# Create your models here.
class Article(models.Model):
    creator = models.ForeignKey(UserModel, related_name='articles', on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    date_created = models.DateTimeField(default=timezone.now, blank=True)
    who_liked = models.ManyToManyField(UserModel, related_name='liked_posts', blank=True)
    who_reposted = models.ManyToManyField(UserModel, related_name='reposts', blank=True)