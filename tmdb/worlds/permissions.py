from rest_framework.permissions import BasePermission

from .models import Stat

class IsCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Stat):
            return request.user == obj.world.article.creator
        return request.user == obj.article.creator