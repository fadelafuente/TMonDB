# Generated by Django 4.2.5 on 2024-09-04 19:13

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('typings', '0002_type_creator_alter_typeadvantage_multiplier'),
    ]

    operations = [
        migrations.AddField(
            model_name='type',
            name='date_created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
