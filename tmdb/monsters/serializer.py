from articles.serializers import ArticleCreatorSerializer, ModelWithArticleSerializer
from .models import *

class MonsterSerializer(ModelWithArticleSerializer):
    model = Monster

    class Meta:
        model = Monster
        fields = '__all__'

class RetrieveMonsterSerializer(MonsterSerializer):
    likes_count = models.IntegerField()
    reposts_count = models.IntegerField()
    comments_count = models.IntegerField()
    article = ArticleCreatorSerializer()

class MonsterScrollSerializer(RetrieveMonsterSerializer):
    class Meta(RetrieveMonsterSerializer.Meta):
        fields = ['likes_count', 'repost_count', 'comments_count', 'article',
                  'name', 'date_created', 'description', 'species', 'types']