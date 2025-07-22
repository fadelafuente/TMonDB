from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Count, Q, Exists, OuterRef
from django.utils import timezone

UserModel = get_user_model()

class ArticleManager(models.Manager):
    def get_annotated_queryset(self, user, **kwargs):
        queryset = super().get_queryset().filter(**kwargs).select_related('article__creator')

        if user.is_authenticated:
            queryset = queryset.exclude(article__creator_id__in=list(user.blocking.values_list('id', 
                        flat=True))).exclude(article__creator_id__in=list(user.blocked.values_list('id', flat=True)))

            queryset = queryset.annotate(is_current_user=Q(article__creator__id=user.id),
                            user_liked=Exists(Article.objects.filter(id=OuterRef('article__id'), who_liked=user.id)),
                            user_reposted=Exists(Article.objects.filter(id=OuterRef('article__id'), who_reposted=user.id)),
                            user_commented=Exists(Article.objects.filter(comments__parent=OuterRef('article__id'), comments__article__creator=user.id).distinct()))
        
        return queryset.annotate(likes_count=Count('article__who_liked', distinct=True),
                            reposts_count=Count('article__who_reposted', distinct=True),
                            comments_count=Count('article__comments', distinct=True))

class Article(models.Model):
    creator = models.ForeignKey(UserModel, related_name='articles', on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    date_created = models.DateTimeField(default=timezone.now, blank=True)
    who_liked = models.ManyToManyField(UserModel, related_name='liked_posts', blank=True)
    who_reposted = models.ManyToManyField(UserModel, related_name='reposts', blank=True)