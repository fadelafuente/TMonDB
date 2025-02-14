from articles.serializers import ArticleCreatorSerializer, ModelWithArticleSerializer
from .models import *

class MonsterSerializer(ModelWithArticleSerializer):
    model = Monster

    class Meta:
        model = Monster
        fields = '__all__'

class MonsterScrollSerializer(MonsterSerializer):
    likes_count = models.IntegerField()
    reposts_count = models.IntegerField()
    comments_count = models.IntegerField()
    article = ArticleCreatorSerializer()