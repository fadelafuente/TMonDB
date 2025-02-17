from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

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
        
        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user)
            Monster.objects.create(name=f'Monster {index}', date_created=cls.test_start_time, article=article)

        cls.monster = Monster.objects.all()[0]

    def test_create_monster(self):
        self.client.force_authenticate(user=self.user)

        data = {'name': 'Umbreon'}
        response = self.client.post('/api/monsters/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)

    def test_get_monster(self):
        self.client.force_authenticate(user=self.user)
        # regex = re.compile('[a-zA-Z]+[a-zA-Z0-9\s\']*')

        expected_data = {'id': self.monster.id, 'article': OrderedDict({'id': self.monster.article.id, 
                        'creator': OrderedDict({'id': self.monster.article.creator.id, 'username': self.monster.article.creator.username})}), 
                        'name': self.monster.name, 'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), 'national_id': None, 
                        'species': None, 'avg_weight': None, 'avg_height': None, 'description': None, 'etymology': None, 'hidden_ability': None, 
                        'types': [], 'abilities': []}

        response = self.client.get(f'/api/monsters/{self.monster.id}/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_data)