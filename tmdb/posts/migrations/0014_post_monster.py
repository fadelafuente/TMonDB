# Generated by Django 4.2.5 on 2024-08-27 22:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('monsters', '0003_rename_date_joined_monster_date_created_and_more'),
        ('posts', '0013_alter_post_creator'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='monster',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='monsters.monster'),
        ),
    ]
