from django.urls import path
from .views import CreateDatabaseView

urlpatterns = [
    path("create-database/", CreateDatabaseView.as_view(), name="create-database"),
]
