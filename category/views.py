from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from django import forms

from .models import Category
from .serializers.common import CategorySerializer
# from .serializers.populated import Pop


class CategoryListView(APIView):
    def get(self, _request):
        category = Category.objects.all()
        serialized_category = CategorySerializer(category, many=True)
        return Response(serialized_category.data)

    def post(self, request):
        try:
            print('posting new category ==>', request.data)
            category_to_add = CategorySerializer(data=request.data)
            if category_to_add.is_valid():
                print('category validated ==>', category_to_add.validated_data)
                category_to_add.save()
                return Response(category_to_add.data, status.HTTP_201_CREATED)
            return Response(category_to_add.error_messages, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


class CategoryDetailView(APIView):
    def get_category(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist as e:
            print('Category detail view does not exist 🚨 ==>', e)
            raise NotFound(str(e))
        except Exception as e:
            print('Category detail view exception  🚨 ==>', e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, _request, pk):
        category = self.get_category(pk)
        serialized_category = CategorySerializer(category)
        return Response(serialized_category.data)

    def put(self, request, pk):
        category = self.get_category(pk)
        try:
            category_to_update = CategorySerializer(
                category, request.data, partial=True)
            print('updating category ==>', category_to_update)
            if category_to_update.is_valid():
                category_to_update.save()
                return Response(category_to_update.data, status.HTTP_202_ACCEPTED)
            print('category to update errors ==>', category_to_update.errors)
            return Response(category_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, _request, pk):
        category_to_delete = Category.objects.get(pk=pk)
        category_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
