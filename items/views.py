from .models import Item
from .serializers.common import ItemSerializer

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class ItemListView(APIView):
    def get(self, _request):
        items = Item.objects.all()
        print('items =>', items)
        serialized_items = ItemSerializer(items, many=True)
        return Response(serialized_items.data, status.HTTP_200_OK)
