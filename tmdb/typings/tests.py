from django.test import TestCase

from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
import json
from .models import Type
from django.utils import timezone, dateparse


AppUser = get_user_model()

class TestTypes(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email="testemail@domain.com", 
                                               password="testpassword", 
                                               username="testuser", 
                                               first_name="test", 
                                               last_name="user")
        
        cls.user2 = AppUser.objects.create_user(email="testemail2@domain.com", 
                                               password="testpassword2", 
                                               username="testuser2", 
                                               first_name="test2", 
                                               last_name="user2")
        
        Type.objects.create(name=f"ice", creator=cls.user2)
        
        cls.type_id = Type.objects.all()[0].id

    '''
        Expected Tests:
            HTTP Request to: /api/types/
            Results: Fail
    '''
    def test_create_type_anonymous_fail(self):
        data = {"name": "water"}
        response = self.client.post("/api/types/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 401)

    def test_delete_type_unauthorized_user_fail(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f"/api/types/{self.type_id}/")

        self.assertEqual(response.status_code, 401)

    def test_delete_type_anonymous_fail(self):
        response = self.client.delete(f"/api/types/{self.type_id}/")

        self.assertEqual(response.status_code, 401)

    def test_update_type_unauthorized_user_fail(self):
        self.client.force_authenticate(user=self.user)

        data = {"name": "nature"}
        response = self.client.patch(f"/api/types/{self.type_id}/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 401)

    def test_update_type_anonymous_fail(self):
        data = {"name": "nature"}
        response = self.client.patch(f"/api/types/{self.type_id}/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 401)

    '''
        Expected Tests:
            HTTP Request to: /api/types/
            Results: Success
    '''
    def test_create_type_success(self):
        self.client.force_authenticate(user=self.user)

        data = {"name": "fire"}
        response = self.client.post("/api/types/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 201)

    def test_delete_type_authorized_user_success(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(f"/api/types/{self.type_id}/")

        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Type.DoesNotExist):
            Type.objects.get(id=self.type_id)

    def test_update_type_authorized_user_success(self):
        self.client.force_authenticate(user=self.user2)

        data = {"name": "nature"}
        response = self.client.patch(f"/api/types/{self.type_id}/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 200)

    def test_create_multiple_types_success(self):
        self.client.force_authenticate(user=self.user)

        data = [{"name": "fire"}, {"name": "water"}, {"name": "grass"}]
        response = self.client.post("/api/types/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 201)