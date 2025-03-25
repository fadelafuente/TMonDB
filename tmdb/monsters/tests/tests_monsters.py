from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from abilities.models import Ability
from articles.models import Article
from monsters.models import Monster, Evolution, MoveSet
from moves.models import Move
from typings.models import Type

AppUser = get_user_model()

class TestMonsters(APITestCase):
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

        abilities = []
        for index in range(1, 7):
            article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
            abilities.append(Ability.objects.create(name=f'Sheer Force {index}', 
                                   effect='Sheer Force increases the power of moves that have beneficial ' +
                                   f'secondary effects by {index * 30}%, but removes those additional effects.',
                                   article=article))

        cls.abilities = abilities

        ice_type = Type.objects.create(name=f'ice', creator=cls.user, date_created=cls.test_start_time)
        fairy_type = Type.objects.create(name=f'fairy', creator=cls.user, date_created=cls.test_start_time)
        dragon_type = Type.objects.create(name=f'dragon', creator=cls.user, date_created=cls.test_start_time)
        
        cls.types = [ice_type, fairy_type, dragon_type]
        
        for index in range(1, 4):
            article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
            Monster.objects.create(name=f'Monster {index}', article=article)

        cls.moves = []
        for index in range(1, 4):
            article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
            cls.moves.append(Move.objects.create(name=f'Ice Beam {index}', power=30 * index, article=article))

        Evolution.objects.create(from_monster=Monster.objects.all()[0], to_monster=Monster.objects.all()[1], method='Level 16')
        MoveSet.objects.create(monster=Monster.objects.all()[0], move=cls.moves[0], method='Level 20')

        cls.monster = Monster.objects.all()[0]
        cls.monster2 = Monster.objects.all()[1]
        cls.monster3 = Monster.objects.all()[2]
        cls.monster.abilities.set([abilities[0].id])
        cls.monster.types.set([cls.types[0].id])

    def test_create_monster(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_with_abilities(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon', 'abilities': [self.abilities[0].id]}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_create_monster_with_type(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon', 'types': [self.types[0].id]}
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
                        'description': None, 'etymology': None, 'hidden_ability': None, 'types': [OrderedDict({'id': self.types[0].id, 
                        'name': self.types[0].name, 'defense_modifiers': []})], 'abilities': [OrderedDict({'id': 4, 'name': self.abilities[0].name, 
                        'effect': self.abilities[0].effect})], 'evolutions': [{'id': 2, 'name': 'Monster 2', 'method': 'Level 16'}], 
                        'pre_evolutions': [], 'moveset': [{'id': self.moves[0].id, 'name': self.moves[0].name, 'type': None, 'properties': None, 
                        'method': 'Level 20'}]}

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

        data = {'abilities': [self.abilities[0].id, self.abilities[1].id, self.abilities[2].id], 'hidden_ability': self.abilities[3].id}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['abilities']), 3)
        self.assertNotEqual(response.data['hidden_ability'], None)

    def test_update_monster_with_too_many_abilities(self):
        self.client.force_authenticate(user=self.user)

        data = {'abilities': [obj.id for obj in self.abilities]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)

    def test_update_monster_types(self):
        self.client.force_authenticate(user=self.user)

        data = {'types': [self.types[1].id, self.types[2].id]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['types']), 2)

    def test_update_monster_with_too_many_types(self):
        self.client.force_authenticate(user=self.user)

        data = {'types': [obj.id for obj in self.types]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)

    def test_create_pre_evolution(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Preevomon', 'evolutions': [{'to_monster': self.monster.id, 'method': 'Level 16'}]}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.data['evolutions']), 1)

    def test_create_evolution(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Evomon', 'evolutions': [{'from_monster': self.monster.id, 'method': 'Level 16'}]}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        get_response = self.client.get(f'/api/monsters/{response.data['id']}/')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(list(get_response.data['pre_evolutions'][0].keys()), ['id', 'name', 'method'])

    def test_update_evolution_with_new_evolutions(self):
        self.client.force_authenticate(user=self.user)

        data = {'evolutions': [{'from_monster': self.monster.id, 'to_monster': self.monster3.id, 'method': 'Level 32'}]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        get_response = self.client.get(f'/api/monsters/{response.data['id']}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(get_response.data['evolutions'][0]['id'], self.monster3.id)

    def test_update_pre_evolution_with_new_evolutions(self):
        self.client.force_authenticate(user=self.user)

        data = {'pre_evolutions': [{'from_monster': self.monster3.id, 'to_monster': self.monster.id, 'method': 'Level 16'}]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        get_response = self.client.get(f'/api/monsters/{response.data['id']}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(get_response.data['pre_evolutions'][0]['id'], self.monster3.id)

    def test_update_evolution_fail(self):
        self.client.force_authenticate(user=self.user2)

        data = {'evolutions': [{'from_monster': self.monster.id, 'to_monster': self.monster3.id, 'method': 'Level 16'}]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 403)

    def test_update_same_evolution_fail(self):
        self.client.force_authenticate(user=self.user)

        data = {'evolutions': [{'from_monster': self.monster.id, 'to_monster': self.monster.id, 'method': 'Level 16'}]}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)

    def test_update_pre_evolution_as_evolution_fail(self):
        self.client.force_authenticate(user=self.user)

        data = {'evolutions': [{'from_monster': self.monster2.id, 'to_monster': self.monster.id, 'method': 'Level 16'}]}
        response = self.client.patch(f'/api/monsters/{self.monster2.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)

    def test_create_with_another_users_monster_as_evolution(self):
        self.client.force_authenticate(user=self.user2)

        data = {'name': 'failmon', 'evolutions': [{'from_monster': self.monster.id, 'method': 'Level 16'}]}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 403)

    def test_update_monsters_moves(self):
        self.client.force_authenticate(user=self.user)

        moveset = []
        for move in self.moves:
            moveset.append({'move': move.id, 'monster': self.monster.id, 'method': 'level 32'})

        data = {'moveset': moveset}
        response = self.client.patch(f'/api/monsters/{self.monster.id}/', data=json.dumps(data), content_type='application/json')
        get_response = self.client.get(f'/api/monsters/{self.monster.id}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(move['method'] == 'level 32' for move in get_response.data['moveset'])