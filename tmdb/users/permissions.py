from rest_framework.permissions import BasePermission

class IsNotCurrentUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user != obj
    
class IsCurrentUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj