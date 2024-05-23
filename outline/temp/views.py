from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from temp import serializers, db_name
from temp.models import *
from core import dao as core_dao, serializers as core_serializers
from core.models import User


class UserRequestViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = UserRequest.objects.using(db_name).all()
    serializer_class = serializers.UserRequestSerializer

    @action(detail=True, methods=['post'], url_path='add-user')
    def add_user(self, request, pk=None):
        try:
            instance = self.get_object()

            # user, password = core_dao.create_student_user(instance.username, instance.email, instance.last_name,
            #                                               instance.first_name)

            return Response({},
                            status=status.HTTP_201_CREATED)
        except UserRequest.DoesNotExist or User.DoesNotExist:
            return Response({'error': 'Model does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
