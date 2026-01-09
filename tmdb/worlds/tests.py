from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from abilities.models import Ability
from articles.models import Article
from monsters.models import Monster
from worlds.models import World
from typings.models import Type

AppUser = get_user_model()

class TestWorlds(APITestCase):
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

        article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
        World.objects.create(article=article, name='Pokemon', description='Pokemon fell off!')
        article = Article.objects.create(creator=cls.user2, date_created=cls.test_start_time)
        World.objects.create(article=article, name='Monster Sanctuary', description='Monster Sanctuary was more fun than Pokemon.')

    def test_create_world(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Temtem', 'description': 'Temtem is a massively multiplayer creature-collection adventure created by Crema and published by Humble Games.',
                'monster_alias': 'Temtem', 'course_alias': 'Technique Course', 'move_alias': 'Technique', 'ability_alias': 'Trait',
                'properties': [{'name': 'Class'}, {'name': 'STA Cost'}, {'name': 'Priority'}, {'name': 'Hold'}]}
        response = self.client.post('/api/worlds/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_get_worlds(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/worlds/')
        self.assertEqual(response.status_code, 200)

    def test_get_users_worlds_with_reply_param(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/worlds/?reply=only_aliases&username={self.user.username}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)