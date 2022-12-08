from .models import Item
from .serializers.common import ItemSerializer
from .serializers.populated import PopulatedItemSerializer

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class ItemListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        items = Item.objects.all()
        # print('items =>', items)
        serialized_items = PopulatedItemSerializer(items, many=True)
        return Response(serialized_items.data, status.HTTP_200_OK)

    def post(self, request):
        print("REQUEST USER ->", request.user.id)
        request.data['owner'] = request.user.id
        try:
            print('posting new item ==>', request.data)
            item_to_add = ItemSerializer(data=request.data)
            if item_to_add.is_valid():
                print('item to add validated data ==>',
                      item_to_add.validated_data)
                item_to_add.save()
                return Response(item_to_add.data, status.HTTP_201_CREATED)
            return Response(item_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


class ItemDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_item(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist as e:
            print(e)
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, _request, pk):
        item = self.get_item(pk)
        serialized_item = PopulatedItemSerializer(item)
        return Response(serialized_item.data)

    def put(self, request, pk):
        item = self.get_item(pk)
        try:
            item_to_update = ItemSerializer(
                item, request.data, partial=True)
            print('updating item ==>', item_to_update)
            if item_to_update.is_valid():
                item_to_update.save()
                return Response(item_to_update.data, status.HTTP_202_ACCEPTED)
            print(item_to_update.errors)
            return Response(item_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
