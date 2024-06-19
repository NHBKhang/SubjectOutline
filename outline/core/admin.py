from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import path
from django.template.response import TemplateResponse
from django.core.exceptions import ValidationError
from oauth2_provider.models import *
from core import dao, serializers
from core.models import *
from core.forms import FacultyForm, MajorForm, CourseForm, LearningOutcomeForm, EvaluationForm, SubjectOutlineForm
from temp import dao as temp_dao, serializers as temp_serializers
import cloudinary


class MyAdminSite(admin.AdminSite):
    site_header = 'Subject Outline Administration'
    site_title = 'Subject Outline'
    index_title = 'Welcome to Subject Outline Admin'

    def get_urls(self):
        return [
            path('stats/', self.stats_view, name="stats"),
            path('approval/', self.approval_view, name="approval")
        ] + super().get_urls()

    def stats_view(self, request):
        stats = dao.count_stats()
        return TemplateResponse(request, 'admin/stats.html', {
            'stats': stats,
            'title': 'Statistics Overview'
        })

    def approval_view(self, request):
        users = dao.get_inactive_user()
        requests = temp_dao.get_user_requests()

        return TemplateResponse(request, 'admin/user-approval.html', {
            'instructor': serializers.UserSerializer(users, many=True).data,
            'student': temp_serializers.UserRequestSerializer(requests, many=True).data,
            'title': 'User Approval'
        })


admin_site = MyAdminSite(name='Subject Outline Administration')


class FacultyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'image', 'en_name', ]
    search_fields = ['id', 'name']
    readonly_fields = ['my_image', 'created_date', 'updated_date']
    form = FacultyForm

    def my_image(self, faculty):
        if faculty.image:
            if type(faculty.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{faculty.image.url}' />")
            return mark_safe(f"<img width='300' src='/static/{faculty.image.name}' />")


class MajorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'image', 'en_name', 'credits_required', 'duration_year', 'faculty']
    search_fields = ['id', 'name', 'faculty']
    list_filter = ['faculty']
    readonly_fields = ['my_image', 'created_date', 'updated_date']
    form = MajorForm

    def my_image(self, major):
        if major.image:
            if type(major.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{major.image.url}' />")
            return mark_safe(f"<img width='300' src='/static/{major.image.name}' />")


class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'en_name', 'credit_hour', 'type', 'faculty']
    search_fields = ['id', 'name', 'faculty']
    list_filter = ['faculty', 'type', 'credit_hour']
    readonly_fields = ['my_image', 'created_date', 'updated_date']
    form = CourseForm

    def my_image(self, subject):
        if subject.image:
            if type(subject.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{subject.image.url}' />")
            return mark_safe(f"<img width='300' src='/static/{subject.image.name}' />")


class MaterialInline(admin.TabularInline):
    model = Material


class RequirementInline(admin.TabularInline):
    model = Requirement


class LearningOutcomeInline(admin.TabularInline):
    model = LearningOutcome
    form = LearningOutcomeForm


class ObjectiveInline(admin.TabularInline):
    model = Objective
    extra = 3
    max_num = 3


class ObjectiveAdmin(admin.ModelAdmin):
    inlines = [LearningOutcomeInline]


class EvaluationInline(admin.TabularInline):
    model = Evaluation
    extra = 2
    max_num = 5
    min_num = 2
    form = EvaluationForm


class ScheduleInline(admin.TabularInline):
    model = ScheduleWeek


class SubjectOutlineAdmin(admin.ModelAdmin):
    form = SubjectOutlineForm
    inlines = [RequirementInline, ObjectiveInline, MaterialInline, EvaluationInline,
               ScheduleInline]

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


admin_site.register(User)
admin_site.register(Instructor)
admin_site.register(Faculty, FacultyAdmin)
admin_site.register(Major, MajorAdmin)
admin_site.register(CreditHour)
admin_site.register(Course, CourseAdmin)
admin_site.register(SubjectOutline, SubjectOutlineAdmin)
admin_site.register(Comment)
admin_site.register(Like)
admin_site.register(Objective, ObjectiveAdmin)
admin_site.register(SchoolYear)
admin_site.register(Application)
admin_site.register(AccessToken)
admin_site.register(RefreshToken)
admin_site.register(Grant)
admin_site.register(IDToken)
