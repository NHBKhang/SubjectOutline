from temp.models import UserRequest
from temp import db_name


def get_user_requests():
    return UserRequest.objects.using(db_name).all()


def delete_user_request(id):
    try:
        user_request = UserRequest.objects.get(id=id)
        user_request.delete()
    except Exception as e:
        raise e
