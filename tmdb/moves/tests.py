from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from .models import Move
from typings.models import Type

AppUser = get_user_model()

class TestMoves(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email='testemail@domain.com', 
                                               password='TestPassword123@#$', 
                                               username='testuser', 
                                               first_name='test', 
                                               last_name='user')
        cls.user2 = AppUser.objects.create_user(email='testemail2@domain.com',
                                                password='TestPassword321$#@',
                                                username='testuser2',
                                                first_name='test2',
                                                last_name='user2')
        cls.test_start_time = timezone.now()

        ice_type = Type.objects.create(name=f'ice', creator=cls.user, date_created=cls.test_start_time)
        fairy_type = Type.objects.create(name=f'fairy', creator=cls.user, date_created=cls.test_start_time)
        dragon_type = Type.objects.create(name=f'dragon', creator=cls.user, date_created=cls.test_start_time)