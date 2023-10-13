# Generated by Django 4.2.5 on 2023-10-12 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('type_api', '0003_rename_attacking_type_id_typeadvantage_attacking_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='typeadvantage',
            name='attacking_type',
        ),
        migrations.RemoveField(
            model_name='typeadvantage',
            name='defending_type',
        ),
        migrations.AddField(
            model_name='typeadvantage',
            name='attacking_type',
            field=models.ManyToManyField(related_name='attacking_advantage', to='type_api.type'),
        ),
        migrations.AddField(
            model_name='typeadvantage',
            name='defending_type',
            field=models.ManyToManyField(related_name='defending_advantage', to='type_api.type'),
        ),
    ]