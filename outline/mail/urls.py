from django.urls import path
from mail import views

urlpatterns = [
    path('instructor-account/', views.SendInstructorAccountView.as_view(), name='instructor-account'),
    path('recovery-password/', views.SendRecoveryPasswordRequestView.as_view(), name='recovery-password'),
]
