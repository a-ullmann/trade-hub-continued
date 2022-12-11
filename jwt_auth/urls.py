from django.urls import path
from .views import RegisterView, LoginView, UserListView, UserDetailView, UserProfileView

urlpatterns = [
    path('users/', UserListView.as_view()),
    path('profile/', UserProfileView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view())
]
