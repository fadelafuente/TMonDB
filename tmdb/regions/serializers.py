from rest_framework import serializers
from .models import *
from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer
from worlds.serializers import WorldWithAliasesSerializer

class RegionSerializer(ModelWithArticleSerializer):
    model = Region
    
    class Meta:
        model = Region
        fields = '__all__'
        indexes = [models.Index(fields=['name', 'description'])]

class RetrieveRegionSerializer(ModelScrollWithArticleSerializer, RegionSerializer):
    world = WorldWithAliasesSerializer(read_only=True)

class RegionScrollSerializer(RetrieveRegionSerializer):
    class Meta(RetrieveRegionSerializer.Meta):
        fields = ['id', 'name', 'map_url', 'description', 'world', 'article']

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'