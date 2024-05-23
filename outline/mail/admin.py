from django.contrib import admin
from core.admin import admin_site
from mail.models import *


class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject',)
    search_fields = ('name', 'subject')
    readonly_fields = ('created_at', 'updated_at')


admin_site.register(Template, TemplateAdmin)
