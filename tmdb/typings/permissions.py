from rest_framework.permissions import BasePermission

from .models import Type, TypeModifier

class IsCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Type):
            return request.user == obj.creator
        elif isinstance(obj, TypeModifier):
            return request.user == obj.attacking_type.creator and request.user == obj.defending_type.creator
        return False