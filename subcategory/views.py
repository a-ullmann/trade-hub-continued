from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Subcategory
from .serializers.common import SubcategorySerializer


class SubcategoryListView(APIView):

    def get(self, _request):
        subcategory = Subcategory.objects.all()
        serialized_subcategory = SubcategorySerializer(subcategory)
        return Response(serialized_subcategory.data)

    def post(self, request):
        try:
            print('posting new subcategory ==>', request.data)
            subcategory_to_add = SubcategorySerializer(data=request.data)
            if subcategory_to_add.is_valid():
                print('subcategory validated ==>',
                      subcategory_to_add.validated_data)
                subcategory_to_add.save()
                return Response(subcategory_to_add.data, status.HTTP_201_CREATED)
            return Response(subcategory_to_add.error_messages, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
