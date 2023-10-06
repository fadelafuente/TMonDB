from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import re

UserModel = get_user_model()

def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip()

    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('Invalid email or email is already taken.')
    
    if not username or UserModel.objects.filter(username=username).exists():
        raise ValidationError('Invalid username or username already exists.')
    
    regex = re.compile('[@_!#$%^&*()<>?/|}{~:]')
    if len(password) < 8:
        raise ValidationError('Password needs to be at least 8 characters.') 
    if len(password) > 20:
        raise ValidationError('Password needs to be at most 20 characters.')
    elif not any(ele.isupper() for ele in password):
        raise ValidationError('Password is missing at least 1 uppercase.')
    elif not any(ele.islower() for ele in password):
        raise ValidationError('Password is missing at least 1 lowercase.')
    elif not any(ele.isdigit() for ele in password):
        raise ValidationError('Password is missing at least 1 number.')
    elif(regex.search(password) == None):
        raise ValidationError('Password is missing at least 1 special character.')
    
    return data

def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('Input a valid email')
    return True

def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('choose another username')
    return True

def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('Input a valid password')
    return True