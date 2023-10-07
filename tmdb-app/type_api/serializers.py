from rest_framework import serializers
from .models import *

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"

class TypeAdvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"