from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt import views
from djoser.views import UserViewSet
from rest_framework.decorators import action
from rest_framework import status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny

class TypeView(APIView):
    def get(self, request):
        output = [{"name": output.name,
                   "locked": output.locked}
                   for output in Type.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = TypeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class TypeAdvantageView(APIView):
    def get(self, request):
        output = [{"attacking_type": output.attacking_type,
                   "defending_type": output.defending_type,
                   "multiplier": output.multiplier}
                   for output in TypeAdvantage.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = TypeAdvantageSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class TMonDBTypeViewset(UserViewSet):
    queryset = Type.objects.all()
    # .annotate(following_count=Count("following", distinct=True), followers_count=Count("followers", distinct=True))
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id", "name")
    ordering = ("id")
    search_fields = ["name"]

    def get_permissions(self):
        return (AllowAny(),)
    
    # def get_serializer_class(self):
    #     if self.action == "follow":
    #         return 
