from rest_framework.test import APITestCase

from posts.models import Post
from django.contrib.auth import get_user_model
from django.utils import timezone, dateparse
from django.contrib.auth.models import AnonymousUser
import json

AppUser = get_user_model()

class TestPosts(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = AppUser.objects.create_user(email="testemail@domain.com", password="testpassword", username="testuser", first_name="test", last_name="user")

        for index in range(1, 3):
            Post.objects.create(content=f"test post {index}", posted_date=timezone.now(), creator=cls.user)

        user = AppUser.objects.create_user(email="testemail2@domain.com", password="testpassword", username="testuser2", first_name="test2", last_name="user2")

        cls.user2 = user

        for index in range(1, 3):
            Post.objects.create(content=f"test post {index}", posted_date=timezone.now(), creator=user)
        
        cls.post_id = Post.objects.all()[1].id

    '''
        Request should fail without Authentication
    '''
    def test_create_post_anonymous(self):
        data = {"content": "TESTING!!!"}
        response = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, 401)

    def test_delete_post_anonymous(self):
        response = self.client.delete(f"/api/posts/{self.post_id}/")
        
        self.assertEqual(response.status_code, 401)

    def test_likes_anonymous(self):
        response = self.client.patch(f"/api/posts/{self.post_id}/like/", data=json.dumps({}), content_type="application/json")        
        self.assertEqual(response.status_code, 401)
    
    '''
        Request should pass with or without Authentication
            Returns an empty object
    '''
    def test_get_posts_by_username_user_not_found(self):
        self.user = AnonymousUser()

        username = "anonymoususer"
        response = self.client.get(f"/api/posts/?username={username}")
        
        self.assertFalse(response.data["results"])

    '''
        Request should pass without Authentication
    '''
    def test_get_posts(self):
        self.user = AnonymousUser()

        response = self.client.get("/api/posts/?page=1")
        
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.user.is_authenticated)

    def test_username_added_to_response_list(self):
        self.user = AnonymousUser()
        
        response = self.client.get("/api/posts/?page=1")
        results_list = response.data["results"]
        
        self.assertTrue(item["creator_username"] in ["testuser", "testuser2"] for item in results_list)

    def test_get_post_by_id(self):
        self.user = AnonymousUser()

        response = self.client.get(f"/api/posts/{self.post_id}/")
        
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.user.is_authenticated)

    def test_get_posts_by_username_user_found(self):
        self.user = AnonymousUser()

        username = "testuser"
        response_list = self.client.get("/api/posts/")
        response = self.client.get(f"/api/posts/?page=1&username={username}")
        all_posts = response_list.data["results"]
        user_posts = response.data["results"]

        self.assertTrue(user_posts)
        self.assertGreater(len(all_posts), len(user_posts))
        self.assertTrue(self.user.id == item.id for item in user_posts)

    '''
        Request should pass with Authentication
    '''
    def test_create_post_user_authenticated(self):
        self.client.force_authenticate(user=self.user)

        data = {"content": "TESTING!!!"}
        response = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, 201)

    def test_creator_and_posted_date_added(self):
        self.client.force_authenticate(user=self.user)

        before_creation = timezone.now()
        data = {"content": "TESTING!!!"}
        response = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")
        posted_date = dateparse.parse_datetime(response.data["posted_date"])
        
        self.assertEqual(response.data["creator"], self.user.id)
        self.assertGreaterEqual(timezone.now(), posted_date)
        self.assertLessEqual(before_creation, posted_date)

    def test_delete_post_user_authenticated(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f"/api/posts/{self.post_id}/")
        
        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Post.DoesNotExist):
            Post.objects.get(id=self.post_id)

    def test_like_post(self):
        self.client.force_authenticate(user=self.user)

        response1 = self.client.get(f"/api/posts/{self.post_id}/")
        response2 = self.client.patch(f"/api/posts/{self.post_id}/like/", data=json.dumps({}), content_type="application/json")
        response3 = self.client.get(f"/api/posts/{self.post_id}/")
        
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.data["likes_count"], response3.data["likes_count"] - 1)
        self.assertTrue(self.user.id in response3.data["who_liked"])

    def test_post_content_is_edited(self):
        self.client.force_authenticate(user=self.user)

        data = {"content": "This is an updated test"}
        response = self.client.patch(f"/api/posts/{self.post_id}/", data=json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["content"], "This is an updated test")
        self.assertTrue(response.data["is_edited"])

    def test_post_comment(self):
        self.client.force_authenticate(user=self.user)
        data = {"content": "TESTING!!!", "is_reply": True, "parent": self.post_id}
        response = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")
        parent = Post.objects.get(id=self.post_id)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["is_reply"])
        self.assertEqual(response.data["parent"], self.post_id)
        self.assertEqual(parent.comments.all().first().id, response.data["id"])

    def test_delete_parent(self):
        self.client.force_authenticate(user=self.user)
        data = {"content": "TESTING!!!", "is_reply": True, "parent": self.post_id}
        response = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")
        self.client.delete(f"/api/posts/{self.post_id}/")
        comment_response = self.client.get(f"/api/posts/{response.data["id"]}/")

        with self.assertRaises(Post.DoesNotExist):
            Post.objects.get(id=self.post_id)
        self.assertEqual(comment_response.data["parent"], None)
        self.assertTrue(comment_response.data["parent_deleted"])
        
    def test_post_comment_twice(self):
        self.client.force_authenticate(user=self.user)
        data = {"content": "TESTING!!!", "is_reply": True, "parent": self.post_id}
        response1 = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")
        response2 = self.client.post("/api/posts/", data=json.dumps(data), content_type="application/json")

        self.assertEqual(response1.status_code, 201)
        self.assertEqual(response2.status_code, 403)

    def test_user_double_liked(self):
        self.client.force_authenticate(user=self.user)

        self.client.patch(f"/api/posts/{self.post_id}/like/", data=json.dumps({}), content_type="application/json")
        response1 = self.client.get(f"/api/posts/{self.post_id}/")
        self.client.patch(f"/api/posts/{self.post_id}/like/", data=json.dumps({}), content_type="application/json")
        response2 = self.client.get(f"/api/posts/{self.post_id}/")

        self.assertTrue(response1.data["user_liked"] != response2.data["user_liked"])
        self.assertTrue(self.user.id in response1.data["who_liked"])
        self.assertTrue(self.user.id not in response2.data["who_liked"])

    def test_user_blocked_list(self):
        self.client.force_authenticate(user=self.user)

        self.user.blocking.set([self.user2.id])

        response = self.client.get("/api/posts/?page=1")
        self.assertTrue(self.user2.id not in user for user in response.data["results"])

    def test_blocked_users_posts_do_not_return(self):
        self.client.force_authenticate(user=self.user)

        self.user.blocking.set([self.user2.id])
        response = self.client.get("/api/posts/?page=1")

        self.assertTrue(post["creator"] != self.user2.id for post in response.data["results"])

    def test_blocked_users_post_returns_error(self):
        self.user.blocking.set([self.user2.id])

        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f"/api/posts/{self.post_id}/")

        self.assertTrue(response.status_code == 403)
