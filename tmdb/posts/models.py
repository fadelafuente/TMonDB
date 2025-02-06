from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from articles.models import Article

UserModel = get_user_model()


class PostManager(models.Manager):
    def with_article_details(self):
        return self.annotate(likes_count=Count("article__who_liked", distinct=True),
                            reposts_count=Count("article__who_reposted", distinct=True),
                            comments_count=Count("article__comments", distinct=True))
    
    def create(self, **kwargs):
        instance = super().create(**kwargs)

        # if instance:
        #     Article.objects.create({'creator': instance.id})

        return instance
    
# Create your models here.
class Post(models.Model):
    article = models.OneToOneField(Article, related_name="post", on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    posted_date = models.DateTimeField(null=False)
    is_repost = models.BooleanField(default=False)
    is_reply = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    parent = models.ForeignKey(Article, related_name="comments", on_delete=models.SET_NULL, blank=True, null=True)
    objects = PostManager()