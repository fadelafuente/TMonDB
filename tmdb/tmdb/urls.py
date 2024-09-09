"""
URL configuration for tmdb-app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path("", views.home, name="home")
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path("", Home.as_view(), name="home")
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path("blog/", include("blog.urls"))
"""
from django.contrib import admin
from monsters.views import *
from django.urls import path, include, re_path, include
from django.views.generic import TemplateView
from users.views import *
from posts.views import *
from monsters.views import *
from typings.views import *

from rest_framework.routers import DefaultRouter

api_router = DefaultRouter()
api_router.register(r"posts", PostViewSet)
api_router.register(r"monsters", TMonDBMonsterViewset)
api_router.register(r"types", TMonDBTypeViewset)
api_router.register(r"advantages", TMondDBTypeModifierViewSet)

auth_router = DefaultRouter()
auth_router.register(r"users", TMonDBUserViewset)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", MonsterView.as_view(), name="root"),
    path("auth/jwt/create/", CustomTokenCreateView.as_view(), name="jwt-create"),
    path("auth/jwt/verify/", CustomTokenVerifyView.as_view(), name="jwt-verify"),
    path("auth/o/<slug:provider>/", CustomProviderAuthView.as_view(), name="provider-auth"),
    path("auth/", include(auth_router.urls)),
    path("api/", include(api_router.urls))
]

urlpatterns += [re_path(r"^.*", TemplateView.as_view(template_name="index.html"))]
