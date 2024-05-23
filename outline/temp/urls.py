from django.urls import path, include
from rest_framework import routers
from temp import views

r = routers.SimpleRouter()
r.register('user-requests', views.UserRequestViewSet, basename='user-requests')

urlpatterns = [
    path('', include(r.urls)),
]
