from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.exceptions import PermissionDenied, NotFound
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from django.conf import settings

from .serializers.common import UserSerializer
from .models import User
from .serializers.common import UserSerializer

from datetime import datetime, timedelta
import jwt

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        try:
            user_to_register = UserSerializer(data=request.data)
            print(user_to_register)
            if user_to_register.is_valid():
                user_to_register.save()
                return Response('registration success', status=status.HTTP_201_CREATED)
            return Response(user_to_register.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):

    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        try:
            user_to_login = User.objects.get(email=email)
            print(user_to_login)
        except User.DoesNotExist as e:
            print(e)
            raise PermissionDenied('Invalid Credentials')

        if not user_to_login.check_password(password):
            print('password incorrect!')
            raise PermissionDenied('Invalid Credentials')

        dt = datetime.now() + timedelta(days=7)
        dt_as_seconds = int(dt.strftime('%s'))
        token = jwt.encode(
            {'sub': user_to_login.id, 'exp': dt_as_seconds},
            settings.SECRET_KEY,
            'HS256'
        )
        print(token)
        return Response({
            'token': token,
            'message': f'welcome back, {user_to_login.username}'
        }, status.HTTP_202_ACCEPTED)


class UserListView(APIView):

    def get(self, request):
        users = User.objects.all()
        serialized_users = UserSerializer(users, many=True)
        return Response(serialized_users.data)


class UserDetailView(APIView):

    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist as e:
            print(e)
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, _request, pk):
        user = self.get_user(pk)
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data)

    def put(self, request, pk):
        user = self.get_user(pk)
        try:
            user_to_update = UserSerializer(user, request.data, partial=True)
            if user_to_update.is_valid():
                user_to_update.save()
                return Response(user_to_update.data, status.HTTP_202_ACCEPTED)
            print(user_to_update.errors)
            return Response(user_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
