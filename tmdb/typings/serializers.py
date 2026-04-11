from rest_framework import serializers

from articles.serializers import BaseListSerializer
from .models import *
from users.serializers import CreatorSerializer

class TypeListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = Type
    
    def get_data_key(self, data):
        return data['name']
    
    def get_serializer(self):
        return TypeListSerializer
    
class ModifierListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = TypeModifier
    
    def get_data_key(self, data):
        return f'{data['attacking_type']}&{data['defending_type']}'
    
    def get_obj_key(self, obj):
        return f'{obj['attacking_type'].id}&{obj['defending_type'].id}'
    
    def get_serializer(self):
        return ModifierListSerializer

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

class TypeUpdateSerializer(TypeSerializer):
    class Meta(TypeSerializer.Meta):
        list_serializer_class = TypeListSerializer

class MinimumTypeSerializer(TypeSerializer):
    class Meta(TypeSerializer.Meta):
        fields = ['id', 'name']

class TypeModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeModifier
        fields = '__all__'

class ModifierUpdateSerializer(TypeModifierSerializer):
    class Meta(TypeModifierSerializer.Meta):
        list_serializer_class = ModifierListSerializer

class DefenseModifiersSerializer(TypeModifierSerializer):
    attacking_type = MinimumTypeSerializer()

    class Meta(TypeModifierSerializer.Meta):
        fields = ['id', 'attacking_type', 'multiplier']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attacking_type'] = representation.pop('attacking_type')['name']
        return representation

class TypeWithModifiersSerializer(TypeSerializer):
    defense_modifiers = DefenseModifiersSerializer(many=True)
    creator = CreatorSerializer()
    
class MonsterTypesSerializer(TypeWithModifiersSerializer):
    class Meta(TypeWithModifiersSerializer.Meta):
        fields = ['id', 'name', 'defense_modifiers']