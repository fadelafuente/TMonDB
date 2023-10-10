# Generated by Django 4.2.5 on 2023-10-08 14:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('type_api', '0002_type_locked'),
        ('move_api', '0002_move_synergy_description_move_synergy_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='move',
            name='type',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='type', to='type_api.type'),
        ),
    ]