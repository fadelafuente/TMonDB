from django.contrib.auth import get_user_model
import json
from rest_framework.test import APITestCase

AppUser = get_user_model()

class TestMonsters(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email='testemail@domain.com', 
                                               password='TestPassword123@#$', 
                                               username='testuser', 
                                               first_name='test', 
                                               last_name='user')

    def test_create_monster(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)