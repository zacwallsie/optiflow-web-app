from django.urls import path
from .views import CreateSiloView, ListUserSilosView

urlpatterns = [
    path("create/", CreateSiloView.as_view(), name="create-silo"),
    path("list/", ListUserSilosView.as_view(), name="list-silo"),
    path("update/<int:pk>/", CreateSiloView.as_view(), name="update-silo"),
]
