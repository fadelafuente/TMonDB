from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response

class RegionView(APIView):
    def get(self, request):
        output = [{"name": output.name,
                   "monsters": output.monsters,
                   "types": output.types,
                   "moves": output.moves,
                   "map_url": output.map_url,
                   "description": output.description,
                   "authorized_users": output.authorized_users}
                   for output in Region.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = RegionSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class GalleryView(APIView):
    def get(self, request):
        output = [{"image_url": output.image_url,
                   "image_description": output.image_description,
                   "region": output.regions}
                   for output in Gallery.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = GallerySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)