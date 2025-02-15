from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer as BaseSerializer
from rest_framework import serializers

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

class UserSerializer(BaseSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = UserModel
        fields = '__all__'

class CreatorSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ('id', 'username')

class CurrentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ('id', 'username', 'email')

class FollowSerializer(UserSerializer):
    user_follows = serializers.BooleanField()
    current_user = serializers.BooleanField()

    class Meta(UserSerializer.Meta):
        fields = ('id', 'username', 'bio', 'user_follows', 'current_user')

class ProfileSerializer(FollowSerializer):
    following_count = serializers.IntegerField()
    followers_count = serializers.IntegerField()

    class Meta(UserSerializer.Meta):
        fields = ('id', 'username', 'bio', 'following_count', 'followers_count', 'user_follows', 'current_user')