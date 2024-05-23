from rest_framework import serializers
from core.models import *
from core import unknown_avatar


class ImageSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep


class FacultySerializer(ImageSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'


class MajorSerializer(ImageSerializer):
    class Meta:
        model = Major
        fields = '__all__'


class CreditHourSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()

    def get_total(self, credit):
        return credit.total()

    class Meta:
        model = CreditHour
        fields = ['id', 'theory', 'practice', 'self_learning', 'total']


class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'code']


class CourseSerializer(ImageSerializer, SimpleCourseSerializer):
    class Meta:
        model = SimpleCourseSerializer.Meta.model
        fields = SimpleCourseSerializer.Meta.fields + ['en_name', 'image', 'type', 'credit_hour', 'description']


class CourseDetailsSerializer(CourseSerializer):
    credit_hour = serializers.SerializerMethodField()
    faculty = serializers.SerializerMethodField()

    def get_credit_hour(self, subject):
        return CreditHourSerializer(subject.credit_hour).data

    def get_faculty(self, subject):
        return FacultySerializer(subject.faculty).data

    class Meta:
        model = CourseSerializer.Meta.model
        fields = CourseSerializer.Meta.fields + ['faculty']


class MaterialSerializer(serializers.ModelSerializer):
    textbooks = serializers.SerializerMethodField()
    materials = serializers.SerializerMethodField()
    software = serializers.SerializerMethodField()

    def get_textbooks(self, material):
        return [{
            "id": m.id,
            "content": m.__str__()
        } for m in Material.objects.filter(type=1)]

    def get_materials(self, material):
        return [{
            "id": m.id,
            "content": m.__str__()
        } for m in Material.objects.filter(type=2).distinct()]

    def get_software(self, material):
        return [{
            "id": m.id,
            "content": m.__str__()
        } for m in Material.objects.filter(type=3)]

    class Meta:
        model = Material
        fields = ['textbooks', 'materials', 'software']


class RequirementSerializer(serializers.ModelSerializer):
    prerequisites = SimpleCourseSerializer(many=True)
    preceding_courses = SimpleCourseSerializer(many=True)
    co_courses = SimpleCourseSerializer(many=True)

    class Meta:
        model = Requirement
        fields = '__all__'


class LearningOutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningOutcome
        fields = '__all__'


class ObjectiveSerializer(serializers.ModelSerializer):
    learning_outcomes = LearningOutcomeSerializer(many=True)

    class Meta:
        model = Objective
        fields = '__all__'


class EvaluationSerializer(serializers.ModelSerializer):
    weight = serializers.SerializerMethodField()
    learning_outcomes = serializers.SerializerMethodField()

    def get_weight(self, obj):
        if obj.weight:
            return f'{int(obj.weight * 100)}%'
        return None

    def get_learning_outcomes(self, obj):
        if obj.learning_outcomes:
            list = ''
            outcomes = LearningOutcome.objects.filter(evaluations=obj)
            for o in outcomes:
                list += f'{o.code}, '
            return list.rstrip(", ")
        return None

    class Meta:
        model = Evaluation
        fields = ['id', 'type', 'method', 'time', 'learning_outcomes', 'weight']


class ScheduleWeekSerializer(serializers.ModelSerializer):
    outcomes = serializers.SerializerMethodField()
    evaluations = serializers.SerializerMethodField()
    materials = serializers.SerializerMethodField()

    def get_outcomes(self, obj):
        if obj.outcomes:
            list = ''
            outcomes = LearningOutcome.objects.filter(schedule_weeks=obj)
            for o in outcomes:
                list += f'{o.code}, '
            return list.rstrip(", ")
        return None

    def get_evaluations(self, obj):
        if obj.evaluations:
            list = ''
            evaluations = Evaluation.objects.filter(schedule_weeks=obj)
            for o in evaluations:
                list += f'{o.method}, '
            return list.rstrip(", ")
        return None

    def get_materials(self, obj):
        if obj.materials:
            list = ''
            materials = Material.objects.filter(schedule_weeks=obj)
            for o in materials:
                list += f'[{o.no}]\n'
            return list.rstrip("\n")
        return None

    class Meta:
        model = ScheduleWeek
        fields = '__all__'


class InstructorSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    faculty = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    def get_name(self, instructor):
        if instructor.user.first_name:
            if instructor.user.last_name:
                return f'{instructor.degree} {instructor.user.last_name} {instructor.user.first_name}'
            else:
                return f'{instructor.degree} {instructor.user.first_name}'
        else:
            return f'{instructor.degree} {instructor.user.username}'

    def get_faculty(self, instructor):
        return instructor.faculty.name

    def get_email(self, instructor):
        return instructor.user.email

    def get_avatar(self, instructor):
        if instructor.user and instructor.user.avatar:
            return instructor.user.avatar.url

        return unknown_avatar

    class Meta:
        model = Instructor
        fields = ['user', 'name', 'is_dean', 'email', 'work_room', 'faculty', 'avatar']


class SubjectOutlineSerializer(serializers.ModelSerializer):
    course = CourseDetailsSerializer()
    instructor = InstructorSerializer()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    materials = serializers.SerializerMethodField()
    requirement = RequirementSerializer()
    objectives = ObjectiveSerializer(many=True)
    evaluations = EvaluationSerializer(many=True)
    schedule_weeks = ScheduleWeekSerializer(many=True)

    def get_like_count(self, outline):
        return Like.objects.filter(outline=outline).filter(active=True).count()

    def get_comment_count(self, outline):
        return Comment.objects.filter(outline=outline).filter(active=True).count()

    def get_materials(self, outline):
        return MaterialSerializer(outline.materials.first(), many=False).data

    class Meta:
        model = SubjectOutline
        fields = ['id', 'title', 'course', 'year', 'instructor', 'created_date', 'rule', 'like_count', 'comment_count',
                  'materials', 'requirement', 'objectives', 'evaluations', 'schedule_weeks']


class AuthenticatedSubjectOutlineSerializer(SubjectOutlineSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, outline):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return outline.like_set.filter(user=request.user, active=True).exists()

    class Meta:
        model = SubjectOutlineSerializer.Meta.model
        fields = SubjectOutlineSerializer.Meta.fields + ['liked']


class ModifySubjectOutlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectOutline
        fields = ['id', 'title', 'year', 'course', 'rule']


class PublicUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    instructor = serializers.SerializerMethodField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url if instance.avatar else unknown_avatar

        return rep

    def get_name(self, user):
        if user.first_name:
            if user.last_name:
                return f'{user.last_name} {user.first_name}'
            else:
                return user.first_name
        else:
            return user.username

    def get_instructor(self, user):
        instructor = Instructor.objects.filter(user=user).first()
        if instructor:
            return InstructorSerializer(instructor).data

        return None

    class Meta:
        model = User
        fields = ['id', 'name', 'avatar', 'instructor', 'is_active']


class UserSerializer(PublicUserSerializer):
    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = PublicUserSerializer.Meta.model
        fields = (PublicUserSerializer.Meta.fields +
                  ['first_name', 'last_name', 'username', 'email', 'password', 'phone', 'birthday', 'is_staff',
                   'last_login'])
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class CommentSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'outline', 'content', 'created_date', 'updated_date']
