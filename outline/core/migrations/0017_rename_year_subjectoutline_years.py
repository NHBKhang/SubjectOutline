# Generated by Django 4.1.13 on 2024-05-29 15:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_schoolyear_remove_subjectoutline_year_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subjectoutline',
            old_name='year',
            new_name='years',
        ),
    ]