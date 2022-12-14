from django.urls import path
from .views import ListingsListView, ListingsDetailView, ListingsSearchView

urlpatterns = [
    path('listings/', ListingsListView.as_view()),
    path('listings/<int:pk>/', ListingsDetailView.as_view()),
    path('<str:query>/', ListingsSearchView.as_view()),
]
