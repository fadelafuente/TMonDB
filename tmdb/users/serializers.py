from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from djoser.serializers import UserCreateSerializer, UserSerializer as BaseSerializer

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
        fields = "__all__"

class UserSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = UserModel
        fields = ('id', 'username', 'bio')

class CurrentUserSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = UserModel
        fields = ('id', 'username', 'email')

class FollowSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = UserModel
        fields = ('id',)

class FollowingSerializer(BaseSerializer):
    user_follows = serializers.IntegerField()
    current_user = serializers.IntegerField()

    class Meta(BaseSerializer.Meta):
        model = UserModel
        fields = ('id', 'user_follows', 'current_user', 'bio', 'username')

class ProfileSerializer(UserSerializer):
    following_count = serializers.IntegerField()
    followers_count = serializers.IntegerField()

    class Meta(UserSerializer.Meta):
        model = UserModel
        fields = ('id', 'username', 'bio', 'following_count', 'followers_count', 'following', 'followers')