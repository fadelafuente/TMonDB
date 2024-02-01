from rest_framework.test import APITestCase

from posts.models import Post
from django.contrib.auth import get_user_model
from django.utils import timezone, dateparse
from django.contrib.auth.models import AnonymousUser
import json

AppUser = get_user_model()

class TestPosts(APITestCase):
    def setUp(self):
        self.user = AppUser.objects.create_user(email="testemail@domain.com", password="testpassword", username="testuser")

        for index in range(1, 3):
            Post.objects.create(content=f"test post {index}", posted_date=timezone.now(), creator=self.user)

        user = AppUser.objects.create_user(email="testemail2@domain.com", password="testpassword", username="testuser2")

        for index in range(1, 3):
            Post.objects.create(content=f"test post {index}", posted_date=timezone.now(), creator=user)
        
        self.post_id = Post.objects.all()[1].id

    def test_create_post_anonymous(self):
        data = {"content": "TESTING!!!"}
        response = self.client.post("/api/posts/", data=data)
        self.assertEqual(response.status_code, 401)

    def test_get_posts(self):
        self.user = AnonymousUser()
        response = self.client.get("/api/posts/?page=1")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.user.is_authenticated)

    def test_get_post_by_id(self):
        self.user = AnonymousUser()
        response = self.client.get(f"/api/posts/{self.post_id}/")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.user.is_authenticated)

    def test_get_posts_by_username_user_found(self):
        self.user = AnonymousUser()

        username = "testuser"
        response = self.client.get(f"/api/posts/?username={username}")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["results"])

    def test_get_posts_by_username_user_not_found(self):
        self.user = AnonymousUser()

        username = "anonymoususer"
        response = self.client.get(f"/api/posts/?username={username}")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["results"])

    def test_create_post_user(self):
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