from rest_framework.permissions import BasePermission

from .models import Evolution

class IsCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Evolution):
            return request.user == obj.from_monster.article.creator and request.user == obj.to_monster.article.creator
        return request.user == obj.article.creator