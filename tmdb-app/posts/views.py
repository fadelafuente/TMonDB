from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.views import APIView

from .models import Post

# Create your views here.
class GetPostByIdView(APIView):
    def get(self, request):
        data = {
                "id": request.data["post_id"]
            }
        try:
            post = Post.objects.get(id=request.data["post_id"])
            data["content"] = post.content
            return_status = status.HTTP_200_OK
        except:
            data["message"] = "Post not found"
            return_status = status.HTTP_404_NOT_FOUND
        
        return Response(data=data, status=return_status)

def get_posts_list_view(request, *args, **kwargs):
    posts = Post.objects.all()
    posts_list = [{"id": post.id, "content": post.content} for post in posts]
    data = { "posts": posts_list}
    return Response(data=data, status=status.HTTP_200_OK)

def delete_posts_by_id(request, post_id, *args, **kwargs):
    post = Post.objects.get(id=post_id)
    post.delete()

    

