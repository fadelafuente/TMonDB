from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase
import json

from .models import Type, TypeModifier

AppUser = get_user_model()

class TestTypes(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.test_start_time = timezone.now()
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
        
        ice_type = Type.objects.create(name=f'ice', creator=cls.user2, date_created=cls.test_start_time)
        fairy_type = Type.objects.create(name=f'fairy', creator=cls.user2, date_created=cls.test_start_time)
        dragon_type = Type.objects.create(name=f'dragon', creator=cls.user2, date_created=cls.test_start_time)

        TypeModifier.objects.create(attacking_type=ice_type, defending_type=ice_type, multiplier=0.5)
        TypeModifier.objects.create(attacking_type=dragon_type, defending_type=ice_type, multiplier=1.0)
        TypeModifier.objects.create(attacking_type=fairy_type, defending_type=ice_type, multiplier=1.0)
        
        cls.ice_id = ice_type.id
        cls.fairy_id = fairy_type.id
        cls.dragon_id = dragon_type.id

    '''
        Expected Tests:
            HTTP Request to: /api/types/
            Results: Fail
    '''
    # def test_create_type_anonymous_fail(self):
    #     data = [{'name': 'water'}]
    #     response = self.client.post('/api/types/', data=json.dumps(data), content_type='application/json')

    #     self.assertEqual(response.status_code, 401)

    def test_delete_type_unauthorized_user_fail(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f'/api/types/{self.ice_id}/')

        self.assertEqual(response.status_code, 403)

    def test_delete_type_anonymous_fail(self):
        response = self.client.delete(f'/api/types/{self.ice_id}/')

        self.assertEqual(response.status_code, 401)

    def test_update_type_unauthorized_user_fail(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'nature'}
        response = self.client.patch(f'/api/types/{self.ice_id}/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 403)

    def test_update_type_anonymous_fail(self):
        data = {'name': 'nature'}
        response = self.client.patch(f'/api/types/{self.ice_id}/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 401)

    '''
        Expected Tests:
            HTTP Request to: /api/types/
            Results: Success
    '''
    def test_create_type_success(self):
        self.client.force_authenticate(user=self.user)

        data = {
            'types': [{'name': 'fire'}],
            'type_advantages': []
        }
        response = self.client.post('/api/types/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_delete_type_authorized_user_success(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(f'/api/types/{self.ice_id}/')

        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Type.DoesNotExist):
            Type.objects.get(id=self.ice_id)

    def test_update_type_authorized_user_success(self):
        self.client.force_authenticate(user=self.user2)

        data = {'name': 'nature'}
        response = self.client.patch(f'/api/types/{self.ice_id}/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_create_multiple_types_success(self):
        self.client.force_authenticate(user=self.user)

        data = {
            'types': [{"name": "fire"}, {"name": "water"}, {"name": "grass"}], 
            'type_advantages': [
                {"attacking_type": "fire", "defending_type": "water", "multiplier": 0.5},
                {"attacking_type": "fire", "defending_type": "grass", "multiplier": 2.0},
                {"attacking_type": "fire", "defending_type": "fire", "multiplier": 0.5},
            ]
        }
        response = self.client.post('/api/types/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 201)
    
    def test_get_type_with_modifiers_success(self):
        self.client.force_authenticate(user=self.user)

        expected_data = {'id': self.ice_id, 'defense_modifiers': [OrderedDict({'multiplier': '0.50', 'attacking_type': 'ice'}), 
                        OrderedDict({'multiplier': '1.00', 'attacking_type': 'dragon'}), OrderedDict({'multiplier': '1.00', 
                        'attacking_type': 'fairy'})], 'creator': OrderedDict({'id': self.user2.id, 'username': self.user2.username}), 
                        'name': 'ice', 'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), 'locked': False}

        response = self.client.get(f'/api/types/{self.ice_id}/')

        self.assertEqual(200, response.status_code)
        self.assertEqual(response.data, expected_data)

    def test_list_types_with_modifiers_success(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/api/types/')

        self.assertEqual(200, response.status_code)

    '''
        UPDATE: All types in region?
            brainstorming:
                bulk update
                delete old types that are no longer part of region?
            example data:
                [
                    {id: 1, name: fire, region: kanto},
                    {id: 2, name: water, region: kanto},
                    {id: 3, name: grass, region: kanto}
                ]
                =>
                [
                    {id: 1, name: pyro, region: kanto},
                    {id: 2, name: hydro, region: kanto},
                    {name: electro, region: kanto}
                ]
                deletes grass type?

    '''
