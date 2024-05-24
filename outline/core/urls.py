from django.urls import path, include
from rest_framework import routers
from core import views

r = routers.DefaultRouter()
r.register('faculties', views.FacultyViewSet, basename='faculties')
r.register('majors', views.MajorViewSet, basename='majors')
r.register('courses', views.CourseViewSet, basename='courses')
r.register('subject-outlines', views.SubjectOutlineViewSet, basename='subject-outlines')
r.register('instructors', views.InstructorViewSet, basename='instructors')
r.register('users', views.UserViewSet, basename='users')
r.register('inactive-users', views.InactiveUserViewSet, basename='inactive-users')
r.register('credit-hours', views.CreditHourViewSet, basename='credit-hours')
r.register('comments', views.CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(r.urls)),
    path('user-check/', views.UserCheckView.as_view(), name='user-check'),
]
