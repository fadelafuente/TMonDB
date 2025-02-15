from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

class LikeModelMixin:
    @action(detail=True, methods=['patch'])
    def like(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        instance.article.who_liked.add(user)

        return Response(status=status.HTTP_200_OK)
    
class RepostModelMixin:
    @action(detail=True, methods=['patch'])
    def repost(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        instance.article.who_reposted.add(user)

        return Response(status=status.HTTP_200_OK)