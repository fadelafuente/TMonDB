from rest_framework import serializers
from .models import *

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = [
            'name',
            'description',
            'damage',
            'accuracy',
            'priority',
            'use_limit',
            'category',
            'contact'
        ]