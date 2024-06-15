from core.admin import admin_site
from temp.models import *

admin_site.register(UserRequest)
admin_site.register(RecoveryRequest)
