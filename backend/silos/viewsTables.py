from rest_framework import permissions, views, response, status
from .models import UserSilo
from django.db import transaction, connection, DatabaseError
from psycopg2 import sql
import re


class IndividualSiloTableView(views.APIView):
    """Endpoint to retrieve and manipulate a single table within a silo."""

    # Note all operations within this view are direct SQL queries on the schema

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        """Used to retrieve a single table within a silo."""
        if not self.validate_identifier(str(silo_id)) or not self.validate_identifier(
            str(table_name)
        ):
            return response.Response(
                {"detail": "Invalid identifier format"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            table_details = self.get_table_details(str(user_silo.id), str(table_name))
            return response.Response(table_details, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, silo_id, table_name):
        """Used to rename a table within a silo."""
        new_table_name = request.data.get("table_name")
        if not new_table_name or not self.validate_identifier(str(new_table_name)):
            return response.Response(
                {"detail": "Invalid new table name provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            if self.table_exists(str(user_silo.id), str(new_table_name)):
                return response.Response(
                    {"detail": "Table name already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            with transaction.atomic():
                self.update_table_name(
                    str(user_silo.id), str(table_name), str(new_table_name)
                )
                return response.Response(
                    {"detail": "Table renamed successfully"}, status=status.HTTP_200_OK
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:  # Cleanup if table rename fails
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, silo_id, table_name):
        """Used to delete a table within a silo."""
        try:
            with transaction.atomic():
                user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
                self.delete_table(str(user_silo.id), str(table_name))
                return response.Response(
                    {"detail": "Table deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:  # Cleanup if table delete fails
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_table_details(silo_id: str, table_name: str):
        """Used to retrieve all table details using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL(
                    "SELECT * FROM information_schema.tables WHERE table_schema = %s AND table_name = %s;"
                ),
                [silo_id, table_name],
            )
            table = cursor.fetchone()
            return table

    @staticmethod
    def table_exists(silo_id: str, table_name: str):
        """Check if a table name already exists in the schema."""
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL(
                    "SELECT 1 FROM information_schema.tables WHERE table_schema = %s AND table_name = %s;"
                ),
                [silo_id, table_name],
            )
            return cursor.fetchone() is not None

    @staticmethod
    def update_table_name(silo_id: str, table_name: str, new_table_name: str):
        """Used to update a table name using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL("ALTER TABLE {schema}.{table} RENAME TO {new_name};").format(
                    schema=sql.Identifier(silo_id),
                    table=sql.Identifier(table_name),
                    new_name=sql.Identifier(new_table_name),
                )
            )

    @staticmethod
    def delete_table(silo_id: str, table_name: str):
        """Used to delete a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL("DROP TABLE IF EXISTS {schema}.{table} CASCADE;").format(
                    schema=sql.Identifier(silo_id), table=sql.Identifier(table_name)
                )
            )

    @staticmethod
    def validate_identifier(identifier: str):
        """Validate that the identifier is a safe alphanumeric string, potentially with underscores."""
        return re.match(r"^[a-zA-Z0-9_]+$", identifier)


class SiloTableView(views.APIView):
    """Endpoint to retrieve and manipulate tables within a silo."""

    # Note all operations within this view are direct SQL queries on the schema

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id):
        """Used to retrieve all tables within a silo."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            table_names = self.get_table_names(str(silo_id))
            return response.Response({"tables": table_names}, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, silo_id):
        """Used to create a table within a silo."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            table_name = request.data.get("table_name")
            if not table_name or not self.validate_identifier(str(table_name)):
                return response.Response(
                    {"detail": "Invalid table name provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if self.table_exists(str(user_silo.id), str(table_name)):
                return response.Response(
                    {"detail": "Table name already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            with transaction.atomic():
                self.create_table(str(user_silo.id), str(table_name))
                return response.Response(
                    {"detail": "Table created successfully"},
                    status=status.HTTP_201_CREATED,
                )

        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except DatabaseError as e:  # Cleanup if table creation fails
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_table_names(silo_id: str):
        """Used to retrieve all table names within a schema using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = '{silo_id}'
                ORDER BY table_name;
            """
            )
            tables = cursor.fetchall()
            table_names = [table[0] for table in tables]
            return table_names

    @staticmethod
    def table_exists(silo_id: str, table_name: str):
        """Check if a table name already exists in the schema."""
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL(
                    "SELECT 1 FROM information_schema.tables WHERE table_schema = %s AND table_name = %s;"
                ),
                [silo_id, table_name],
            )
            return cursor.fetchone() is not None

    @staticmethod
    def create_table(silo_id: str, table_name: str):
        """Used to create a table within a schema using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                CREATE TABLE "{silo_id}"."{table_name}" (
                    id SERIAL PRIMARY KEY
                );
                """
            )

    @staticmethod
    def validate_identifier(identifier: str):
        """Validate that the identifier is a safe alphanumeric string, potentially with underscores."""
        return re.match(r"^[a-zA-Z0-9_]+$", identifier)
