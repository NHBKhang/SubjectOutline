# Generated by Django 5.0.3 on 2024-05-04 14:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_material_outline'),
    ]

    operations = [
        migrations.AddField(
            model_name='learningoutcome',
            name='no',
            field=models.PositiveIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='learningoutcome',
            name='objective',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='learning_outcomes', to='core.objective'),
        ),
    ]