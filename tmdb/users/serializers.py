from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer as BaseSerializer, UserCreatePasswordRetypeSerializer
import re
from rest_framework import serializers

UserModel = get_user_model()

class CreateAppUserSerializer(UserCreatePasswordRetypeSerializer):
    def validate_username(self, username):
        if not username:
            raise serializers.ValidationError('A username is required.')
        if not username.isalnum():
            raise serializers.ValidationError('Username has one or more illegal characters, please only use alphanumeric characters.')
        return username
    
    def validate_password_helper(self, password):
        if isinstance(password, str):
            regex = re.compile('[@_!#$%^&*()<>?/|}{~:]')
            missing_requirements = []
            if len(password) < 8:
                missing_requirements.append('at least 8 characters')
            if len(password) > 20:
                missing_requirements.append('at most 20 characters')
            if not any(ele.isupper() for ele in password):
                missing_requirements.append('at least 1 uppercase')
            if not any(ele.islower() for ele in password):
                missing_requirements.append('at least 1 lowercase')
            if not any(ele.isdigit() for ele in password):
                missing_requirements.append('at least 1 number')
            if(regex.search(password) == None):
                missing_requirements.append('at least 1 special character')
            
            if missing_requirements:
                message = 'Password is missing the following requirements: ' + ', '.join(requirement for requirement in missing_requirements) + '.'
                raise serializers.ValidationError({'password': [message]})
            
    def validate(self, attrs):
        password = attrs.get("password")
        self.validate_password_helper(password=password)
        return super().validate(attrs)

class UserSerializer(BaseSerializer):
    def validate_username(self, username):
        if not username:
            raise serializers.ValidationError('A username is required.')
        if not username.isalnum():
            raise serializers.ValidationError('Username has one or more illegal characters, please only use alphanumeric characters.')
        return username
    
    def validate_password(self, password):
        if password:
            regex = re.compile('[@_!#$%^&*()<>?/|}{~:]')
            missing_requirements = []
            if len(password) < 8:
                missing_requirements.append('at least 8 characters')
            if len(password) > 20:
                missing_requirements.append('at most 20 characters')
            if not any(ele.isupper() for ele in password):
                missing_requirements.append('at least 1 uppercase')
            if not any(ele.islower() for ele in password):
                missing_requirements.append('at least 1 lowercase')
            if not any(ele.isdigit() for ele in password):
                missing_requirements.append('at least 1 number')
            if(regex.search(password) == None):
                missing_requirements.append('at least 1 special character')
            
            if missing_requirements:
                message = 'Password is missing: ' + ', '.join(requirement for requirement in missing_requirements) + '.'
                raise serializers.ValidationError(message)
        
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