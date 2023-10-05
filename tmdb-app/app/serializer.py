from rest_framework import serializers
from .models import *

class MonsterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monsters
        fields = ['name', 'species', 'abilities']