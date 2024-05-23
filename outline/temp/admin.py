from core import admin
from temp.models import UserRequest
from temp import db_name


class UserRequestAdmin(admin.admin.ModelAdmin):
    model = UserRequest

    def get_queryset(self, request):
        queryset = super(UserRequestAdmin, self).get_queryset(request).using(db_name)

        return queryset


admin.admin_site.register(UserRequest)
