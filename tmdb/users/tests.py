from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
import json

AppUser = get_user_model()

class TestPosts(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email='testemail@domain.com', password='TestPassword123@#$', username='testuser', first_name='test', last_name='user')
        cls.user2 = AppUser.objects.create_user(email='testemail2@domain.com', password='TestPassword321$#@', username='testuser2', first_name='test2', last_name='user2')
        cls.user3 = AppUser.objects.create_user(email='testemail3@domain.com', password='TestPassword987^&*', username='testuser3', first_name='test3', last_name='user3')

    def test_create_username_is_invalid(self):
        data = {'email': 'testemail4@domain.com', 'password': 'TestPassword123^%$', 're_password': 'TestPassword123^%$', 'username': 'test@user!', 'first_name': 'test', 'last_name': 'user4'}

        response = self.client.post('/auth/users/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)

    def test_create_username_isvalid(self):
        data = {'email': 'testemail4@domain.com', 'password': 'TestPassword123!@#', 're_password': 'TestPassword123!@#', 'username': 'testuser4', 'first_name': 'test', 'last_name': 'user4'}

        response = self.client.post('/auth/users/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_create_password_is_invalid(self):
        data = {'email': 'testemail4@domain.com', 'password': 'testpassword', 're_password': 'testpassword', 'username': 'testuser4', 'first_name': 'test', 'last_name': 'user4'}

        expected_response = 'Password is missing the following requirements: at least 1 uppercase, at least 1 number, at least 1 special character.'

        response = self.client.post('/auth/users/', data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(str(response.data['password'][0]), expected_response)
    
    # Not necessary to test, here for me to see how updating usernames would work
    def test_update_username(self):
        self.client.force_authenticate(user=self.user)

        data = {'username': 'updatedUser'}
        response = self.client.patch('/auth/users/me/', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'updatedUser')

    def test_follow_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(f'/auth/users/{self.user2.username}/follow/')

        self.assertEqual(response.status_code, 200)

    def test_get_following(self):
        self.client.force_authenticate(user=self.user)

        self.client.patch(f'/auth/users/{self.user2.username}/follow/')
        self.client.patch(f'/auth/users/{self.user3.username}/follow/')
        response = self.client.get(f'/auth/users/{self.user.username}/following/?page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_delete_followers(self):
        self.client.force_authenticate(user=self.user)

        # first call adds if not following
        self.client.patch(f'/auth/users/{self.user2.username}/follow/')
        # second call deletes if already following
        self.client.patch(f'/auth/users/{self.user2.username}/follow/')
        response = self.client.get(f'/auth/users/{self.user.username}/following/?page=1')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data['results']) == 0)

    def test_get_followers(self):
        self.client.force_authenticate(user=self.user)

        # first call adds if not following
        self.client.patch(f'/auth/users/{self.user2.username}/follow/')

        response = self.client.get(f'/auth/users/{self.user2.username}/followers/?page=1')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data['results']) == 1)

    def get_following_anonymous(self):
        response = self.client.get(f'/auth/users/{self.user.username}/following/?page=1')

        self.assertEqual(response.status_code, 200)

    def test_get_user_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/auth/users/{self.user2.username}/')

        self.assertTrue(response.status_code == 200)
        self.assertTrue(key in ['id', 'username', 'bio', 'following_count', 'followers_count'] for key in response.data.keys())
        self.assertFalse(response.data['current_user'])

    def test_get_current_user_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/auth/users/{self.user.username}/')
    
        self.assertTrue(response.status_code == 200)
        # self.assertTrue(response.data['current_user'])

    def test_get_user_anonymous(self):
        response = self.client.get(f'/auth/users/{self.user.username}/')
    
        self.assertTrue(response.status_code == 200)

    def test_get_current_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/auth/users/me/')

        self.assertTrue(response.status_code == 200)
        self.assertTrue(key in ['username', 'id', 'email'] for key in response.data.keys())

    def test_delete_current_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f'/auth/users/me/', data=json.dumps({'current_password': 'TestPassword123@#$'}), content_type='application/json')

        self.assertTrue(response.status_code == 204)

    def test_delete_current_user_wrong_password(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f'/auth/users/me/', data=json.dumps({'current_password': 'testpassword'}), content_type='application/json')

        self.assertTrue(response.status_code == 400)
    
    def test_get_user_profile_does_not_exist(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/auth/users/lkfsdjfldskjfldskjfs/')

        self.assertEqual(response.status_code, 404)

    def test_block_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(f'/auth/users/{self.user2.username}/block/')
        response = self.client.get(f'/auth/users/blocking/?page=1')

        self.assertTrue(response.status_code==200)
        self.assertTrue(self.user2.id == response.data['results'][0]['id'])

    def test_get_blocked_user_profile(self):
        self.client.force_authenticate(user=self.user2)
        self.client.patch(f'/auth/users/{self.user.username}/block/')

        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/auth/users/{self.user2.username}/')

        self.assertTrue(response.data['current_user_is_blocked'])

    def test_get_following_list_after_blocking(self):
        self.client.force_authenticate(user=self.user)

        self.client.patch(f'/auth/users/{self.user2.username}/follow/')
        self.client.patch(f'/auth/users/{self.user3.username}/follow/')

        response = self.client.patch(f'/auth/users/{self.user2.username}/block/')
        response = self.client.get(f'/auth/users/{self.user.username}/following/?page=1')

        for user in response.data['results']:
            if self.user2.id == user['id']:
                self.assertFalse(self.user2.id == user['id'], msg=f'blocking user {self.user2.username} did not remove from following list')
            if self.user3.id == user['id']:
                self.assertTrue(self.user3.id == user['id'])

    def test_get_following_list_after_being_blocked(self):
        self.client.force_authenticate(user=self.user)
        self.client.patch(f'/auth/users/{self.user2.username}/follow/')

        self.client.force_authenticate(user=self.user2)
        self.client.patch(f'/auth/users/{self.user.username}/block/')

        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/auth/users/{self.user.username}/following/?page=1')
        
        self.assertTrue(response.data['results'] == [])

    def test_get_followers_list_after_blocking(self):
        self.client.force_authenticate(user=self.user)
        self.client.patch(f'/auth/users/{self.user2.username}/follow/')

        self.client.force_authenticate(user=self.user2)
        self.client.patch(f'/auth/users/{self.user.username}/block/')
        response = self.client.get(f'/auth/users/{self.user2.username}/followers/?page=1')
        self.assertTrue(response.data['results'] == [])

        # Unblocking does not refollow
        self.client.patch(f'/auth/users/{self.user.username}/block/')
        response = self.client.get(f'/auth/users/{self.user.username}/followers/?page=1')
        self.assertTrue(response.data['results'] == [])

    def test_get_followers_list_after_being_blocked(self):
        self.client.force_authenticate(user=self.user)
        self.client.patch(f'/auth/users/{self.user2.username}/follow/')

        self.client.force_authenticate(user=self.user2)
        self.client.patch(f'/auth/users/{self.user.username}/block/')

        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/auth/users/{self.user.username}/followers/?page=1')
        self.assertTrue(response.data['results'] == [])

    def test_user_blocks_themselves(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(f'/auth/users/{self.user.username}/block/')

        self.assertEqual(response.status_code, 403)

    def test_user_follows_themselves(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(f'/auth/users/{self.user.username}/follow/')

        self.assertEqual(response.status_code, 403)