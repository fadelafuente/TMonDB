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
    
    def get_extra_information(self, request, post):
        creator_id = post["creator"]
        try:
            user = AppUser.objects.get(id=creator_id)
            post["creator_username"] = user.get_username()
        except:
            post["creator_username"] = "anonymous"

        # initialize booleans
        post["user_liked"] = False
        post["user_reposted"] = False
        post["user_commented"] = False
        post["is_current_user"] = False

        user = request.user
        if user.is_authenticated:
            post["user_liked"] = user.id in post["who_liked"]
            post["user_reposted"] = user.id in post["who_reposted"]
            comments = Post.objects.filter(creator=user.id, parent=post["id"]).all()
            post["user_commented"] = comments.exists()
            post["is_current_user"] = creator_id == user.id
    
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
    
    def destroy(self, request, *args, **kwargs):
        pid = request.path.split("/")[-2]

        try: 
            Post.objects.filter(parent=pid).update(parent_deleted=True)
            return super().destroy(request, args, kwargs)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Failed to delete post."})
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        for post in response.data["results"]:
            self.get_extra_information(request, post)
        
        return response
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        try:
            self.get_extra_information(request, response.data)
        except:
            response.data = {}

        return response
    
    def partial_update(self, request, *args, **kwargs):
        if("content" in request.data):
            request.data["is_edited"] = True
        return super().partial_update(request, *args, **kwargs)
    
    @action(detail=True, methods=['patch'])
    def like(self, request, pk=None):
        if(pk == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A post id was not given"})
        
        response = super().partial_update(request)
        if response.status_code != 200:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            post = Post.objects.get(id=pk)
            if post.who_liked.exists():
                user_liked = post.who_liked.filter(id=request.user.id)
                if user_liked:
                    post.who_liked.remove(request.user)
                    response.data["user_liked"] = False
                else:
                    post.who_liked.add(request.user)
                    response.data["user_liked"] = True
            elif not post.who_liked.exists():
                post.who_liked.add(request.user)
                response.data["user_liked"] = True
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "Post could not be found"})

        post.save()

        return response
    
    @action(detail=True, methods=['patch'])
    def repost(self, request, pk=None):
        if(pk == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A post id was not given"})
        
        response = super().partial_update(request)
        if response.status_code != 200:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            post = Post.objects.get(id=pk)
            if post.who_reposted.exists():
                user_reposted = post.who_reposted.filter(id=request.user.id)
                if user_reposted:
                    post.who_reposted.remove(request.user)
                    response.data["user_reposted"] = False
                else: 
                    post.who_reposted.add(request.user)
                    response.data["user_reposted"] = True
            elif not post.who_reposted.exists():
                    post.who_reposted.add(request.user)
                    response.data["user_reposted"] = True
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "Post could not be found"})
        
        post.save()
            
        return response