from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from articles.models import Article
from worlds.models import World

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

        article = Article.objects.create(creator=cls.user, date_created=cls.test_start_time)
        cls.world = World.objects.create(name='Temtem', 
                                         description='Temtem is a massively multiplayer creature-collection adventure created by Crema and published by Humble Games.', 
                                         article=article)
        
    def test_create_region(self):
      self.client.force_authenticate(user=self.user)

      data = {'name': 'Cipanku', 'description': 'Cipanku ("Land of the Pansun") dabbles in mysticism and technology. The labs of Nanto produce Digital Temtem, while the monks in remote hills among the rice paddies revere Electric Temtem. While the Cipanki are less literal in their religious practice, they still respect the old traditions.',
              'world': self.world.id}
      response = self.client.post('/api/regions/', data=json.dumps(data), content_type='application/json')
      
      self.assertEqual(response.status_code, 201)