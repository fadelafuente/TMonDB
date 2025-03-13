from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from abilities.models import Ability
from articles.models import Article
from monsters.models import Monster

AppUser = get_user_model()

class TestMonsters(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email='testemail@domain.com', 
                                               password='TestPassword123@#$', 
                                               username='testuser', 
                                               first_name='test', 
                                               last_name='user')
        cls.test_start_time = timezone.now()

        abilities = []
        for index in range(1, 7):
            article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
            abilities.append(Ability.objects.create(name=f'Sheer Force {index}', 
                                   effect='Sheer Force increases the power of moves that have beneficial ' +
                                   f'secondary effects by {index * 30}%, but removes those additional effects.',
                                   article=article))

        cls.abilities = abilities
        
        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
            Monster.objects.create(name=f'Monster {index}', article=article)

        cls.monster = Monster.objects.all()[0]
        cls.monster.abilities.set([abilities[0].id])

    def test_create_monster(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_with_abilities(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon', 'abilities':[self.abilities[0].id]}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_allow_numbers(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': '0b10'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_allow_apostrophes(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Mak\'Wahurt'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_capitalize_name_and_allow_dashes(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'zea-Zaya'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'Zea-Zaya')

    def test_create_monster_allow_accented_characters(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Liloriña'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_invalid_name(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'P!k@cHu'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)

    def test_get_monster(self):
        self.client.force_authenticate(user=self.user)

        expected_data = {'id': self.monster.id, 'article': OrderedDict({'id': self.monster.article.id, 
                        'creator': OrderedDict({'id': self.monster.article.creator.id, 'username': self.monster.article.creator.username}), 
                        'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}), 'likes_count': 0, 'reposts_count': 0, 
                        'comments_count': 0, 'is_current_user' : True, 'user_liked': False, 'user_reposted': False, 'user_commented': False, 
                        'name': self.monster.name, 'national_id': None, 'species': None, 'avg_weight': None, 'avg_height': None, 
                        'description': None, 'etymology': None, 'hidden_ability': None, 'types': [], 'abilities': [OrderedDict({'id': 4, 
                        'name': self.abilities[0].name, 'effect': self.abilities[0].effect})]}

        response = self.client.get(f'/api/monsters/{self.monster.id}/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_data)

    def test_comment_on_monster(self):
        self.client.force_authenticate(user=self.user)

        data = {'content': 'This monster is so cool!', 'parent': self.monster.article.id}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['parent'], self.monster.article.id)

    def test_like_monster(self):
        self.client.force_authenticate(user=self.user)

        response1 = self.client.get(f'/api/monsters/{self.monster.id}/')
        response2 = self.client.patch(f'/api/monsters/{self.monster.id}/like/')
        response3 = self.client.get(f'/api/monsters/{self.monster.id}/')
        
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.data['likes_count'], response3.data['likes_count'] - 1)

    def test_update_monster_with_new_abilities(self):
        self.client.force_authenticate(user=self.user)

        data = {'abilities':[self.abilities[0].id, self.abilities[1].id, self.abilities[2].id], 'hidden_ability': self.abilities[3].id}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['abilities']), 3)
        self.assertNotEqual(response.data['hidden_ability'], None)

    def test_update_monster_with_too_many_abilities(self):
        self.client.force_authenticate(user=self.user)

        abilities = []
        for ability in self.abilities:
            abilities.append(ability.id)

        data = {'abilities': abilities}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)