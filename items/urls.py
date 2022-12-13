from django.urls import path
from .views import ListingsListView, ListingsDetailView, ListingsSearchView, PurchasesView

urlpatterns = [
    path('listings/', ListingsListView.as_view()),
    path('listings/<int:pk>/', ListingsDetailView.as_view()),
    path('search/', ListingsSearchView.as_view()),
    path('purchases/', PurchasesView.as_view())
]
