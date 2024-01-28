from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from djoser.serializers import UserCreateSerializer

UserModel = get_user_model()

# class UserRegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserModel
#         fields = '__all__'

#     def create(self, clean_data):
#         user_object = UserModel.objects.create_user(email=clean_data['email'],
#                                                     password=clean_data['password'])
#         user_object.username = clean_data['username']
#         user_object.save()
#         return user_object

# class UserLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

#     def check_user(self, clean_data):
#         user = authenticate(username=clean_data['email'], password=clean_data['password'])
#         if not user:
#             raise ValidationError('User not found')
#         return user

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = UserModel
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'password')