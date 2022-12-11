from django.urls import path
from .views import ItemListView, ItemDetailView, ItemSearchView

urlpatterns = [
    path('', ItemListView.as_view()),
    path('<int:pk>/', ItemDetailView.as_view()),
    path('search/', ItemSearchView.as_view())
]
