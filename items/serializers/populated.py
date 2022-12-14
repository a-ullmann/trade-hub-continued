from .common import ListingsSerializer
from jwt_auth.serializers.common import UserSerializer
from category.serializers.common import CategorySerializer


class PopulatedListingsSerializer(ListingsSerializer):
    category = CategorySerializer()
    owner = UserSerializer()
