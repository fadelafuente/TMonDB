from rest_framework.decorators import action
from rest_framework.response import Response

class RetrievePostParentMixin:
    @action(detail=True, methods=['get'])
    def parent(self, request, *args, **kwargs):
        instance = self.get_object_by_parent()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)