from .common import ListingsSerializer
from jwt_auth.serializers.common import UserSerializer
from category.serializers.common import CategorySerializer
# from category.serializers.populated import PopulatedCategorySerializer


class PopulatedListingsSerializer(ListingsSerializer):
    category = CategorySerializer()
    owner = UserSerializer()
