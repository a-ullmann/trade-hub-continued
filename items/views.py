from .models import Item
from .serializers.common import ItemSerializer
from .serializers.populated import PopulatedItemSerializer


from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated


class ItemListView(APIView):
    # permission_classes = (IsAuthenticated, )

    def get(self, request):
        items = Item.objects.all()
        # print('items =>', items)
        serialized_items = PopulatedItemSerializer(items, many=True)
        print('request 🚨 ==>', request.data)
        return Response(serialized_items.data)

    def post(self, request):
        print("REQUEST USER 🚨 ==>", request.user.id, request.user.username)
        request.data['owner'] = request.user.id
        try:
            print('posting new item 🚨 ==>', request.data)
            item_to_add = ItemSerializer(data=request.data)
            if item_to_add.is_valid():
                print('item to add validated data 🚨 ==>',
                      item_to_add.validated_data)
                item_to_add.save()
                return Response(item_to_add.data, status.HTTP_201_CREATED)
            return Response(item_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


class ItemSearchView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_queryset(self):
        query = self.request.query_params.get('name')
        if query:
            return self.queryset.filter(name__contains=query)
        return self.queryset


class ItemDetailView(APIView):
    # permission_classes = (IsAuthenticated, )

    def get_item(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist as e:
            print('item detail view get_item does not exist 🚨 ==>', e)
            raise NotFound(str(e))
        except Exception as e:
            print('item detail view exception  🚨 ==>', e)
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
            print('updating item 🚨 ==>', item_to_update)
            if item_to_update.is_valid():
                item_to_update.save()
                return Response(item_to_update.data, status.HTTP_202_ACCEPTED)
            print('item to update errors 🚨 ==>', item_to_update.errors)
            return Response(item_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        item = self.get_item(pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
