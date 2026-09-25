"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),

    # FRONTEND COMPATIBILITY (React calls /register)
    # Allows: http://localhost:5317/register
    path("", include("accounts.urls")),

    # Clean backend auth API
    # Allows: /api/auth/register/, /api/auth/token/, /api/auth/me/
    path("api/auth/", include("accounts.urls")),

    # Pets API
    # Example: /api/pets/, /api/pets/<id>/
    path("api/", include("pets.urls")),
]
