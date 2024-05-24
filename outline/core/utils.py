import secrets
import string


def generate_random_password(length=16):
    characters = string.ascii_letters + string.digits + '@#$&%'
    password = ''.join(secrets.choice(characters) for i in range(length))

    return password
