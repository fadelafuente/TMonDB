from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from dotenv import load_dotenv
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .serializers import PostSerializer
from .models import Post
from rest_framework.settings import api_settings

load_dotenv()

AppUser = get_user_model()

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ("id", "posted_date")
    ordering = ("-id")

    def get_serializer_class(self):
        if self.action =="create":
            return PostSerializer
        return self.serializer_class
    
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get("username")

        if username is not None:
            try:
                user = AppUser.objects.get(username=username)
                queryset = queryset.filter(creator=user.id)
            except:
                queryset = Post.objects.none()

            return queryset
        else:
            return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        #if not request.user.is_authenticated:
        #    return Response(data={}, status=status.HTTP_401_UNAUTHORIZED)
        posted_date = timezone.now()
        creator = request.user
        request.data["posted_date"] = posted_date
        request.data["creator"] = creator.id
        
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save()
        return super().perform_create(serializer)
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        for post in response.data["results"]:
            creator_id = post["creator"]
            user = AppUser.objects.get(id=creator_id)
            post["creator_username"] = user.get_username()
        
        return response
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        try:
            creator_id = response.data["creator"]
            user = AppUser.objects.get(id=creator_id)
            response.data["creator_username"] = user.get_username()
        except:
            response.data = {}

        return response
    
    def partial_update(self, request, *args, **kwargs):
        if("content" in request.data):
            request.data["is_edited"] = True
        return super().partial_update(request, *args, **kwargs)