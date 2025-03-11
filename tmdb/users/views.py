from django.contrib.auth import get_user_model
from django.http import Http404
from djoser.conf import settings
from djoser.social import views as social_views
from djoser.views import UserViewSet
from rest_framework import status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import views

from .serializers import *
from .mixins import *

AppUser = get_user_model()

def _post(response):
    # if the response did not return an access token, returns response
    if 'access' not in response.data:
        return response
    
    # split access token into two parts, header.payload, and signature.
    access = response.data['access']
    access, signature = access.rsplit('.', 1)
    data = {'access': access}

    # create a new response without the refresh token and with the signature as a cookie.
    new_response = Response(data=data, status=response.status_code)
    new_response.set_cookie(key='signature', value=signature, httponly=True)
    
    return new_response

class CustomTokenCreateView(views.TokenObtainPairView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        response = super().post(request, *args, **kwargs)
        return _post(response)
    
class CustomTokenVerifyView(views.TokenVerifyView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        token = request.data['token']
        if token is None:
            raise KeyError('No access token provided.')

        # check if signature is in cookies before appending to token
        signature = request.COOKIES.get('signature', None)
        if signature is None:
            raise KeyError('No signature provided.')

        # update token and send post request
        token += '.' + signature
        request.data['token'] = token
        return super().post(request, *args, **kwargs)
    

class CustomProviderAuthView(social_views.ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return _post(response)
    
class TMonDBUserViewset(UserViewSet, UpdateFollowingMixin, ListFollowingMixin, 
                        ListFollowersMixin, UpdateBlockingMixin, ListBlockingMixin):
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id', 'username')
    ordering = ('username')
    search_fields = ('username', 'bio')
    lookup_field = 'username'

    def get_permissions(self):
        if self.action in ['follow', 'block']:
            return (IsAuthenticated(),)
        elif self.action in ['following', 'retrieve', 'followers']:
            return (AllowAny(),)
        return super().get_permissions()
        
    def get_serializer_class(self):
        if self.action == "create":
            if settings.USER_CREATE_PASSWORD_RETYPE:
                return CreateAppUserSerializer
        if self.action in ['following', 'followers']:
            return FollowSerializer
        elif self.action == 'me' and self.request.method == 'GET':
            return CurrentUserSerializer
        elif self.action in ['list', 'retrieve']:
            return ProfileSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        kwargs = {}
        for key, value in self.request.query_params.items():
            if key not in ['page']:
                kwargs[key] = value

        return AppUser.objects.get_annotated_queryset(self.request.user, **kwargs).all()
    
    def get_paginated_queryset(self, queryset):
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Http404:
            # differentiate between a delete and a block
            username = kwargs['username']
            user = AppUser.objects.filter(username=username)
            if user.exists():
                return Response(status=status.HTTP_403_FORBIDDEN, data={'current_user_is_blocked': True, 'creator': username}) 
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': f'User not found'})      
