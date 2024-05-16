from rest_framework import permissions, views, response, status
from .models import UserSilo
from django.db import transaction, connection, DatabaseError
from psycopg2 import sql
import re


class IndividualSiloRowView(views.APIView):
    """Endpoint to retrieve and manipulate a single row within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name, row_id):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            row = self.get_row_data(silo_id, table_name, row_id)
            return response.Response(row, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, silo_id, table_name, row_id):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            columns = request.data.get("columns")
            if not columns:
                return response.Response(
                    {"detail": "Columns not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            column_values = ", ".join(
                f"\"{col}\" = '{val}'" for col, val in columns.items()
            )

            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    UPDATE "{silo_id}"."{table_name}"
                    SET {column_values}
                    WHERE id = {row_id};
                """
                )
            return response.Response(
                {"detail": "Row updated successfully"}, status=status.HTTP_200_OK
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, silo_id, table_name, row_id):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    DELETE FROM "{silo_id}"."{table_name}"
                    WHERE id = {row_id};
                """
                )
            return response.Response(
                {"detail": "Row deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @staticmethod
    def get_row_data(silo_id, table_name, row_id):
        """Used to retrieve a single row within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT *
                FROM "{silo_id}"."{table_name}"
                WHERE id = {row_id};
            """
            )
            row = cursor.fetchone()
            return row

    @staticmethod
    def update_row_data(silo_id, table_name, row_id, columns):
        """Used to update a single row within a table using direct SQL."""
        column_values = ", ".join(f'"{col}" = {val}' for col, val in columns.items())
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                UPDATE "{silo_id}"."{table_name}"
                SET {column_values}
                WHERE id = {row_id};
            """
            )

    @staticmethod
    def delete_row_data(silo_id, table_name, row_id):
        """Used to delete a single row within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                DELETE FROM "{silo_id}"."{table_name}"
                WHERE id = {row_id};
            """
            )


class SiloRowView(views.APIView):
    """Endpoint to retrieve and manipulate rows within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            rows = self.get_row_data(silo_id, table_name)
            return response.Response({"rows": rows}, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, silo_id, table_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            columns = request.data.get("columns")
            if not columns:
                return response.Response(
                    {"detail": "Columns not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            column_names = ", ".join(f'"{col}"' for col in columns.keys())
            column_values = ", ".join(f"'{val}'" for val in columns.values())

            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    INSERT INTO "{silo_id}"."{table_name}" ({column_names})
                    VALUES ({column_values});
                """
                )
            return response.Response(
                {"detail": "Row added successfully"}, status=status.HTTP_201_CREATED
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @staticmethod
    def get_row_data(silo_id, table_name):
        """Used to retrieve all rows within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT *
                FROM "{silo_id}"."{table_name}";
            """
            )
            rows = cursor.fetchall()
            return rows

    @staticmethod
    def add_row_data(silo_id, table_name, columns):
        """Used to add a row within a table using direct SQL."""
        column_names = ", ".join(f'"{col}"' for col in columns.keys())
        column_values = ", ".join(f"'{val}'" for val in columns.values())
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                INSERT INTO "{silo_id}"."{table_name}" ({column_names})
                VALUES ({column_values});
            """
            )
