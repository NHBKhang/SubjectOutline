from dotenv import load_dotenv
from outline import settings
from django.template import Context, Template
from mail.models import Template as EmailTemplate
import os
import requests

load_dotenv()


def send_email(recipient_list, subject, text_content, html_content=None, from_email=None):
    return requests.post(
        f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
        auth=("api", os.getenv("MAILGUN_API_KEY")),
        data={"from": "Excited User <khang@gmail.com>" if from_email is None else from_email,
              "to": recipient_list,
              "subject": subject,
              "text": text_content,
              "html": html_content}
    )


def send_email_via_mailgun(template_name, recipient_list, context, from_email=None):
    try:
        template = EmailTemplate.objects.get(name=template_name)
    except EmailTemplate.DoesNotExist:
        raise ValueError(f"Email template '{template_name}' does not exist.")

    subject = Template(template.subject).render(Context(context))
    html_content = Template(template.html_content).render(Context(context))
    text_content = Template(template.text_content).render(Context(context)) if template.text_content else None

    send_email(recipient_list, subject, text_content, html_content, from_email)
