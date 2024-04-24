from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_database, name="create_database"),
    path("delete/", views.delete_database, name="delete_database"),
]
