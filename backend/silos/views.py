import os
from rest_framework import permissions, views, response, status
from .models import UserSilo
from .serializers import UserSiloSerializer
from django.db import transaction, connection
from psycopg2 import sql

# TODO: Escape using psycopg2 example;
# from django.db import connection


# def create_schema(silo_name):
#     with connection.cursor() as cursor:
#         cursor.execute(
#             "CREATE SCHEMA %s AUTHORIZATION %s;",
#             [silo_name, os.environ.get("DB_SCHEMA_EDITOR_USERNAME")],
#         )


# ------------------------- Silo Management -------------------------


class IndividualSiloView(views.APIView):
    """Endpoint to retrieve and manipulate a single silo by ID (would have to already exist)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id):
        """Used to retrieve a single silo by ID."""
        # Only retrieves the specific abstract User Silo details, does not retrieve the schema itself
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            serializer = UserSiloSerializer(user_silo)
            return response.Response(serializer.data)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, silo_id):
        """Used to update a single silo by ID."""
        # Note only updates the specific abstract User Silo details, does not alter the schema itself
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            serializer = UserSiloSerializer(user_silo, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return response.Response(serializer.data)
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, silo_id):
        """Used to delete a single silo by ID."""
        # Will delete both the User Silo abstract model and the schema itself
        try:
            with transaction.atomic():
                user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
                self.delete_silo(user_silo.id)
                user_silo.delete()
                return response.Response(
                    {"detail": "Silo deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Explicitly mention the transaction rollback if there is an exception
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def delete_silo(silo_id):
        """Used to delete a schema in the database via direct SQL queries."""
        with connection.cursor() as cursor:
            cursor.execute(f'DROP SCHEMA IF EXISTS "{silo_id}" CASCADE;')


class BatchDeleteSiloView(views.APIView):
    """Endpoint to delete multiple silos at once for the logged in user."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Used to delete multiple silos at once for the logged in user."""
        silo_ids = request.data.get("silo_ids", [])
        if not silo_ids:
            return response.Response(
                {"detail": "No silo IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        silos_to_delete = UserSilo.objects.filter(id__in=silo_ids, user=request.user)

        try:
            with transaction.atomic():  # Use atomic to ensure all or nothing is deleted
                # Drop each schema
                for silo in silos_to_delete:
                    self.delete_silo(silo.id)

                # Delete the records after successful schema deletion
                silos_to_delete.delete()

                return response.Response(
                    {"detail": "Silos deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )

        except Exception as e:
            # Explicitly mention the transaction rollback if there is an exception
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def delete_silo(silo_id):
        """Used to delete a schema in the database via direct SQL queries."""
        with connection.cursor() as cursor:
            cursor.execute(f'DROP SCHEMA IF EXISTS "{silo_id}" CASCADE;')


class SiloView(views.APIView):
    """Parent view for all silo-related operations."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Used to retrieve all silos that belong to the logged-in user."""
        # Retrieve all silos that belong to the logged-in user
        user_silos = UserSilo.objects.filter(user=request.user)
        # Serialize the data
        serializer = UserSiloSerializer(user_silos, many=True)
        return response.Response(serializer.data)

    def post(self, request):
        """Used to create a new silo for the logged-in user."""
        serializer = UserSiloSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            silo_name = serializer.validated_data["silo_name"]
            if UserSilo.objects.filter(user=request.user, silo_name=silo_name).exists():
                return response.Response(
                    {"detail": "Silo with this name already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                with transaction.atomic():  # Start a transaction
                    user_silo = serializer.save()  # Silo needs to be saved to get UUID
                    silo_id = user_silo.id
                    self.create_schema(str(silo_id))
            except Exception as e:  # Cleanup if schema creation fails
                transaction.rollback()
                return response.Response(
                    {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_schema(silo_id):
        """Used to create a schema in the database via direct SQL queries."""
        with connection.cursor() as cursor:
            cursor.execute(
                f'CREATE SCHEMA "{silo_id}" AUTHORIZATION {os.environ.get("DB_SCHEMA_EDITOR_USERNAME")};'
            )
            cursor.execute(
                f'GRANT ALL PRIVILEGES ON SCHEMA "{silo_id}" TO {os.environ.get("DB_SCHEMA_EDITOR_USERNAME")};'
            )


# ------------------------- Silo Table Operations -------------------------


class IndividualSiloTableView(views.APIView):
    """Endpoint to retrieve and manipulate a single table within a silo."""

    # Note all operations within this view are direct SQL queries on the schema

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        """Used to retrieve a single table within a silo."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            table_details = self.get_table_details(silo_id, table_name)
            return response.Response(table_details, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, silo_id, table_name):
        """Used to rename a table within a silo."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            new_table_name = request.data.get("table_name")
            if not new_table_name:
                return response.Response(
                    {"detail": "New table name not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            with transaction.atomic():
                self.update_table_name(silo_id, table_name, new_table_name)
                return response.Response(
                    {"detail": "Table renamed successfully"}, status=status.HTTP_200_OK
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:  # Cleanup if table rename fails
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, silo_id, table_name):
        """Used to delete a table within a silo."""
        try:
            with transaction.atomic():
                user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
                silo_id = user_silo.id
                self.delete_table(str(silo_id), str(table_name))
                return response.Response(
                    {"detail": "Table deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Explicitly mention the transaction rollback if there is an exception
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_table_details(silo_id: str, table_name: str):
        """Used to retrieve all table details using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT *
                FROM information_schema.tables
                WHERE table_schema = '{silo_id}'
                AND table_name = '{table_name}';
            """
            )
            table = cursor.fetchone()
            return table

    @staticmethod
    def update_table_name(silo_id: str, table_name: str, new_table_name: str):
        """Used to update a table name using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                ALTER TABLE "{silo_id}"."{table_name}"
                RENAME TO "{new_table_name}";
            """
            )

    @staticmethod
    def delete_table(silo_id: str, table_name: str):
        """Used to delete a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL("DROP TABLE IF EXISTS {schema}.{table};").format(
                    schema=sql.Identifier(silo_id), table=sql.Identifier(table_name)
                )
            )


class SiloTableView(views.APIView):
    """Endpoint to retrieve and manipulate tables within a silo."""

    # Note all operations within this view are direct SQL queries on the schema

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id):
        """Used to retrieve all tables within a silo."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            table_names = self.get_table_names(silo_id)
            return response.Response({"tables": table_names}, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, silo_id):
        """Used to create a table within a silo."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            table_name = request.data.get("table_name")
            if not table_name:
                return response.Response(
                    {"detail": "Table name not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                self.create_table(silo_id, table_name)
                return response.Response(
                    {"detail": "Table created successfully"},
                    status=status.HTTP_201_CREATED,
                )

        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:  # Cleanup if table create fails
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_table_names(silo_id):
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
    def create_table(silo_id, table_name):
        """Used to create a table within a schema using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                CREATE TABLE "{silo_id}"."{table_name}" ();
            """
            )


# ------------------------- Silo Column Operations -------------------------


class IndividualColumnView(views.APIView):
    """Endpoint to retrieve and manipulate a single column within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name, column_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            column_details = self.get_column_details(silo_name, table_name, column_name)
            return response.Response(column_details, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, silo_id, table_name, column_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            new_column_name = request.data.get("column_name")
            new_column_type = request.data.get("column_type")
            if not new_column_name or not new_column_type:
                return response.Response(
                    {"detail": "Column name or type not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    ALTER TABLE "{silo_name}"."{table_name}"
                    RENAME COLUMN "{column_name}" TO "{new_column_name}";
                    ALTER TABLE "{silo_name}"."{table_name}"
                    ALTER COLUMN "{new_column_name}" TYPE {new_column_type};
                """
                )
            return response.Response(
                {"detail": "Column updated successfully"}, status=status.HTTP_200_OK
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, silo_id, table_name, column_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    ALTER TABLE "{silo_name}"."{table_name}"
                    DROP COLUMN IF EXISTS "{column_name}";
                """
                )
            return response.Response(
                {"detail": "Column deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SiloColumnView(views.APIView):
    """Endpoint to retrieve and manipulate columns within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            column_details = self.get_column_details(silo_name, table_name)
            return response.Response(
                {"columns": column_details}, status=status.HTTP_200_OK
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, silo_id, table_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            column_name = request.data.get("column_name")
            column_type = request.data.get("column_type")
            if not column_name or not column_type:
                return response.Response(
                    {"detail": "Column name or type not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    ALTER TABLE "{silo_name}"."{table_name}"
                    ADD COLUMN "{column_name}" {column_type};
                """
                )
            return response.Response(
                {"detail": "Column added successfully"}, status=status.HTTP_201_CREATED
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )


# ------------------------- Silo Row Operations -------------------------


class IndividualSiloRowView(views.APIView):
    """Endpoint to retrieve and manipulate a single row within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name, row_id):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            row = self.get_row_data(silo_name, table_name, row_id)
            return response.Response(row, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, silo_id, table_name, row_id):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
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
                    UPDATE "{silo_name}"."{table_name}"
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
            silo_name = user_silo.silo_name
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    DELETE FROM "{silo_name}"."{table_name}"
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
    def get_row_data(silo_name, table_name, row_id):
        """Used to retrieve a single row within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT *
                FROM "{silo_name}"."{table_name}"
                WHERE id = {row_id};
            """
            )
            row = cursor.fetchone()
            return row

    @staticmethod
    def update_row_data(silo_name, table_name, row_id, columns):
        """Used to update a single row within a table using direct SQL."""
        column_values = ", ".join(f'"{col}" = {val}' for col, val in columns.items())
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                UPDATE "{silo_name}"."{table_name}"
                SET {column_values}
                WHERE id = {row_id};
            """
            )

    @staticmethod
    def delete_row_data(silo_name, table_name, row_id):
        """Used to delete a single row within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                DELETE FROM "{silo_name}"."{table_name}"
                WHERE id = {row_id};
            """
            )


class SiloRowView(views.APIView):
    """Endpoint to retrieve and manipulate rows within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
            rows = self.get_table_data(silo_name, table_name)
            return response.Response({"data": rows}, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, silo_id, table_name):
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_name = user_silo.silo_name
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
                    INSERT INTO "{silo_name}"."{table_name}" ({column_names})
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
    def get_row_data(silo_name, table_name):
        """Used to retrieve all rows within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT *
                FROM "{silo_name}"."{table_name}";
            """
            )
            rows = cursor.fetchall()
            return rows

    @staticmethod
    def add_row_data(silo_name, table_name, columns):
        """Used to add a row within a table using direct SQL."""
        column_names = ", ".join(f'"{col}"' for col in columns.keys())
        column_values = ", ".join(f"'{val}'" for val in columns.values())
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                INSERT INTO "{silo_name}"."{table_name}" ({column_names})
                VALUES ({column_values});
            """
            )
