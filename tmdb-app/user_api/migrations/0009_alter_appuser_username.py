# Generated by Django 4.2.5 on 2023-11-08 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0008_alter_appuser_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='username',
            field=models.CharField(default='', max_length=50),
        ),
    ]
