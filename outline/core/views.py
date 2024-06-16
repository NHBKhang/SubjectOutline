from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from core import serializers, paginators, perms
from core.models import *
from django.db.models import Q, F
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = serializers.CourseDetailsSerializer
    pagination_class = paginators.CoursePaginator

    def get_queryset(self):
        credit = self.request.query_params.get("credit")
        if credit and int(credit) != 0:
            return (self.queryset.annotate(total=F('credit_hour__theory') + F('credit_hour__practice'))
                    .filter(total=credit))

        return self.queryset


class SubjectOutlineViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = SubjectOutline.objects.filter(active=True).all()
    pagination_class = paginators.SubjectOutlinePaginator

    def get_queryset(self):
        queries = self.queryset

        course_id = self.request.query_params.get("course_id")
        q = self.request.query_params.get("q")
        years = self.request.query_params.get("years")
        instructor_id = self.request.query_params.get("instructor_id")
        if course_id:
            queries = queries.filter(course_id=course_id)
        if q:
            queries = queries.filter(Q(title__icontains=q) |
                                     Q(instructor__user__last_name__icontains=q) |
                                     Q(instructor__user__first_name__icontains=q) |
                                     Q(year__icontains=q))
        if years and int(years) != 0:
            queries = queries.filter(years_id=years)
        if instructor_id:
            queries = queries.filter(instructor__user_id=instructor_id)

        return queries.distinct()

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.action in ['partial_update', 'update', 'create'] or self.request.query_params.get('raw'):
                return serializers.ModifySubjectOutlineSerializer
            else:
                return serializers.AuthenticatedSubjectOutlineSerializer

        return serializers.SubjectOutlineSerializer

    def get_permissions(self):
        if self.action in ['add_comment', 'like', 'create', 'update']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().comment_set.select_related('user').all()

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentSerializer(comments, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='comment', detail=True)
    def add_comment(self, request, pk):
        c = self.get_object().comment_set.create(user=request.user, content=request.data.get('content'))

        return Response(serializers.CommentSerializer(c).data,
                        status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = Like.objects.get_or_create(outline=self.get_object(), user=request.user)

        li.active = not li.active
        if not created:
            li.save()

        return Response(serializers.AuthenticatedSubjectOutlineSerializer(self.get_object()).data)


class InstructorViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = Instructor.objects.all()
    serializer_class = serializers.InstructorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            'faculty': instance.faculty.id,
            'work_room': instance.work_room,
            'degree': instance.degree
        }, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]
    permission_classes = [permissions.IsAuthenticated()]

    def get_queryset(self):
        queries = self.queryset
        if self.request.user.is_authenticated:
            queries = queries.exclude(id=self.request.user.id)

        q = self.request.query_params.get('q')
        if q:
            queries = queries.filter(Q(first_name__icontains=q) |
                                     Q(last_name__icontains=q) |
                                     Q(username__icontains=q) |
                                     Q(email__icontains=q))

        return queries

    def get_permissions(self):
        if self.action in ['get_current_user', 'list']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(is_active=True)
        serializer = serializers.PublicUserSerializer(queryset, many=True)

        return Response(serializer.data)

    def retrieve(self, request, pk=None, username=None):
        if pk:
            queryset = self.get_queryset()
            user = get_object_or_404(queryset, pk=pk)
        elif username:
            queryset = self.get_queryset()
            user = get_object_or_404(queryset, username=username)
        else:
            return Response({"detail": "Not found."}, status=404)
        serializer = self.get_serializer(user)

        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-username/(?P<username>[^/.]+)')
    def retrieve_by_username(self, request, username=None):
        return self.retrieve(request, username=username)


class InactiveUserViewSet(viewsets.ViewSet, generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(is_active=False)
    serializer_class = serializers.PublicUserSerializer
    parser_classes = [parsers.MultiPartParser, ]


class CreditHourViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = CreditHour.objects.all()
    serializer_class = serializers.CreditHourSerializer


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView, generics.ListCreateAPIView):
    queryset = Comment.objects.filter(active=True).all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommentOwner]


@method_decorator(csrf_exempt, name='dispatch')
class UserCheckView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            username = data.get('username')

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'exists': True, 'message': 'Username already exists'}, status=200)
            else:
                return JsonResponse({'exists': False}, status=200)

        except json.JSONDecodeError or User.DoesNotExist:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)


class FacultyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Faculty.objects.all()
    serializer_class = serializers.FacultySerializer


class MajorViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Major.objects.all()
    serializer_class = serializers.MajorSerializer


class SchoolYearViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = SchoolYear.objects.all()
    serializer_class = serializers.SchoolYearSerializer


class RequirementViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Requirement.objects.all()
    serializer_class = serializers.RequirementSerializer
    permission_classes = [permissions.IsAuthenticated]


class ObjectiveViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Objective.objects.all()
    serializer_class = serializers.ObjectiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        outline_id = self.request.query_params.get('outlineId', None)
        if outline_id:
            queryset = self.queryset.filter(outline_id=outline_id)

        return queryset


class LearningOutcomeViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningOutcome.objects.all()
    serializer_class = serializers.LearningOutcomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        outline_id = self.request.query_params.get('outlineId')
        if outline_id:
            queryset = self.queryset.filter(objective__outline_id=outline_id).distinct()

        return queryset

    def get_serializer_class(self):
        if self.action in ['list', ]:
            return serializers.LearningOutcomeListSerializer

        return self.serializer_class


class MaterialViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = serializers.MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        outline_id = self.request.query_params.get('outlineId', None)
        if outline_id:
            queryset = self.queryset.filter(outline_id=outline_id)

        return queryset


class EvaluationViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = serializers.EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        outline_id = self.request.query_params.get('outlineId', None)
        if outline_id:
            queryset = self.queryset.filter(outline_id=outline_id)

        return queryset


class ScheduleWeekViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = ScheduleWeek.objects.all()
    serializer_class = serializers.ScheduleWeekSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        outline_id = self.request.query_params.get('outlineId', None)
        if outline_id:
            queryset = self.queryset.filter(outline_id=outline_id)

        return queryset
