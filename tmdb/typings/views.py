from django.db import transaction
from rest_framework import status, filters, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.settings import api_settings

from .models import *
from .serializers import *

class TMonDBTypeViewset(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id', 'name')
    ordering = ('id')
    search_fields = ['name']

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return TypeWithModifiersSerializer
        return self.serializer_class

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        if many:
            for t in request.data:
                t['creator'] = request.user.id
        else:
            request.data['creator'] = request.user.id
            
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_destroy(self, instance):
        if instance.creator != self.request.user:
            raise PermissionDenied('You do not have permission to delete this type.')
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        if serializer.instance.creator != self.request.user:
            raise PermissionDenied('You do not have permission to update this type.')
        return super().perform_update(serializer)
    
class TMondDBTypeModifierViewSet(TMonDBTypeViewset):
    queryset = TypeModifier.objects.all()
    serializer_class = TypeModifierSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id')
    ordering = ('id')
    search_fields = []

    def get_serializer_class(self):
        return self.serializer_class