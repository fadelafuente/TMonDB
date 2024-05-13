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
        if self.action == "follow":
            return (IsAuthenticated(),)
        elif self.action in ["following", "record"]:
            return (AllowAny(),)
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == "follow":
            return FollowSerializer
        elif self.action == "following":
            return FollowingSerializer
        elif self.action == "record":
            return ProfileSerializer
        elif self.action == "me" and self.request.method == "GET":
            return CurrentUserSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        queryset = super().get_queryset()
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
        
        uid = request.data["id"]
        if(uid == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A user id was not given"})
        
        follower = self.request.user
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
            response = self.retrieve(request, id=id)
            u_following = list(AppUser.objects.all()
                               .filter(id__in=response.data["following"])
                               .annotate(user_follows=Case(When(Q(followers__id__in=[request.user.id]), then=True), default=False))
                               .annotate(current_user=Q(id=request.user.id))
                               .values("id", "username", "bio", "user_follows", "current_user"))
            return Response(data=u_following, status=status.HTTP_200_OK)
        except:
            return Response(data={}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def record(self, request):
        username = self.request.query_params.get("username")
        response = self.list(request, username=username)

        if response.status_code == 200:
            try:
                response.data = response.data["results"][0]
            except:
                response.data = {}
            response.data["current_user"] = request.user.id == response.data["id"]

        return response
