from .models import Listings
from .serializers.common import ListingsSerializer
from .serializers.populated import PopulatedListingsSerializer


from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated


class ListingsListView(APIView):
    # permission_classes = (IsAuthenticated, )

    def get(self, request):
        listings = Listings.objects.all()
        # print('listings =>', listings)
        serialized_listings = PopulatedListingsSerializer(listings, many=True)
        return Response(serialized_listings.data)

    def post(self, request):
        print("REQUEST USER 🚨 ==>", request.user.id, request.user.username)
        request.data['owner'] = request.user.id
        try:
            print('posting new Listings 🚨 ==>', request.data)
            listing_to_add = ListingsSerializer(data=request.data)
            if listing_to_add.is_valid():
                print('listing to add validated data 🚨 ==>',
                      listing_to_add.validated_data)
                listing_to_add.save()
                return Response(listing_to_add.data, status.HTTP_201_CREATED)
            print(listing_to_add.errors)
            return Response(listing_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListingsSearchView(generics.ListAPIView):

    def get(self, _request, query):
        listings = Listings.objects.filter(name__icontains=query)
        serialized_listings = PopulatedListingsSerializer(listings, many=True)
        return Response(serialized_listings.data)


class ListingsDetailView(APIView):
    # permission_classes = (IsAuthenticated, )

    def get_listings(self, pk):
        try:
            return Listings.objects.get(pk=pk)
        except Listings.DoesNotExist as e:
            print('Listings detail view get_Listings does not exist 🚨 ==>', e)
            raise NotFound(str(e))
        except Exception as e:
            print('Listings detail view exception  🚨 ==>', e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, _request, pk):
        listings = self.get_listings(pk)
        serialized_listing = PopulatedListingsSerializer(listings)
        return Response(serialized_listing.data)

    def put(self, request, pk):
        listings = self.get_listings(pk)
        try:
            listing_to_update = ListingsSerializer(
                listings, request.data, partial=True)
            print('updating listing 🚨 ==>', listing_to_update)
            if listing_to_update.is_valid():
                listing_to_update.save()
                return Response(listing_to_update.data, status.HTTP_202_ACCEPTED)
            print('listing to update errors 🚨 ==>', listing_to_update.errors)
            return Response(listing_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        listings = self.get_listings(pk)
        listings.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
