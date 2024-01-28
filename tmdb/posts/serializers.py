from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from rest_framework import serializers

from .models import Post

MAX_POST_LENGTH = 240

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

    def check_content(self):
        content = self.validated_data.get("content")
        if len(content) > MAX_POST_LENGTH:
            raise ValidationError("This post is too long")
    
    def is_valid(self, *, raise_exception=False):
        if super().is_valid(raise_exception=raise_exception):
            self.check_content()
            return True
        return False

