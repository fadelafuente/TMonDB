# Generated by Django 4.2.5 on 2024-02-24 00:01

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0002_post_is_edited'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='who_liked',
            field=models.ManyToManyField(related_name='liked_posts', to=settings.AUTH_USER_MODEL),
        ),
    ]
