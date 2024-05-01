from django.urls import path
from .views import (
    CreateUserSiloView,
    ListUserSilosView,
    DeleteUserSiloView,
    SiloTableDataView,
    SiloTableMetadataView,
    SiloTableNamesView,
)

urlpatterns = [
    path("create/", CreateUserSiloView.as_view(), name="create-silo"),
    path("list/", ListUserSilosView.as_view(), name="list-silo"),
    path("delete/", DeleteUserSiloView.as_view(), name="delete-silos"),
    path(
        "<str:schema_name>/tables/<str:table_name>/data/",
        SiloTableDataView.as_view(),
        name="silo-table-data",
    ),
    path(
        "<str:schema_name>/tables/",
        SiloTableNamesView.as_view(),
        name="silo-table-names",
    ),
    path(
        "<str:schema_name>/tables/<str:table_name>/metadata/",
        SiloTableMetadataView.as_view(),
        name="silo-table-metadata",
    ),
]
