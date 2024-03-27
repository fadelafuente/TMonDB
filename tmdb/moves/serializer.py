from rest_framework import serializers
from .models import *

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = "__all__"