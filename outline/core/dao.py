from core.models import Course, User
from django.db.models import Count
from core.utils import generate_random_password


def count_stats():
    return Course.objects.annotate(counter=Count('subject_outlines')).values('id', 'name', 'counter')


def get_inactive_user():
    return User.objects.filter(is_active=False).filter(is_staff=True)


def create_student_user(username, email, last_name, first_name):
    password = generate_random_password()
    user = User.objects.create_user(username=username, email=email, last_name=last_name, first_name=first_name)

    return user, password
