from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Subcategory
from .serializers.common import SubcategorySerializer


class SubcategoryListView(APIView):

    def get(self, _request):
        subcategories = Subcategory.objects.all()
        serialized_subcategories = SubcategorySerializer(subcategories)
        return Response(serialized_subcategories.data)
