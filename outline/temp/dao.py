from temp.models import UserRequest
from temp import db_name


def get_user_requests():
    return UserRequest.objects.using(db_name).all()
