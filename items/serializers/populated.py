from .common import ItemSerializer
from jwt_auth.serializers.common import UserSerializer
from categories.serializers.common import CategorySerializer
# from categories.serializers.populated import PopulatedCategorySerializer


class PopulatedItemSerializer(ItemSerializer):
    categories = CategorySerializer(many=True)
    owner = UserSerializer()
