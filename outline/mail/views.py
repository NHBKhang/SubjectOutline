from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from outline import settings
from mail.utils import send_email_via_mailgun
from core import dao as core_dao
import json


@method_decorator(csrf_exempt, name='dispatch')
class SendInstructorAccountView(View):
    def post(self, request, *args, **kwargs):
        try:
            user = json.loads(request.body)

            context = {
                'username': user.get('name'),
            }
            send_email_via_mailgun('instructor-register', settings.MAILGUN_RECIPIENTS[0], context)
            return JsonResponse({'success': True}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({'error': e.__str__()}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class SendRecoveryPasswordRequestView(View):
    def post(self, request, *args, **kwargs):
        try:
            user = json.loads(request.body)
            print(user)
            context = {
                'username': user.get('user'),
            }
            send_email_via_mailgun('recovery', settings.MAILGUN_RECIPIENTS[0], context)
            return JsonResponse({'success': True}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({'error': e.__str__()}, status=400)

