from django.db import models


class Template(models.Model):
    name = models.CharField(max_length=100, unique=True, default='')
    subject = models.CharField(max_length=255, null=True, blank=True)
    html_content = models.TextField(null=True, blank=True)
    text_content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mail_template'
        
    def __str__(self):
        if self.name:
            return self.name
        return super().__str__()
