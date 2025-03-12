from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from articles.models import Article
from abilities.models import Ability

AppUser = get_user_model()

class TestAbilities(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email='testemail@domain.com', 
                                               password='TestPassword123@#$', 
                                               username='testuser', 
                                               first_name='test', 
                                               last_name='user')
        cls.test_start_time = timezone.now()
        
        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
            Ability.objects.create(name=f'Sheer Force {index}', 
                                   effect='Sheer Force increases the power of moves that have beneficial ' +
                                   f'secondary effects by {index * 30}%, but removes those additional effects.',
                                   article=article)

        cls.ability = Ability.objects.all()[0]

    def test_create_monster(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Synchronize', 'effect': 'If the opponent causes a burn, paralysis, or poisoning ' +
            'of a Pokémon with Synchronize, the opponent receives the status condition too. Self-inflicted ' +
            'status conditions (for example through the use of an item) are not passed on.'}
        response = self.client.post('/api/abilities/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_get_ability(self):
        self.client.force_authenticate(user=self.user)

        expected_data = {'id': self.ability.id, 'article': OrderedDict({'id': self.ability.article.id, 
                        'creator': OrderedDict({'id': self.ability.article.creator.id, 'username': self.ability.article.creator.username}), 
                        'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}), 'likes_count': 0, 'reposts_count': 0, 
                        'comments_count': 0, 'is_current_user' : True, 'user_liked': False, 'user_reposted': False, 'user_commented': False, 
                        'name': self.ability.name, 'effect': self.ability.effect}

        response = self.client.get(f'/api/abilities/{self.ability.id}/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_data)