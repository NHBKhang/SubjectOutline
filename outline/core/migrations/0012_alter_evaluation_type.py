# Generated by Django 5.0.3 on 2024-05-05 10:42

import core.models
import django_enumfield.db.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_evaluation_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evaluation',
            name='type',
            field=django_enumfield.db.fields.EnumField(blank=True, default=core.models.EvaluationType, enum=core.models.EvaluationType, null=True),
        ),
    ]
