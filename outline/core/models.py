import numpy
from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.core.validators import MaxValueValidator, MinValueValidator
from django_enumfield import enum
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
import random
import string


class ImageBaseModel(models.Model):
    image = CloudinaryField(null=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    avatar = CloudinaryField(null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=11, unique=True, null=True, blank=True)

    def __str__(self):
        return self.username


class BaseModel(models.Model):
    updated_date = models.DateTimeField(auto_now=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    active = models.BooleanField(default=True, null=True)

    class Meta:
        abstract = True
        ordering = ['-id']

    def __str__(self):
        if self.name:
            return self.name


class Faculty(BaseModel, ImageBaseModel):
    name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, null=True)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "faculties"


class Instructor(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, default=1,
                                limit_choices_to={"is_staff": True, "is_active": True})
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, null=True)
    is_dean = models.BooleanField(default=False, null=True)
    work_room = models.IntegerField(null=True)
    degree = models.CharField(max_length=5, null=True)

    def __str__(self):
        if self.user.first_name and self.user.last_name:
            return f'{self.degree} {self.user.last_name} {self.user.first_name}'
        return f'{self.degree} {self.user.username}'

    class Meta:
        verbose_name = "instructor"
        verbose_name_plural = "instructors"


class Major(BaseModel, ImageBaseModel):
    name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, null=True)
    description = models.TextField()
    credits_required = models.IntegerField(validators=[MinValueValidator(120)])
    duration_year = models.IntegerField(validators=[MaxValueValidator(8)])
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='majors')


class CreditHour(models.Model):
    theory = models.IntegerField()
    practice = models.IntegerField()
    self_learning = models.IntegerField()

    def total(self):
        return self.theory + self.practice

    def __str__(self):
        return f'{self.theory} LT - {self.practice} TH'

    class Meta:
        unique_together = ['theory', 'practice']


class SubjectType(enum.Enum):
    GENERAL = 1
    FOUNDATION = 2
    ADDITIONAL = 3
    DISCIPLINE = 4
    MAJOR = 5
    GRADUATION_THESIS = 6


class Course(BaseModel, ImageBaseModel):
    code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50, null=True)
    description = models.TextField(null=True, blank=True)
    credit_hour = models.ForeignKey(CreditHour, on_delete=models.CASCADE)
    type = enum.EnumField(SubjectType, default=SubjectType.GENERAL)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='subjects')

    def generate_unique_code(self):
        initials = ''.join(word[0] for word in self.faculty.name.split())
        course_number = ''.join(random.choices(string.digits, k=4))
        code = f"{initials.upper()}{course_number}"

        return code

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_unique_code()
        super().save(*args, **kwargs)


class SchoolYear(models.Model):
    year = models.IntegerField(null=True, unique=True)

    def __str__(self):
        return f"{self.year}"


class SubjectOutline(BaseModel):
    title = models.CharField(max_length=50, null=True)
    years = models.ManyToManyField(SchoolYear, related_name='subject_outlines')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='subject_outlines', null=True)
    instructor = models.OneToOneField(Instructor, on_delete=models.CASCADE, null=True,
                                      related_query_name='subject_outline')
    rule = models.TextField(null=True)

    def __str__(self):
        if self.title:
            return self.title
        return super().__str__()

    class Meta:
        ordering = ['-id']


class Requirement(models.Model):
    outline = models.OneToOneField(SubjectOutline, on_delete=models.CASCADE, unique=True)
    prerequisites = models.ManyToManyField(Course, related_name="prerequisites", null=True, blank=True)
    preceding_courses = models.ManyToManyField(Course, related_name="preceding_courses", null=True, blank=True)
    co_courses = models.ManyToManyField(Course, related_name="co_courses", null=True, blank=True)

    def __str__(self):
        return f'Môn học điều kiện - {self.outline.id}'


class Objective(models.Model):
    outline = models.ForeignKey(SubjectOutline, on_delete=models.CASCADE, related_name='objectives')
    code = models.CharField(max_length=5, null=True)
    description = models.TextField(null=True)
    outcome = models.TextField()

    def __str__(self):
        return f'{self.code} - {self.outline.title}'


class LearningOutcome(models.Model):
    objective = models.ForeignKey(Objective, on_delete=models.CASCADE, related_name='learning_outcomes')
    code = models.CharField(max_length=7, null=True)
    description = models.TextField(null=True)

    def __str__(self):
        return f'{self.code} - {self.objective.outline.title}'


class EvaluationType(enum.Enum):
    FORMATIVE = 1,
    MID = 2
    END = 3


class Evaluation(models.Model):
    outline = models.ForeignKey(SubjectOutline, on_delete=models.CASCADE, related_name='evaluations')
    type = enum.EnumField(EvaluationType, default=EvaluationType.FORMATIVE, null=True, blank=True)
    method = models.CharField(max_length=50)
    time = models.DateField(null=True, blank=True)
    learning_outcomes = models.ManyToManyField(LearningOutcome, related_name="evaluations", null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)

    def __str__(self):
        if self.method and self.weight:
            return f'{self.method} - {self.weight * 100}%'
        return super().__str__()


class MaterialType(enum.Enum):
    TEXTBOOK = 1
    MATERIAL = 2
    SOFTWARE = 3


class Material(models.Model):
    no = models.PositiveIntegerField(null=True)
    outline = models.ForeignKey(SubjectOutline, related_name="materials", on_delete=models.CASCADE)
    content = models.TextField(null=True, blank=True)
    type = enum.EnumField(MaterialType, default=MaterialType.TEXTBOOK, null=True)

    def __str__(self):
        return f'[{self.no}] {self.content}'


class ScheduleWeek(models.Model):
    outline = models.ForeignKey(SubjectOutline, related_name="schedule_weeks", on_delete=models.CASCADE)
    week = models.IntegerField()
    content = models.TextField()
    outcomes = models.ManyToManyField(LearningOutcome, related_name="schedule_weeks", null=True, blank=True)
    evaluations = models.ManyToManyField(Evaluation, related_name="schedule_weeks", null=True, blank=True)
    materials = models.ManyToManyField(Material, related_name="schedule_weeks", null=True, blank=True)

    def __str__(self):
        return f'Tuần {self.week} - {self.outline}'


class Interaction(BaseModel):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    outline = models.ForeignKey(SubjectOutline, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        abstract = True
        ordering = ('-created_date',)


class Comment(Interaction):
    content = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.username} đã bình luận {self.outline.title}'


class Like(Interaction):
    class Meta:
        unique_together = ('outline', 'user')

    def __str__(self):
        return f'{self.user.username} đã thích {self.outline.title}'
