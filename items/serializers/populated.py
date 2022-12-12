from .common import ItemSerializer
from jwt_auth.serializers.common import UserSerializer
from category.serializers.common import CategorySerializer
# from category.serializers.populated import PopulatedCategorySerializer


class PopulatedItemSerializer(ItemSerializer):
    category = CategorySerializer()
    owner = UserSerializer()
