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
    queryset = Post.objects.all().annotate(likes_count=Count("who_liked", distinct=True),
                                            reposts_count=Count("who_reposted", distinct=True),
                                            comments_count=Count("comments", distinct=True))
    serializer_class = PostSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id", "posted_date", "likes_count")
    ordering = ("-posted_date")
    search_fields = ["content", "creator__username"]

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
        parent = self.request.query_params.get("parent")

        if parent is not None: 
            queryset = queryset.filter(parent=parent)

        if username is not None:
            try:
                user = AppUser.objects.get(username=username)
                queryset = queryset.filter(creator=user.id)
            except:
                queryset = Post.objects.none()

        return queryset
    
    def create(self, request, *args, **kwargs):
        if "is_reply" in request.data and request.data["is_reply"]:
            try:
                comments = Post.objects.filter(creator=request.user.id, parent=request.data["parent"]).all()
                if comments:
                    return Response(data={"message": "User already replied"}, status=status.HTTP_403_FORBIDDEN)
            except:
                return Response(data={"message": "Post could not be found"}, status=status.HTTP_404_NOT_FOUND)

        posted_date = timezone.now()
        creator = request.user
        request.data["posted_date"] = posted_date
        request.data["creator"] = creator.id
        
        response = super().create(request, *args, **kwargs)
        response.data["creator_username"] = creator.username
        return response
    
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
            post["user_commented"] = False
            if request.user.is_authenticated:
                post["user_liked"] = request.user.id in post["who_liked"]
                post["user_reposted"] = request.user.id in post["who_reposted"]
                comments = Post.objects.filter(creator=request.user.id, parent=post["id"]).all()
                post["user_commented"] = comments.exists()
        
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
            if post.who_liked.exists():
                user_liked = post.who_liked.filter(id=request.user.id)
                if user_liked and change == 1:
                    return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "User already liked this post"})
            elif not post.who_liked.exists() and change == -1:
                return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "User user can only unlike a liked post"})
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
            if post.who_reposted.exists():
                user_reposted = post.who_reposted.filter(id=request.user.id)
                if user_reposted and change == 1:
                    return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "User already reposted this post"})
            elif not post.who_reposted.exists() and change == -1:
                return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "User user has not reposted yet"})
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