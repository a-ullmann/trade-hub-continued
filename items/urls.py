from django.urls import path
from .views import ListingsListView, ListingsDetailView, ListingsSearchView, PurchasedView, ListedView

urlpatterns = [
    path('listings/', ListingsListView.as_view()),
    path('listings/<int:pk>/', ListingsDetailView.as_view()),
    path('<str:query>/', ListingsSearchView.as_view()),
    path('purchased/user/<int:pk>/', PurchasedView.as_view()),
    path('listed/user/<int:pk>/', ListedView.as_view()),
]
