from django.contrib.auth import get_user_model
from django.db.models import Case, When, Q
from djoser.social import views as social_views
from djoser.views import UserViewSet
from rest_framework import status, filters
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import views

from .serializers import *

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
    
class UpdateFollowingMixin:
    @action(detail=True, methods=['patch'])
    def follow(self, request, *args, **kwargs):
        user = self.get_object()
        current_user = request.user

        if user.id == current_user.id:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'User cannot follow themselves.'})
        
        following = current_user.following.filter(id=user.id)
        if following:
            current_user.following.remove(user)
        else:
            current_user.following.add(user)

        return Response(status=status.HTTP_200_OK)
            
class ListFollowingMixin(ListModelMixin):
    @action(detail=False, methods=['get'])
    def following(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
class ListFollowersMixin(ListModelMixin):
    @action(detail=False, methods=['get'])
    def followers(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
class TMonDBUserViewset(UserViewSet, UpdateFollowingMixin, ListFollowingMixin, ListFollowersMixin):
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id', 'username')
    ordering = ('username')
    search_fields = ['username', 'bio']

    def get_permissions(self):
        if self.action in ['follow', 'block']:
            return (IsAuthenticated(),)
        elif self.action in ['following', 'record', 'followers']:
            return (AllowAny(),)
        return super().get_permissions()
        
    def get_serializer_class(self):
        if self.action == 'follow':
            return PatchSerializer
        elif self.action == 'block':
            if self.request.method == 'GET':
                return CreatorSerializer
            return PatchSerializer
        elif self.action in ['following', 'followers']:
            return FollowingSerializer
        elif self.action == 'record':
            return ProfileSerializer
        elif self.action == 'me' and self.request.method == 'GET':
            return CurrentUserSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        kwargs = {}
        # Not really a fan of working out the query params for filtering like this,
        # but it works without revealing so much information on the frontend.
        path = self.request.path.split('/')[-2]
        for key, value in self.request.query_params.items():
            if key not in ['page']:
                if key == 'id':
                    if path == 'following':
                        kwargs[f'followers__id__in'] = [int(value)]  
                    elif path == 'followers':
                        kwargs[f'following__id__in'] = [int(value)]  
                else:  
                    kwargs[key] = value

        return AppUser.objects.annotated_queryset(self.request.user, **kwargs).all()

    def get_follow_queryset(self, request, follow_list):
        queryset = AppUser.objects.all().filter(id__in=follow_list).annotate(user_follows=Case(When(Q(followers__id__in=[request.user.id]), then=True), default=False)).annotate(current_user=Q(id=request.user.id))
            
        page = self.paginate_queryset(queryset)    
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def record(self, request):
        username = self.request.query_params.get('username')

        response = self.list(request, username=username)

        if response.data['results']:
            response.data = response.data['results'][0]
        else:
            response.data = {}

        try:
            if response.status_code == 200 and self.request.user.is_authenticated:
                blocked = request.user.blocked.all().filter(username=username)
                if blocked:
                    response.data['blocked_current_user'] = True

                blocking = request.user.blocking.all().filter(username=username)
                if blocking:
                    response.data['is_blocking'] = True

                if 'id' in response.data:
                    response.data['current_user'] = request.user.id == response.data['id']
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
        if 'username' in request.data:
            username = request.data['username']             

        if(username == None):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'A user id was not given'})
        
        current_user = self.request.user
        try:
            blockee = AppUser.objects.get(username=username)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'message': 'User could not be found'})
        
        if(blockee.id == current_user.id):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'User cannot block themselves'})
        
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
            blocking = [user['id'] for user in AppUser.objects.all().get(id=request.user.id).blocking.all().values('id')]

            queryset = AppUser.objects.all().filter(id__in=blocking)
            
            page = self.paginate_queryset(queryset)    
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset)
            return Response(serializer.data)
        except:
            return Response(data={}, status=status.HTTP_404_NOT_FOUND)
