from rest_framework.test import APITestCase
from posts.models import Post
from articles.models import Article
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
from collections import OrderedDict
from django.core.exceptions import ValidationError
import json

AppUser = get_user_model()

#     '''
#         Request should fail without Authentication
#     '''
#     def test_delete_post_anonymous(self):
#         response = self.client.delete(f'/api/posts/{self.post_id}/')
        
#         self.assertEqual(response.status_code, 401)

#     def test_likes_anonymous(self):
#         response = self.client.patch(f'/api/posts/{self.post_id}/like/', data=json.dumps({}), content_type='application/json')        
#         self.assertEqual(response.status_code, 401)

#     def test_post_content_is_edited_anonymous(self):
#         data = {'content': 'This is an updated test'}
#         response = self.client.patch(f'/api/posts/{self.post_id}/', data=json.dumps(data), content_type='application/json')
        
#         self.assertEqual(response.status_code, 401)
    
#     '''
#         Request should pass with or without Authentication
#             Returns an empty object
#     '''

#     def test_delete_post_user_unauthenticated(self):
#         self.client.force_authenticate(user=self.user2)

#         response = self.client.delete(f'/api/posts/{self.post_id}/')
        
#         self.assertEqual(response.status_code, 401)

#     def test_post_content_is_edited_unauthenticated(self):
#         self.client.force_authenticate(user=self.user2)

#         data = {'content': 'This is an updated test'}
#         response = self.client.patch(f'/api/posts/{self.post_id}/', data=json.dumps(data), content_type='application/json')
        
#         self.assertEqual(response.status_code, 401)

#     '''
#         Request should pass with Authentication
#     '''
#     def test_create_post_user_authenticated(self):
#         self.client.force_authenticate(user=self.user)

#         data = {'content': 'TESTING!!!'}
#         response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
        
#         self.assertEqual(response.status_code, 201)

#     def test_creator_and_posted_date_added(self):
#         self.client.force_authenticate(user=self.user)

#         before_creation = timezone.now()
#         data = {'content': 'TESTING!!!'}
#         response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
#         posted_date = dateparse.parse_datetime(response.data['posted_date'])
        
#         self.assertEqual(response.data['creator'], self.user.id)
#         self.assertGreaterEqual(timezone.now(), posted_date)
#         self.assertLessEqual(before_creation, posted_date)

#     def test_delete_post_user_authenticated(self):
#         self.client.force_authenticate(user=self.user)

#         response = self.client.delete(f'/api/posts/{self.post_id}/')
        
#         self.assertEqual(response.status_code, 204)
#         with self.assertRaises(Post.DoesNotExist):
#             Post.objects.get(id=self.post_id)

#     def test_like_post(self):
#         self.client.force_authenticate(user=self.user)

#         response1 = self.client.get(f'/api/posts/{self.post_id}/')
#         response2 = self.client.patch(f'/api/posts/{self.post_id}/like/', data=json.dumps({}), content_type='application/json')
#         response3 = self.client.get(f'/api/posts/{self.post_id}/')
        
#         self.assertEqual(response2.status_code, 200)
#         self.assertEqual(response1.data['likes_count'], response3.data['likes_count'] - 1)
#         self.assertTrue(self.user.id in response3.data['who_liked'])

#     def test_post_content_is_edited(self):
#         self.client.force_authenticate(user=self.user)

#         data = {'content': 'This is an updated test'}
#         response = self.client.patch(f'/api/posts/{self.post_id}/', data=json.dumps(data), content_type='application/json')
        
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data['content'], 'This is an updated test')
#         self.assertTrue(response.data['is_edited'])

#     def test_post_comment(self):
#         self.client.force_authenticate(user=self.user)
#         data = {'content': 'TESTING!!!', 'is_reply': True, 'parent': self.post_id}
#         response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
#         parent = Post.objects.get(id=self.post_id)

#         self.assertEqual(response.status_code, 201)
#         self.assertTrue(response.data['is_reply'])
#         self.assertEqual(response.data['parent'], self.post_id)
#         self.assertEqual(parent.comments.all().first().id, response.data['id'])

#     def test_delete_parent(self):
#         self.client.force_authenticate(user=self.user)
#         data = {'content': 'TESTING!!!', 'is_reply': True, 'parent': self.post_id}
#         response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
#         self.client.delete(f'/api/posts/{self.post_id}/')
#         comment_response = self.client.get(f'/api/posts/{response.data['id']}/')

#         with self.assertRaises(Post.DoesNotExist):
#             Post.objects.get(id=self.post_id)
#         self.assertEqual(comment_response.data['parent'], None)
#         self.assertTrue(comment_response.data['parent_deleted'])
        
#     def test_post_comment_twice(self):
#         self.client.force_authenticate(user=self.user)
#         data = {'content': 'TESTING!!!', 'is_reply': True, 'parent': self.post_id}
#         response1 = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
#         response2 = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

#         self.assertEqual(response1.status_code, 201)
#         self.assertEqual(response2.status_code, 403)

#     def test_user_double_liked(self):
#         self.client.force_authenticate(user=self.user)

#         self.client.patch(f'/api/posts/{self.post_id}/like/', data=json.dumps({}), content_type='application/json')
#         response1 = self.client.get(f'/api/posts/{self.post_id}/')
#         self.client.patch(f'/api/posts/{self.post_id}/like/', data=json.dumps({}), content_type='application/json')
#         response2 = self.client.get(f'/api/posts/{self.post_id}/')

#         self.assertTrue(response1.data['user_liked'] != response2.data['user_liked'])
#         self.assertTrue(self.user.id in response1.data['who_liked'])
#         self.assertTrue(self.user.id not in response2.data['who_liked'])

#     def test_user_blocked_list(self):
#         self.client.force_authenticate(user=self.user)

#         self.user.blocking.set([self.user2.id])

#         response = self.client.get('/api/posts/?page=1')
#         self.assertTrue(self.user2.id not in user for user in response.data['results'])

#     def test_blocked_users_posts_do_not_return(self):
#         self.client.force_authenticate(user=self.user)

#         self.user.blocking.set([self.user2.id])
#         response = self.client.get('/api/posts/?page=1')

#         self.assertTrue(post['creator'] != self.user2.id for post in response.data['results'])

#     def test_blocked_users_post_returns_error(self):
#         self.user.blocking.set([self.user2.id])

#         self.client.force_authenticate(user=self.user2)
#         response = self.client.get(f'/api/posts/{self.post_id}/')

#         self.assertTrue(response.status_code == 403)

class TestPosts(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user1 = AppUser.objects.create_user(email='testemail@domain.com', password='testpassword', username='testuser', first_name='test', last_name='user')
        cls.user2 = AppUser.objects.create_user(email='testemail2@domain.com', password='testpassword', username='testuser2', first_name='test2', last_name='user2')
        cls.test_start_time = timezone.now()

        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user1)
            Post.objects.create(content=f'test post {index}', posted_date=cls.test_start_time, article=article)

        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user2)
            Post.objects.create(content=f'test post {index}', posted_date=cls.test_start_time, article=article)
        
        cls.post = Post.objects.all()[0]

    # Test List/Retrieve posts
    def test_get_post_anonymous(self):
        expected = {'id': self.post.id, 'content': self.post.content, 'likes_count': 0, 'reposts_count': 0, 'comments_count': 0, 
                    'parent': None, 'posted_date': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), 
                    'creator': OrderedDict({'id': self.user1.id, 'username': self.user1.username}), 'is_reply': False,
                    'is_current_user': False, 'user_liked': False, 'user_reposted': False, 'user_commented': False}

        response = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_get_current_users_post(self):
        self.client.force_authenticate(user=self.user1)

        expected = {'id': self.post.id, 'content': self.post.content, 'likes_count': 0, 'reposts_count': 0, 'comments_count': 0, 
                    'parent': None, 'posted_date': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), 
                    'creator': OrderedDict({'id': self.user1.id, 'username': self.user1.username}), 'is_reply': False,
                    'is_current_user': True, 'user_liked': False, 'user_reposted': False, 'user_commented': False}

        response = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_get_all_posts_anonymous(self):
        response = self.client.get('/api/posts/?page=1')
                
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 4)

    def test_get_posts_by_username_user_found(self):
        username = self.user1.username
        response = self.client.get(f'/api/posts/?page=1&username={username}')

        all_by_user = True
        for post in response.data['results']:
            if not post['creator']['username'] == username: 
                all_by_user = False
                break

        self.assertEqual(response.status_code, 200)
        self.assertTrue(all_by_user)

    def test_get_posts_by_username_user_not_found(self):
        response = self.client.get(f'/api/posts/?page=1&username=fakeprofile')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data['results']) == 0)

    # Test create posts
    def test_create_post_anonymous(self):
        data = {'content': 'TESTING!!!'}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 401)

    def test_create_post_logged_in(self):
        self.client.force_authenticate(user=self.user1)

        data = {'content': 'TESTING!!!'}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        self.assertTrue('article' in response.data)

    def test_create_post_content_too_long(self):
        self.client.force_authenticate(user=self.user1)

        data = {'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia sit amet ' +
                'metus non euismod. In posuere lectus ut justo facilisis dictum. Fusce posuere dignissim fringilla. ' + 
                'Nulla efficitur tellus libero, id tincidunt mauris hendrerit pretium. Ut vel magna sapien. '  + 
                'Morbi sollicitudin id nisl eu luctus. Mauris congue odio et neque viverra cras.'}

        with self.assertRaises(ValidationError):
            self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')