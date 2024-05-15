from django.urls import path
from .views import (
    IndividualSiloView,
    SiloView,
    BatchDeleteSiloView,
    IndividualSiloTableView,
    SiloTableView,
    IndividualColumnView,
    SiloColumnView,
    IndividualSiloRowView,
    SiloRowView,
)

urlpatterns = [
    path("", SiloView.as_view(), name="silo"),
    path("batch/delete/", BatchDeleteSiloView.as_view(), name="batch-delete-silo"),
    path("<str:silo_id>/", IndividualSiloView.as_view(), name="individual-silo"),
    path("<str:silo_id>/tables/", SiloTableView.as_view(), name="silo-table"),
    path(
        "<str:silo_id>/tables/<str:table_name>/",
        IndividualSiloTableView.as_view(),
        name="individual-silo-table",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/columns/",
        SiloColumnView.as_view(),
        name="silo-column",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/columns/<str:column_name>/",
        IndividualColumnView.as_view(),
        name="individual-silo-column",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/rows/",
        SiloRowView.as_view(),
        name="silo-row",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/rows/<str:row_id>/",
        IndividualSiloRowView.as_view(),
        name="individual-silo-row",
    ),
]
