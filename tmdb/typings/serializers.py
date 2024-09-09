from rest_framework import serializers
from .models import *

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"

class TypeModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeModifier
        fields = "__all__"