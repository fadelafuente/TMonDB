from collections import OrderedDict
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
import json
from rest_framework.test import APITestCase

from articles.models import Article
from posts.models import Post

AppUser = get_user_model()

class TestPosts(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user1 = AppUser.objects.create_user(email='testemail@domain.com', password='TestPassword123@#$', username='testuser', first_name='test', last_name='user')
        cls.user2 = AppUser.objects.create_user(email='testemail2@domain.com', password='TestPassword321$#@', username='testuser2', first_name='test2', last_name='user2')
        cls.test_start_time = timezone.now()

        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user1, date_created=cls.test_start_time)
            Post.objects.create(content=f'test post {index}', article=article)

        for index in range(1, 3):
            article = Article.objects.create(creator=cls.user2, date_created=cls.test_start_time)
            Post.objects.create(content=f'test post {index}', article=article)
        
        cls.post = Post.objects.all()[0]

    '''
        Test Create posts
    '''
    def test_create_post_by_unauthenticated_user(self):
        data = {'content': 'TESTING!!!'}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 401)

    def test_create_post_user_authenticated(self):
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

    def test_post_comment(self):
        self.client.force_authenticate(user=self.user1)

        data = {'content': 'Testing replying to a previously made post.', 'parent': self.post.article_id}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['parent'], self.post.article_id)

    '''
        Test List/Retrieve posts
    '''
    def test_get_post_anonymous(self):
        expected = {'id': self.post.id, 'content': self.post.content, 'likes_count': 0, 'reposts_count': 0, 'comments_count': 0, 
                    'parent': None, 'article': OrderedDict({'id': self.post.article_id, 'creator': OrderedDict({'id': self.user1.id, 'username': self.user1.username}), 
                    'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}), 'is_current_user': False, 'user_liked': False, 
                    'user_reposted': False, 'user_commented': False, 'image': None, 'is_repost': self.post.is_repost, 'is_edited': self.post.is_edited}

        response = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_get_current_users_post(self):
        self.client.force_authenticate(user=self.user1)

        expected = {'id': self.post.id, 'content': self.post.content, 'likes_count': 0, 'reposts_count': 0, 'comments_count': 0, 
                    'parent': None, 'article': OrderedDict({'id': self.post.article_id, 'creator': OrderedDict({'id': self.user1.id, 'username': self.user1.username}), 
                    'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}), 'is_current_user': True, 'user_liked': False, 
                    'user_reposted': False, 'user_commented': False, 'image': None, 'is_repost': self.post.is_repost, 'is_edited': self.post.is_edited}
        
        response = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_get_post_current_user_commented_on(self):
        self.client.force_authenticate(user=self.user1)

        expected = {'id': self.post.id, 'content': self.post.content, 'likes_count': 0, 'reposts_count': 0, 'comments_count': 1, 
                    'parent': None, 'article': OrderedDict({'id': self.post.article_id, 'creator': OrderedDict({'id': self.user1.id, 'username': self.user1.username}), 
                    'date_created': self.test_start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}), 'is_current_user': True, 'user_liked': False, 
                    'user_reposted': False, 'user_commented': True, 'image': None, 'is_repost': self.post.is_repost, 'is_edited': self.post.is_edited}
        
        data = {'content': 'Testing replying to a previously made post.', 'parent': self.post.article_id}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

        response = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_get_all_posts_anonymous(self):
        response = self.client.get('/api/posts/?page=1')
                
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 4)

    def test_get_all_comments(self):
        self.client.force_authenticate(user=self.user1)

        data = {'content': 'Testing replying to a previously made post.', 'parent': self.post.article_id}
        post_response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

        get_response = self.client.get(f'/api/posts/?page=1&parent={self.post.article_id}')

        self.assertEqual(post_response.status_code, 201)
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(len(get_response.data['results']), 1)

    def test_get_all_replies(self):
        self.client.force_authenticate(user=self.user1)

        data = {'content': 'Testing replying to a previously made post.', 'parent': self.post.article_id}
        self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

        response = self.client.get('/api/posts/?page=1&is_reply=True')
                
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_posts_by_username_user_found(self):
        username = self.user1.username
        response = self.client.get(f'/api/posts/?page=1&username={username}')

        all_by_user = True
        for post in response.data['results']:
            if not post['article']['creator']['username'] == username: 
                all_by_user = False
                break

        self.assertEqual(response.status_code, 200)
        self.assertTrue(all_by_user)

    def test_get_posts_by_username_user_not_found(self):
        response = self.client.get(f'/api/posts/?page=1&username=fakeprofile')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data['results']) == 0)

    def test_get_posts_without_blocked_users(self):
        self.client.force_authenticate(user=self.user1)
        self.user1.blocking.set([self.user2.id])
        username = self.user2.username

        response = self.client.get('/api/posts/?page=1')

        excludes_blocked_user = True
        for post in response.data['results']:
            if post['article']['creator']['username'] == username: 
                excludes_blocked_user = False
                break

        self.assertTrue(excludes_blocked_user)

    def test_get_posts_without_posts_by_user_who_current_user_is_blocked(self):
        self.client.force_authenticate(user=self.user2)
        self.user1.blocking.set([self.user2.id])
        username = self.user1.username

        response = self.client.get('/api/posts/?page=1')

        excludes_blocked_user = True
        for post in response.data['results']:
            if post['article']['creator']['username'] == username: 
                excludes_blocked_user = False
                break

        self.assertTrue(excludes_blocked_user)

    def test_get_post_where_current_user_is_blocked(self):
        self.user1.blocking.set([self.user2.id])

        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f'/api/posts/{self.post.id}/')

        self.assertEqual(response.status_code, 403)
    
    '''
        Test Update posts
    '''
    def test_update_content_user_authenticated(self):
        self.client.force_authenticate(user=self.user1)

        data = {'content': 'This is an update test', 'is_edited': True}
        response = self.client.patch(f'/api/posts/{self.post.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_edited'])
        self.assertEqual(response.data['content'], 'This is an update test')

    def test_update_content_of_other_users_post(self):
        self.client.force_authenticate(user=self.user2)

        data = {'content': 'This is an update test', 'is_edited': True}
        response = self.client.patch(f'/api/posts/{self.post.id}/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 403)
    
    def test_like_post(self):
        self.client.force_authenticate(user=self.user2)

        response1 = self.client.get(f'/api/posts/{self.post.id}/')
        response2 = self.client.patch(f'/api/posts/{self.post.id}/likes/')
        response3 = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.data['likes_count'], response3.data['likes_count'] - 1)
        self.assertTrue(response3.data['user_liked'])

    def test_liked_by_unauthenticated_user(self):
        response = self.client.patch(f'/api/posts/{self.post.id}/likes/')
        
        self.assertEqual(response.status_code, 401)

    def test_repost_post(self):
        self.client.force_authenticate(user=self.user2)

        response1 = self.client.get(f'/api/posts/{self.post.id}/')
        response2 = self.client.patch(f'/api/posts/{self.post.id}/reposts/')
        response3 = self.client.get(f'/api/posts/{self.post.id}/')
        
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.data['reposts_count'], response3.data['reposts_count'] - 1)
        self.assertTrue(response3.data['user_reposted'])

    def test_reposted_by_unauthenticated_user(self):
        response = self.client.patch(f'/api/posts/{self.post.id}/reposts/')
        
        self.assertEqual(response.status_code, 401)
    
    '''
        Test Delete posts
    '''
    def test_delete_post_of_other_user(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(f'/api/posts/{self.post.id}/')

        self.assertEqual(response.status_code, 403)
    
    def test_delete_post_by_unauthenticated_user(self):
        response = self.client.delete(f'/api/posts/{self.post.id}/')

        self.assertEqual(response.status_code, 401)
    
    def test_delete_post_user_authenticated(self):
        self.client.force_authenticate(user=self.user1)

        article = self.post.article
        response = self.client.delete(f'/api/posts/{self.post.id}/')
        article = Article.objects.get(id=article.id)
        
        self.assertEqual(response.status_code, 204)
        self.assertTrue(article)
        with self.assertRaises(Post.DoesNotExist):
            Post.objects.get(id=self.post.id)

    def test_delete_parent(self):
        self.client.force_authenticate(user=self.user1)

        article_id = self.post.article_id

        # Create comment
        data = {'content': 'Testing: is child comment', 'parent': article_id}
        response = self.client.post('/api/posts/', data=json.dumps(data), content_type='application/json')

        # Delete parent post
        self.client.delete(f'/api/posts/{self.post.id}/')
        comment_response = self.client.get(f'/api/posts/{response.data['id']}/')
        deleted_response = self.client.get(f'/api/posts/{self.post.id}/')

        self.assertEqual(comment_response.data['parent'], article_id)
        self.assertEqual(deleted_response.status_code, 404)

    def test_get_likes(self):
        self.client.force_authenticate(user=self.user1)

        self.client.patch(f'/api/posts/{self.post.id}/likes/')
        
        response = self.client.get(f'/auth/users/{self.user1.username}/likes/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['likes_count'], 1)
