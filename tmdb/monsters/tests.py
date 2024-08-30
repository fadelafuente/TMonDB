from django.test import TestCase

from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

AppUser = get_user_model()

class TestMonsters(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email="testemail@domain.com", 
                                               password="testpassword", 
                                               username="testuser", 
                                               first_name="test", 
                                               last_name="user")

    def test_create_monster(self):
        self.client.force_authenticate(user=self.user)
