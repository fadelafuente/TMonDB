from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import views
from djoser.social import views as social_views
from djoser.views import UserViewSet
from rest_framework.decorators import action
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .serializers import FollowingSerializer

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
    def get_permissions(self):
        if self.action in ["add_follow", "remove_follow"]:
            return (IsAuthenticated(),)
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action in ["add_follow", "remove_follow"]:
            return FollowingSerializer
        return super().get_serializer_class()

    def _handle_follow(self, request, addFollowing=True):
        uid = request.data["id"]
        if(uid == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "A user id was not given"})
        
        follower = self.request.user
        try:
            followee = AppUser.objects.get(id=uid)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "User could not be found"})
        
        following = follower.following.filter(id=followee.id)
        if following and addFollowing:
            return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "User already following"})
        elif not following.exists() and not addFollowing:
            return Response(status=status.HTTP_403_FORBIDDEN, data={"message": "User has not followed yet"})
        
        if addFollowing:
            follower.following.add(followee)
        else:
            follower.following.remove(followee)

        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['patch'])
    def add_follow(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return self._handle_follow(request=request)

    @action(detail=False, methods=['patch'])
    def remove_follow(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return self._handle_follow(request=request, addFollowing=False)