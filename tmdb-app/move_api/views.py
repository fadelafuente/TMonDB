from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response

class MoveView(APIView):
    def get(self, request):
        output = [{"name": output.name,
                    "description": output.description,
                    "damage": output.damage,
                    "accuracy": output.accuracy,
                    "priority": output.priority,
                    "use_limit": output.use_limit,
                    "category": output.category,
                    "contact": output.contact
                }
                   for output in Move.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = MoveSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)