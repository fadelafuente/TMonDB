from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer
from .models import *

class MoveSerializer(ModelWithArticleSerializer):
    model = Move

    class Meta:
        model = Move
        fields = '__all__'

class MonsterMoveSerializer(MoveSerializer):
    class Meta(MoveSerializer.Meta):
        fields = ['id', 'name', 'type', 'properties']

class MoveScrollSerializer(ModelScrollWithArticleSerializer, MoveSerializer):
    pass