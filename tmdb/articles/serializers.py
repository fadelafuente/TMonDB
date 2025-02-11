from django.contrib.auth import get_user_model
from rest_framework import serializers


from .models import Article
from users.serializers import CreatorSerializer

AppUser = get_user_model()

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ArticleCreatorSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer()
    
    class Meta:
        model = Article
        fields = ('id', 'creator',)
