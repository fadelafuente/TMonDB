from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from dotenv import load_dotenv
from django.utils import timezone
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import PostSerializer, PostScrollSerializer
from .models import Post
from rest_framework.settings import api_settings
from django.db.models import Count

load_dotenv()

AppUser = get_user_model()

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().annotate(likes_count=Count("who_liked", distinct=True), reposts_count=Count("who_reposted", distinct=True))
    serializer_class = PostSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ("id", "posted_date")
    ordering = ("-id")

    def get_serializer_class(self):
        if self.action == "create":
            return PostSerializer
        elif self.action in ["list", "retrieve"]:
            return PostScrollSerializer
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
            post["user_liked"] = False
            post["user_reposted"] = False
            if request.user.is_authenticated:
                post["user_liked"] = request.user.id in post["who_liked"]
                post["user_reposted"] = request.user.id in post["who_reposted"]
        
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
    
    @action(detail=True, methods=['patch'])
    def set_like(self, request, pk=None, change=1):
        if(pk == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A post id was not given"})
        try:
            post = Post.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "Post could not be found"})

        response = super().partial_update(request)
        if(response.status_code == 200):
            if change == 1:
                post.who_liked.add(request.user)
                response.data["user_liked"] = True
            else:
                post.who_liked.remove(request.user)
                response.data["user_liked"] = False
        return response
    
    @action(detail=True, methods=['patch'])
    def unset_like(self, request, pk=None):
        return self.set_like(request, pk, -1)
    
    @action(detail=True, methods=['patch'])
    def set_repost(self, request, pk=None, change=1):
        if(pk == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A post id was not given"})
        try:
            post = Post.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "Post could not be found"})

        response = super().partial_update(request)
        if(response.status_code == 200):
            if change == 1:
                post.who_reposted.add(request.user)
                response.data["user_reposted"] = True
            else:
                post.who_reposted.remove(request.user)
                response.data["user_reposted"] = False
        return response
    
    @action(detail=True, methods=['patch'])
    def unset_repost(self, request, pk=None):
        return self.set_repost(request, pk, -1)