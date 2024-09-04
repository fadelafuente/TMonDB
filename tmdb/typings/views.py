from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt import views
from rest_framework.decorators import action
from rest_framework import status, filters, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.settings import api_settings
from .serializers import TypeSerializer

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

class TMonDBTypeViewset(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    # .annotate(following_count=Count("following", distinct=True), followers_count=Count("followers", distinct=True))
    serializer_class = TypeSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id", "name")
    ordering = ("id")
    search_fields = ["name"]

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def get_serializer_class(self):
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data["creator"] = request.user.id
        response = super().create(request, *args, **kwargs)
        return response
