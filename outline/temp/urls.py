from django.urls import path, include
from rest_framework import routers
from temp import views

r = routers.SimpleRouter()
r.register('user-requests', views.UserRequestViewSet, basename='user-requests')
# r.register('recovery-requests', views.RecoveryRequestViewSet, basename='recovery-requests')

urlpatterns = [
    path('', include(r.urls)),
]
