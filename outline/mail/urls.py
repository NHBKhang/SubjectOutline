from django.urls import path
from mail import views

urlpatterns = [
    path('send-account/', views.SendAccountRequestView.as_view(), name='send_email'),
]
