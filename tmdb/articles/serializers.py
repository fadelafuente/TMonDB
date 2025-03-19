from collections import OrderedDict
from django.db import transaction
from rest_framework import serializers

from .models import Article
from users.serializers import CreatorSerializer

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ArticleCreatorSerializer(ArticleSerializer):
    creator = CreatorSerializer()
    
    class Meta(ArticleSerializer.Meta):
        fields = ('id', 'creator', 'date_created')

class ModelWithArticleSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()
    model = None
   
    @transaction.atomic
    def create(self, validated_data):
        article_data = validated_data.pop('article')

        article = Article.objects.create(**article_data)
        instance = self.model.objects.create(**validated_data, article=article)
        
        return instance
    
    def to_representation(self, instance):
        result = super().to_representation(instance)
        if result and 'article' in result:
            result['article']['creator'] = OrderedDict({'id': instance.article.creator.id, 'username': instance.article.creator.username})
        return result
    
class ModelScrollWithArticleSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    is_current_user = serializers.BooleanField()
    user_liked = serializers.BooleanField()
    user_reposted = serializers.BooleanField()
    user_commented = serializers.BooleanField()
    article = ArticleCreatorSerializer()

class BaseListSerializer(serializers.ListSerializer):
    update_lookup_field = 'id'

    class Meta:
        fields = '__all__'
    
    def update(self, instance, validated_data):
        obj_mapping, data_mapping = self.get_mappings(instance, validated_data)
        
        for item in validated_data:
            if 'id' in item:
                data_mapping[item['id']] = item

        result = []
        for obj_id, data in data_mapping.items():
            obj = obj_mapping.get(obj_id, None)
            if obj is None:
                result.append(self.child.create(data))
            else:
                result.append(self.child.update(obj, data))
            
        for obj_id, obj in obj_mapping.items():
            if obj_id not in data_mapping:
                obj.delete()
                
        return result
    
    def to_internal_value(self, data):
        result = super().to_internal_value(data)

        id_attr = getattr(self.Meta, 'update_lookup_field', self.update_lookup_field)

        if all((isinstance(self.root, self.get_serializer()), id_attr)):
            data_dict = {self.get_data_key(item): item[id_attr] for item in data}

            for item in result:
                key = self.get_obj_key(item)
                if key in data_dict:
                    item[id_attr] = data_dict[key]

        return result
    
    def get_obj_key(self, obj):
        return self.get_data_key(obj)
    
    def get_mappings(self, instance, validated_data):
        obj_mapping = {obj.id: obj for obj in instance}
        data_mapping = {}
        for item in validated_data:
            if 'id' in item:
                data_mapping[item['id']] = item

        return obj_mapping, data_mapping
    
    def get_data_key(self, data):
        raise NotImplementedError
    
    def get_serializer(self):
        raise NotImplementedError