from django.db import models


class UserRequest(models.Model):
    username = models.CharField(max_length=150, unique=True, null=False)
    email = models.EmailField(null=False)
    first_name = models.CharField(max_length=150, null=False)
    last_name = models.CharField(max_length=150, null=False)

    class Meta:
        db_table = 'temp_user_request'

    def __str__(self):
        return self.username


class RecoveryRequest(models.Model):
    username = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'temp_recovery_request'

    def __str__(self):
        return f'{email}'
