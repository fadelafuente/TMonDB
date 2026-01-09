from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

class LikeModelMixin:
    @action(detail=True, methods=['patch'])
    def likes(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        user_liked = instance.article.who_liked.filter(id=user.id)
        if not user_liked:
            instance.article.who_liked.add(user)
        else:
            instance.article.who_liked.remove(user)

        return Response(status=status.HTTP_200_OK)
    
class RepostModelMixin:
    @action(detail=True, methods=['patch'])
    def reposts(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        user_liked = instance.article.who_reposted.filter(id=user.id)
        if not user_liked:
            instance.article.who_reposted.add(user)
        else:
            instance.article.who_reposted.remove(user)

        return Response(status=status.HTTP_200_OK)