from django.urls import path
from .viewsSilos import (
    IndividualSiloView,
    SiloView,
    BatchDeleteSiloView,
)
from .viewsTables import (
    IndividualSiloTableView,
    SiloTableView,
)
from .viewsColumns import (
    IndividualColumnView,
    SiloColumnView,
)
from .viewsRows import (
    IndividualSiloRowView,
    BatchAddSiloRowView,
    BatchDeleteSiloRowView,
    BatchUpdateSiloRowView,
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
        "<str:silo_id>/tables/<str:table_name>/rows/batch/add/",
        BatchAddSiloRowView.as_view(),
        name="batch-add-silo-row",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/rows/batch/update/",
        BatchUpdateSiloRowView.as_view(),
        name="batch-update-silo-row",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/rows/batch/delete/",
        BatchDeleteSiloRowView.as_view(),
        name="batch-delete-silo-row",
    ),
    path(
        "<str:silo_id>/tables/<str:table_name>/rows/<str:row_id>/",
        IndividualSiloRowView.as_view(),
        name="individual-silo-row",
    ),
]
