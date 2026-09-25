from django.urls import path
from .views import PetsListCreateView, PetsDetailView

urlpatterns = [
    path("pets/", PetsListCreateView.as_view(), name="pets_list_create"),
    path("pets/<int:petid>/", PetsDetailView.as_view(), name="pets_detail"),
]