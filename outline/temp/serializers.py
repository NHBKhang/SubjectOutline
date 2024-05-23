from rest_framework import serializers
from temp.models import *


class UserRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRequest
        fields = '__all__'
