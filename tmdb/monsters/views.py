from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt import views
from djoser.social import views as social_views
from djoser.views import UserViewSet
from rest_framework.decorators import action
from rest_framework import status, filters
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Case, When, Q

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
        
class TMonDBMonsterViewset(UserViewSet):
    queryset = Monster.objects.all()
    # .annotate(following_count=Count("following", distinct=True), followers_count=Count("followers", distinct=True))
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id", "name", "national_id")
    ordering = ("id")
    search_fields = ["name", "species"]

    def get_permissions(self):
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == "follow":
            return
