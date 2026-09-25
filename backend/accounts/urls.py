from django.urls import path
from .views import RegisterView, TokenView, MeView

urlpatterns = [
    # React frontend expects this
    path("register", RegisterView.as_view()),
    path("register/", RegisterView.as_view()),

    # Login -> returns JWT access token
    path("token/", TokenView.as_view()),

    # Current user
    path("me/", MeView.as_view()),
]