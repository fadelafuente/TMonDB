from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from rest_framework import status, filters, viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.settings import api_settings
from django.db.models import Count, Case, When, Q
from .serializer import MonsterSerializer

# Create your views here.
class MonsterView(APIView):
    def get(self, request):
        output = [{"name": output.name,
                   "species": output.species,
                   "abilities": output.abilities}
                   for output in Monster.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = MonsterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class TMonDBMonsterViewset(viewsets.ModelViewSet):
    queryset = Monster.objects.all()
    # .annotate(following_count=Count("following", distinct=True), followers_count=Count("followers", distinct=True))
    serializer_class = MonsterSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id", "name", "national_id")
    ordering = ("id")
    search_fields = ["name", "species"]

    def get_serializer_class(self):
        return self.serializer_class

    def get_permissions(self):
        return super().get_permissions()
