from django.db import models


class Template(models.Model):
    subject = models.CharField(max_length=155, null=True, blank=True)
    text = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'mail_template'
        
    def __str__(self):
        if self.subject:
            return self.subject
        return super().__str__()
