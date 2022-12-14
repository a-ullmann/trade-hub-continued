from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from django.conf import settings

from .serializers.common import UserSerializer, PartialUserSerializer
from .models import User

from datetime import datetime, timedelta
import jwt

User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        try:
            user_to_register = UserSerializer(data=request.data)
            # print('user to register ==>', user_to_register)
            if user_to_register.is_valid():
                try:
                    user_to_register.save()
                    return Response('registration success', status=status.HTTP_201_CREATED)
                except ValidationError as e:
                    return Response('Invalid user input: 🚨 ' + str(e), status.HTTP_422_UNPROCESSABLE_ENTITY)
            print('ERRORRR 👻 ==>', user_to_register.errors)
            return Response(user_to_register.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response('Database error: 🚨 ' + str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        try:
            user_to_login = User.objects.get(username=username)
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

    def get(self, _request):
        users = User.objects.all()
        serialized_users = UserSerializer(users, many=True)
        return Response(serialized_users.data)


class UserDetailView(APIView):

    def get_user(self, pk):
        try:
            print(User)
            return User.objects.get(pk=pk)
        except User.DoesNotExist as e:
            print('USER DOES NOT EXIST', e)
            raise NotFound(str(e))
        except Exception as e:
            print('userdetailview', e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, _request, pk):
        user = self.get_user(pk)
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data)

    def put(self, request, pk):
        user = self.get_user(pk)
        try:
            user_to_update = PartialUserSerializer(
                user, request.data, partial=True)
            if user_to_update.is_valid():
                user_to_update.save()
                print('USER ===>', user_to_update.data)
                return Response(user_to_update.data, status.HTTP_202_ACCEPTED)
            print(user_to_update.errors)
            return Response(user_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print('put here', e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
