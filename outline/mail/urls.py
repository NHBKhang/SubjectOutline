from django.urls import path
from mail import views

urlpatterns = [
    path('send-email/', views.SendEmailView.as_view(), name='send_email'),
]
