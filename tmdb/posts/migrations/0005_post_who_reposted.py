# Generated by Django 4.2.5 on 2024-02-24 00:49

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0004_alter_post_creator'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='who_reposted',
            field=models.ManyToManyField(related_name='reposts', to=settings.AUTH_USER_MODEL),
        ),
    ]
