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
                   for output in TypeModifier.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = TypeModifierSerializer(data=request.data)
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
        if self.action in ["create", "destroy", "update"]:
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def get_serializer_class(self):
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.creator and instance.creator != request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.creator and instance.creator != request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        if response.status_code == 200:
            response.data["defensive_resistances"] = self.get_resistances(response.data["id"])

        return response
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.status_code == 200:
            response.data = response.data["results"]
            for type in response.data:
                type["defensive_resistances"] = self.get_resistances(type["id"])

        return response
    
    def get_resistances(self, tid):
        type_modifiers = TypeModifier.objects.filter(defending_type=tid)
        modifier_dict = {}

        for mod in type_modifiers:
            modifier_dict[mod.attacking_type.name] = float(mod.multiplier)

        return modifier_dict
    
class TMondDBTypeModifierViewSet(TMonDBTypeViewset):
    queryset = TypeModifier.objects.all()
    # .annotate(following_count=Count("following", distinct=True), followers_count=Count("followers", distinct=True))
    serializer_class = TypeModifierSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id")
    ordering = ("id")
    search_fields = []

    def get_serializer_class(self):
        return self.serializer_class