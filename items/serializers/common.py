from rest_framework import serializers
from ..models import Listings, Purchases


class ListingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listings
        fields = '__all__'


class PurchasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchases
        fields = '__all__'
