# Generated by Django 5.0.3 on 2024-05-04 12:10

import cloudinary.models
import core.models
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import django_enumfield.db.fields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('avatar', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True)),
                ('birthday', models.DateField(blank=True, null=True)),
                ('phone', models.CharField(blank=True, max_length=11, null=True, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Evaluation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method', models.CharField(max_length=50)),
                ('time', models.DateField(blank=True, null=True)),
                ('weight', models.FloatField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Faculty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('active', models.BooleanField(default=True, null=True)),
                ('name', models.CharField(max_length=50)),
                ('en_name', models.CharField(max_length=50, null=True)),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name_plural': 'faculties',
            },
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('textbook', models.TextField(blank=True, null=True)),
                ('material', models.TextField(blank=True, null=True)),
                ('software', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Objective',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=5, null=True)),
                ('description', models.TextField(null=True)),
                ('outcome', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Instructor',
            fields=[
                ('user', models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('is_dean', models.BooleanField(default=False, null=True)),
                ('work_room', models.IntegerField(null=True)),
                ('degree', models.CharField(max_length=5, null=True)),
                ('faculty', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.faculty')),
            ],
            options={
                'verbose_name': 'instructor',
                'verbose_name_plural': 'instructors',
            },
        ),
        migrations.CreateModel(
            name='CreditHour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theory', models.IntegerField()),
                ('practice', models.IntegerField()),
                ('self_learning', models.IntegerField()),
            ],
            options={
                'unique_together': {('theory', 'practice')},
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('active', models.BooleanField(default=True, null=True)),
                ('code', models.CharField(max_length=10, null=True, unique=True)),
                ('name', models.CharField(max_length=50)),
                ('en_name', models.CharField(max_length=50, null=True)),
                ('description', models.CharField(max_length=1000, null=True)),
                ('type', django_enumfield.db.fields.EnumField(default=1, enum=core.models.SubjectType)),
                ('credit_hour', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.credithour')),
                ('faculty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subjects', to='core.faculty')),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Major',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('active', models.BooleanField(default=True, null=True)),
                ('name', models.CharField(max_length=50)),
                ('en_name', models.CharField(max_length=50, null=True)),
                ('description', models.TextField()),
                ('credits_required', models.IntegerField(validators=[django.core.validators.MinValueValidator(120)])),
                ('duration_year', models.IntegerField(validators=[django.core.validators.MaxValueValidator(8)])),
                ('faculty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='majors', to='core.faculty')),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LearningOutcome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=7, null=True)),
                ('description', models.TextField(null=True)),
                ('evaluation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outcomes', to='core.evaluation')),
                ('objective', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outcomes', to='core.objective')),
            ],
        ),
        migrations.CreateModel(
            name='SubjectOutline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('active', models.BooleanField(default=True, null=True)),
                ('title', models.CharField(max_length=50, null=True)),
                ('year', models.IntegerField(null=True)),
                ('rule', models.TextField(null=True)),
                ('course', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subject_outlines', to='core.course')),
                ('instructor', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_query_name='subject_outline', to='core.instructor')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='ScheduleWeek',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('week', models.IntegerField()),
                ('content', models.TextField()),
                ('evaluation', models.ManyToManyField(related_name='schedule_weeks', to='core.evaluation')),
                ('material', models.ManyToManyField(related_name='schedule_weeks', to='core.material')),
                ('outcomes', models.ManyToManyField(related_name='schedule_weeks', to='core.learningoutcome')),
                ('outline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='schedule_weeks', to='core.subjectoutline')),
            ],
        ),
        migrations.CreateModel(
            name='Requirement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('co_courses', models.ManyToManyField(related_name='co_courses', to='core.course')),
                ('preceding_courses', models.ManyToManyField(related_name='preceding_courses', to='core.course')),
                ('prerequisites', models.ManyToManyField(related_name='prerequisites', to='core.course')),
                ('outline', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.subjectoutline')),
            ],
        ),
        migrations.AddField(
            model_name='objective',
            name='outline',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='objectives', to='core.subjectoutline'),
        ),
        migrations.AddField(
            model_name='material',
            name='outline',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='material', to='core.subjectoutline'),
        ),
        migrations.AddField(
            model_name='evaluation',
            name='outline',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluations', to='core.subjectoutline'),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('content', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('outline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.subjectoutline')),
            ],
            options={
                'ordering': ('-created_date',),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True, null=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('outline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.subjectoutline')),
            ],
            options={
                'unique_together': {('outline', 'user')},
            },
        ),
    ]