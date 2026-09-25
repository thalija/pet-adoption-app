from django.utils import timezone
from django.db.models import Q

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from dbmodels.models import Pets
from .serializers import PetsSerializer


def _get_db_user_from_request(request):
    """
    Option A: we authenticate against MariaDB users (not Django auth_user).
    accounts.authentication.MariaDBJWTAuthentication sets request.db_user.
    """
    return getattr(request, "db_user", None)


class IsAdminDbRole(permissions.BasePermission):
    def has_permission(self, request, view):
        db_user = _get_db_user_from_request(request)
        role = (getattr(db_user, "role", "") or "").strip().lower()
        return bool(db_user and role == "admin")


class PetsListCreateView(generics.ListCreateAPIView):
    """
    GET  -> Public list. Supports:
            /api/pets/?petId=123
            /api/pets/?search=lab
            /api/pets/?animalType=dog
            /api/pets/?availability=available
    POST -> Admin only (JWT + role=admin in MariaDB users)
    """
    serializer_class = PetsSerializer
    queryset = Pets.objects.all().order_by("-datecreated")

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsAdminDbRole()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()

        # Frontend compatibility: /api/pets/?petId=123
        pet_id = self.request.query_params.get("petId")
        if pet_id:
            # A non-numeric id can't match any pet (and would otherwise raise a server error)
            if not pet_id.strip().isdigit():
                return qs.none()
            return qs.filter(petid=int(pet_id))

        animal_type = self.request.query_params.get("animalType") or self.request.query_params.get("animaltype")
        availability = self.request.query_params.get("availability")
        search = self.request.query_params.get("search")

        if animal_type:
            qs = qs.filter(animaltype__iexact=animal_type)

        if availability:
            qs = qs.filter(availability__iexact=availability)

        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(breed__icontains=search)
                | Q(description__icontains=search)
            )

        return qs

    def perform_create(self, serializer):
        db_user = _get_db_user_from_request(self.request)
        if not db_user:
            raise PermissionDenied("Authenticated user not found in MariaDB users table.")

        serializer.save(
            createdby=db_user,
            datecreated=timezone.now(),
        )


class PetsDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET -> Public
    PUT/PATCH/DELETE -> Admin only
    """
    serializer_class = PetsSerializer
    queryset = Pets.objects.all()
    lookup_field = "petid"

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [permissions.IsAuthenticated(), IsAdminDbRole()]
        return [permissions.AllowAny()]