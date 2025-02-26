from django.db import transaction
from rest_framework import serializers

from .models import *
from users.serializers import CreatorSerializer

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

class TypeNameOnlySerializer(TypeSerializer):
    class Meta(TypeSerializer.Meta):
        fields = ['name']

class TypeModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeModifier
        fields = '__all__'

class DefenseModifiersSerializer(TypeModifierSerializer):
    attacking_type = TypeNameOnlySerializer()

    class Meta(TypeModifierSerializer.Meta):
        fields = ['attacking_type', 'multiplier']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attacking_type'] = representation.pop('attacking_type')['name']
        return representation

class TypeWithModifiersSerializer(TypeSerializer):
    defense_modifiers = DefenseModifiersSerializer(many=True)
    creator = CreatorSerializer()

# class CreateTypeAndModifiersSerializer(serializers.BaseSerializer):
#     types = TypeSerializer(many=True)
#     type_advantages = TypeModifierSerializer(many=True)

#     class Meta:
#         model = Type
#         fields = ['types', 'type_advantages']