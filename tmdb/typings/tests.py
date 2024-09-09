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
        
        ice_type = Type.objects.create(name=f"ice", creator=cls.user2)
        fairy_type = Type.objects.create(name=f"fairy", creator=cls.user2)
        dragon_type = Type.objects.create(name=f"dragon", creator=cls.user2)
        
        cls.ice_id = ice_type.id
        cls.fairy_id = fairy_type.id
        cls.dragon_id = dragon_type.id

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

        response = self.client.delete(f"/api/types/{self.ice_id}/")

        self.assertEqual(response.status_code, 401)

    def test_delete_type_anonymous_fail(self):
        response = self.client.delete(f"/api/types/{self.ice_id}/")

        self.assertEqual(response.status_code, 401)

    def test_update_type_unauthorized_user_fail(self):
        self.client.force_authenticate(user=self.user)

        data = {"name": "nature"}
        response = self.client.patch(f"/api/types/{self.ice_id}/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 401)

    def test_update_type_anonymous_fail(self):
        data = {"name": "nature"}
        response = self.client.patch(f"/api/types/{self.ice_id}/", data=json.dumps(data), content_type="application/json")

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

        response = self.client.delete(f"/api/types/{self.ice_id}/")

        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Type.DoesNotExist):
            Type.objects.get(id=self.ice_id)

    def test_update_type_authorized_user_success(self):
        self.client.force_authenticate(user=self.user2)

        data = {"name": "nature"}
        response = self.client.patch(f"/api/types/{self.ice_id}/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 200)

    def test_create_multiple_types_success(self):
        self.client.force_authenticate(user=self.user)

        data = [{"name": "fire"}, {"name": "water"}, {"name": "grass"}]
        response = self.client.post("/api/types/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 201)
    
    def test_get_type_with_modifiers_success(self):
        self.client.force_authenticate(user=self.user)

        data = [
            {"attacking_type": self.ice_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.ice_id, "defending_type": self.ice_id, "multiplier": 0.5},
            {"attacking_type": self.ice_id, "defending_type": self.fairy_id, "multiplier": 1.0},
            {"attacking_type": self.dragon_id, "defending_type": self.ice_id, "multiplier": 1.0},
            {"attacking_type": self.dragon_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.dragon_id, "defending_type": self.fairy_id, "multiplier": 0.0},
            {"attacking_type": self.fairy_id, "defending_type": self.ice_id, "multiplier": 1.0},
            {"attacking_type": self.fairy_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.fairy_id, "defending_type": self.fairy_id, "multiplier": 1.0},
        ]
        response = self.client.post("/api/advantages/", data=json.dumps(data), content_type="application/json")

        response = self.client.get(f"/api/types/{self.ice_id}/")

        self.assertEqual(200, response.status_code)
        self.assertTrue("defensive_resistances" in response.data)
        self.assertTrue(3, len(response.data["defensive_resistances"]))

    def test_list_types_with_modifiers_success(self):
        self.client.force_authenticate(user=self.user)

        data = [
            {"attacking_type": self.ice_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.ice_id, "defending_type": self.ice_id, "multiplier": 0.5},
            {"attacking_type": self.ice_id, "defending_type": self.fairy_id, "multiplier": 1.0},
            {"attacking_type": self.dragon_id, "defending_type": self.ice_id, "multiplier": 1.0},
            {"attacking_type": self.dragon_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.dragon_id, "defending_type": self.fairy_id, "multiplier": 0.0},
            {"attacking_type": self.fairy_id, "defending_type": self.ice_id, "multiplier": 1.0},
            {"attacking_type": self.fairy_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.fairy_id, "defending_type": self.fairy_id, "multiplier": 1.0},
        ]
        response = self.client.post("/api/advantages/", data=json.dumps(data), content_type="application/json")

        response = self.client.get(f"/api/types/")

        self.assertEqual(200, response.status_code)
        self.assertTrue("modifier_table" in response.data)

    '''
        Expected Tests:
            HTTP Request to: /api/advantages/
            Results: Success
    '''
    def test_create_multiple_modifiers_success(self):
        self.client.force_authenticate(user=self.user)

        data = [
            {"attacking_type": self.ice_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.ice_id, "defending_type": self.ice_id, "multiplier": 0.5},
            {"attacking_type": self.ice_id, "defending_type": self.fairy_id, "multiplier": 1.0},
            {"attacking_type": self.dragon_id, "defending_type": self.ice_id, "multiplier": 1.0},
            {"attacking_type": self.dragon_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.dragon_id, "defending_type": self.fairy_id, "multiplier": 0.0},
            {"attacking_type": self.fairy_id, "defending_type": self.ice_id, "multiplier": 1.0},
            {"attacking_type": self.fairy_id, "defending_type": self.dragon_id, "multiplier": 2.0},
            {"attacking_type": self.fairy_id, "defending_type": self.fairy_id, "multiplier": 2.0},
        ]
        response = self.client.post("/api/advantages/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 201)
