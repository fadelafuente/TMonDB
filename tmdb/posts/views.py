from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from dotenv import load_dotenv
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated, AllowAny

load_dotenv()

from .serializers import PostSerializer
from .models import Post
from rest_framework.settings import api_settings

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES

    def get_serializer_class(self):
        if self.action =="create":
            return PostSerializer
        return self.serializer_class
    
    def get_permissions(self):
        if self.action != "create":
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def get_authenticators(self):
        auth = super().get_authenticators()
        return auth
    
    def create(self, request, *args, **kwargs):
        #if not request.user.is_authenticated:
        #    return Response(data={}, status=status.HTTP_401_UNAUTHORIZED)
        posted_date = timezone.now()
        creator = request.user
        request.data["posted_date"] = posted_date
        request.data["creator"] = 1
        
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save()
        return super().perform_create(serializer)
    