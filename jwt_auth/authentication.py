import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
User = get_user_model()


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        if not request.headers:
            print('NO HEADERS PRESENT')
            return None

        headers = request.headers.get('Authorization')
        if not headers:
            return None

        if not headers.startswith('Bearer '):
            print('invalid token format!')
            raise PermissionDenied('invalid token')

        token = headers.replace('Bearer ', '')
        print('Token ==>', token)

        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=['HS256'])

            user = User.objects.get(pk=payload['sub'])
            print(user)
        except User.DoesNotExist as e:
            raise PermissionDenied('user not found')
        except Exception as e:
            print(e)
            raise PermissionDenied(str(e))

        return (user, token)
