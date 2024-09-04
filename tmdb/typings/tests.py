from django.test import TestCase

from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
import json

AppUser = get_user_model()

class TestTypes(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email="testemail@domain.com", 
                                               password="testpassword", 
                                               username="testuser", 
                                               first_name="test", 
                                               last_name="user")

    def test_create_type_success(self):
        self.client.force_authenticate(user=self.user)

        data = {"name": "fire"}
        response = self.client.post("/api/types/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 201)

    def test_create_type_anonymous_fail(self):
        data = {"name": "water"}
        response = self.client.post("/api/types/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 401)