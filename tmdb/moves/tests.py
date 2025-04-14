from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from articles.models import Article
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

        cls.ice_type = Type.objects.create(name=f'ice', creator=cls.user, date_created=cls.test_start_time)
        cls.fairy_type = Type.objects.create(name=f'fairy', creator=cls.user, date_created=cls.test_start_time)
        cls.dragon_type = Type.objects.create(name=f'dragon', creator=cls.user, date_created=cls.test_start_time)

        article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
        cls.move = Move.objects.create(name=f'Moonblast', power=95, type=cls.fairy_type, article=article, description=f'Moonblast deals damage and has a 30% chance of lowering the target\'s Special Attack by one stage.')

    def test_create_move(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Dragon Claw', 'power': 80, 'type': self.dragon_type.id, 'description': 'Dragon Claw deals damage with no additional effect.'}
        response = self.client.post('/api/moves/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_get_move(self):
        self.client.force_authenticate(user=self.user)

        expected_data = {'id': self.move.id, 'likes_count': 0, 'reposts_count': 0, 'comments_count': 0, 
                        'is_current_user': True, 'user_liked': False, 'user_reposted': False, 
                        'user_commented': False, 'article': OrderedDict({'id': self.move.article_id, 
                        'creator': OrderedDict({'id': self.user.id, 'username': self.user.username}),
                        'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}), 
                        'name': self.move.name, 'description': self.move.description, 'power': self.move.power, 
                        'type': OrderedDict({'id': self.fairy_type.id, 'name': self.fairy_type.name})}
        
        response = self.client.get(f'/api/moves/{self.move.id}/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_data)