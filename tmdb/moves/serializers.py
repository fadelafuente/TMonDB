import json
from rest_framework import serializers

from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer
from .models import *
from typings.serializers import MinimumTypeSerializer

class MoveSerializer(ModelWithArticleSerializer):
    model = Move

    class Meta:
        model = Move
        fields = '__all__'

class MonsterMoveSerializer(MoveSerializer):
    class Meta(MoveSerializer.Meta):
        fields = ['id', 'name', 'type', 'properties']

class RetrieveMoveSerializer(ModelScrollWithArticleSerializer, MoveSerializer):
    type = MinimumTypeSerializer()

class MoveScrollSerializer(RetrieveMoveSerializer):
    pass