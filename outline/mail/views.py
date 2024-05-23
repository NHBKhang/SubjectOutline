from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from outline import settings
from mail.utils import send_email


@method_decorator(csrf_exempt, name='dispatch')
class SendEmailView(View):
    def post(self, request, *args, **kwargs):
        to_email = "habaokhang.la@gmail.com"
        subject = "Hello from SendGrid"
        html_content = "<html><body><h1>This is a test email sent using SendGrid</h1></body></html>"

        response = send_email(to_email, subject, html_content)

        if response.status_code == 202:
            return JsonResponse({"message": "Email sent successfully"}, status=response.status_code)
        else:
            return JsonResponse({"message": "Failed to send email"}, status=response.status_code)
