# Generated by Django 4.2.5 on 2023-10-12 19:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('type_api', '0003_rename_attacking_type_id_typeadvantage_attacking_type_and_more'),
        ('move_api', '0003_move_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='move',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='type', to='type_api.type'),
        ),
    ]
