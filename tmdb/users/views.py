from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import views
from djoser.social import views as social_views
from djoser.views import UserViewSet
from rest_framework.decorators import action
from rest_framework import status, filters
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from django.db.models import Count, Case, When, Q

AppUser = get_user_model()

def _post(response):
    # if the response did not return an access token, returns response
    if "access" not in response.data:
        return response
    
    # split access token into two parts, header.payload, and signature.
    access = response.data["access"]
    access, signature = access.rsplit(".", 1)
    data = {"access": access}

    # create a new response without the refresh token and with the signature as a cookie.
    new_response = Response(data=data, status=response.status_code)
    new_response.set_cookie(key="signature", value=signature, httponly=True)
    
    return new_response

class CustomTokenCreateView(views.TokenObtainPairView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        response = super().post(request, *args, **kwargs)
        return _post(response)
    
class CustomTokenVerifyView(views.TokenVerifyView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        token = request.data["token"]
        if token is None:
            raise KeyError("No access token provided.")

        # check if signature is in cookies before appending to token
        signature = request.COOKIES.get("signature", None)
        if signature is None:
            raise KeyError("No signature provided.")

        # update token and send post request
        token += "." + signature
        request.data["token"] = token
        return super().post(request, *args, **kwargs)
    

class CustomProviderAuthView(social_views.ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return _post(response)
    
class TMonDBUserViewset(UserViewSet):
    queryset = AppUser.objects.all().annotate(following_count=Count("following", distinct=True),
                                            followers_count=Count("followers", distinct=True))
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ("id", "username")
    ordering = ("username")
    search_fields = ["username", "bio"]

    def get_permissions(self):
        if self.action in ["follow", "block"]:
            return (IsAuthenticated(),)
        elif self.action in ["following", "record", "followers"]:
            return (AllowAny(),)
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == "follow":
            return PatchSerializer
        elif self.action == "block":
            if self.request.method == "GET":
                return BlockingSerializer
            return PatchSerializer
        elif self.action in ["following", "followers"]:
            return FollowingSerializer
        elif self.action == "record":
            return ProfileSerializer
        elif self.action == "me" and self.request.method == "GET":
            return CurrentUserSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            blocked = [user["id"] for user in AppUser.objects.all().get(id=self.request.user.id).blocked.all().values("id")]
            if blocked:
                queryset = queryset.exclude(id__in=blocked)

        username = self.request.query_params.get("username")

        if username is not None:
            try:
                queryset = queryset.filter(username=username)
            except:
                queryset = AppUser.objects.none()

        return queryset
    
    def get_extra_information(self, request, user):
        # initialize booleans
        try:
            user["user_follows"] = False

            current_user = request.user
            if current_user.is_authenticated:
                user["user_follows"] = current_user.id in user["followers"]
        except:
            try:
                user.user_follows = False

                current_user = request.user
                if current_user.is_authenticated:
                    user.user_follows = current_user.id in user.followers
            except:
                pass

    def get_follow_queryset(self, request, follow_list):
        queryset = AppUser.objects.all().filter(id__in=follow_list).annotate(user_follows=Case(When(Q(followers__id__in=[request.user.id]), then=True), default=False)).annotate(current_user=Q(id=request.user.id))
            
        page = self.paginate_queryset(queryset)    
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)

        self.get_extra_information(request, response.data)
        return response
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        for user in response.data["results"]:
            self.get_extra_information(request, user)
        
        return response

    @action(detail=False, methods=['patch'])
    def follow(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        uid = None
        if "id" in request.data:
            uid = request.data["id"]

        if(uid == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A user id was not given"})
        
        follower = self.request.user
        if(uid == follower.id):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User cannot follow themselves"})
        
        try:
            followee = AppUser.objects.get(id=uid)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "User could not be found"})
        
        following = follower.following.filter(id=followee.id)
        if following:
            follower.following.remove(followee)
        else:
            follower.following.add(followee)

        follower.save()

        return Response(status=status.HTTP_200_OK)
    
    # Retrieve ONLY the users the current user is following
    # This way, future components can retrieve just the following list
    # and not the entire user profile again.
    @action(detail=True, methods=['get'])
    def following(self, request, id=None):
        try:
            following = [user["id"] for user in AppUser.objects.all().get(id=id).following.all().values("id")]
    
            return self.get_follow_queryset(request=request, follow_list=following)
        except:
            return Response(data={}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['get'])
    def followers(self, request, id=None):
        try:
            followers = [user["id"] for user in AppUser.objects.all().get(id=id).followers.all().values("id")]
    
            return self.get_follow_queryset(request=request, follow_list=followers)
        except:
            return Response(data={}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def record(self, request):
        username = self.request.query_params.get("username")

        if self.request.user.is_authenticated:
            blocked = [user["id"] for user in AppUser.objects.all().get(id=self.request.user.id).blocked.all().values("id")]
            if blocked:
                data = {"username": username, "blocked_current_user": True}
                return Response(status=status.HTTP_200_OK, data=data)

        response = self.list(request, username=username)

        if response.status_code == 200:
            try:
                response.data = response.data["results"][0]
                response.data["current_user"] = request.user.id == response.data["id"]
            except:
                response.data = {}

        return response
    
    @action(detail=False, methods=['patch', 'get'])
    def block(self, request):
        if self.request.method == 'PATCH':
            return self.patch_blocking_list(request=request)
        elif self.request.method == 'GET':
            return self.get_blocking_list(request=request)
        
    def patch_blocking_list(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = None
        if "username" in request.data:
            username = request.data["username"]             

        if(username == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A user id was not given"})
        
        current_user = self.request.user
        try:
            blockee = AppUser.objects.get(username=username)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "User could not be found"})
        
        if(blockee.id == current_user.id):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User cannot block themselves"})
        
        blocking = current_user.blocking.filter(id=blockee.id)
        if blocking:
            current_user.blocking.remove(blockee)
        else:
            current_user.blocking.add(blockee)

            # unfollow each other when blocking a user
            blockee.following.remove(current_user.id)
            current_user.following.remove(blockee.id)

        current_user.save()
        blockee.save()

        return Response(status=status.HTTP_200_OK)
    
    def get_blocking_list(self, request):
        try:
            blocking = [user["id"] for user in AppUser.objects.all().get(id=request.user.id).blocking.all().values("id")]

            queryset = AppUser.objects.all().filter(id__in=blocking)
            
            page = self.paginate_queryset(queryset)    
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset)
            return Response(serializer.data)
        except:
            return Response(data={}, status=status.HTTP_404_NOT_FOUND)
