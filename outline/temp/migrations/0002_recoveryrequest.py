# Generated by Django 4.1.13 on 2024-06-14 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('temp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecoveryRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'temp_recovery_request',
            },
        ),
    ]
