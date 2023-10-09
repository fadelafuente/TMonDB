from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response

class TypeView(APIView):
    def get(self, request):
        output = [{"name": output.name,
                   "locked": output.locked}
                   for output in Type.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = TypeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class TypeAdvantageView(APIView):
    def get(self, request):
        output = [{"attacking_type": output.attacking_type,
                   "defending_type": output.defending_type,
                   "multiplier": output.multiplier}
                   for output in TypeAdvantage.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = TypeAdvantageSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
