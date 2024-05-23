from dotenv import load_dotenv
import requests
from outline import settings
import os

load_dotenv()


def send_email(to_email, subject, html_content):
    return requests.post(
        f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
        auth=("api", os.getenv("MAILGUN_API_KEY")),
        data={"from": "Excited User <khang@gmail.com>",
              "to": ["nhbkhang12@gmail.com", to_email],
              "subject": subject,
              "text": html_content})
