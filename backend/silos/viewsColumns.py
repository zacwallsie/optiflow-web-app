from rest_framework import permissions, views, response, status
from .models import UserSilo
from django.db import transaction, connection, DatabaseError
import re


class IndividualColumnView(views.APIView):
    """Endpoint to retrieve and manipulate a single column within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name, column_name):
        """Used to retrieve a single column within a table."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            column_details = self.get_column_details(silo_id, table_name, column_name)
            return response.Response(column_details, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, silo_id, table_name, column_name):
        """Used to update a single column within a table."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            silo_id = user_silo.id
            new_column_name = request.data.get("column_name")
            new_column_type = request.data.get("column_type")
            if not new_column_name or not new_column_type:
                return response.Response(
                    {"detail": "Column name or type not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                self.update_column_details(
                    silo_id, table_name, column_name, new_column_name, new_column_type
                )
                return response.Response(
                    {"detail": "Column updated successfully"}, status=status.HTTP_200_OK
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, silo_id, table_name, column_name):
        """Used to delete a table within a silo."""
        try:
            with transaction.atomic():
                user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
                self.delete_column(str(user_silo.id), str(table_name), str(column_name))
                return response.Response(
                    {"detail": "Table deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_column_details(silo_id, table_name, column_name):
        """Used to retrieve a single column within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = '{silo_id}'
                AND table_name = '{table_name}'
                AND column_name = '{column_name}';
            """
            )
            column = cursor.fetchone()
            return column

    @staticmethod
    def update_column_details(
        silo_id, table_name, column_name, new_column_name, new_column_type
    ):
        """Used to update a single column within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                ALTER TABLE "{silo_id}"."{table_name}"
                RENAME COLUMN "{column_name}" TO "{new_column_name}";
                ALTER TABLE "{silo_id}"."{table_name}"
                ALTER COLUMN "{new_column_name}" TYPE {new_column_type};
            """
            )

    @staticmethod
    def delete_column(silo_id, table_name, column_name):
        """Used to delete a single column within a table using direct SQL."""
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                ALTER TABLE "{silo_id}"."{table_name}"
                DROP COLUMN IF EXISTS "{column_name}";
            """
            )


class SiloColumnView(views.APIView):
    """Endpoint to retrieve and manipulate columns within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        """Used to retrieve all columns within a table."""
        try:
            # Validate identifiers using regex to ensure they are alphanumeric and/or contain underscores
            if not re.match(r"^[A-Za-z0-9_]+$", table_name):
                return response.Response(
                    {"detail": "Invalid table name"}, status=status.HTTP_400_BAD_REQUEST
                )
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            # Using parameterization to safely pass the table_schema and table_name
            column_details = self.get_column_details(str(user_silo.id), str(table_name))
            return response.Response(
                {"columns": column_details}, status=status.HTTP_200_OK
            )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, silo_id, table_name):
        """Used to create a column within a table."""
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            column_name = request.data.get("columnName")
            column_type = request.data.get("dataType")
            default_value = request.data.get("defaultVal")
            check_constraint = request.data.get("checkConstraint")
            is_unique = request.data.get("isUnique")
            is_nullable = request.data.get("isNullable")
            is_primary_key = request.data.get("isPrimaryKey")
            create_index = request.data.get("createIndex")
            collation = request.data.get("collation")

            if not column_name or not column_type:
                return response.Response(
                    {"detail": "Column name or type not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                self.create_column(
                    user_silo.id,
                    table_name,
                    column_name,
                    column_type,
                    default_value,
                    check_constraint,
                    is_unique,
                    is_nullable,
                    is_primary_key,
                    create_index,
                    collation,
                )
                return response.Response(
                    {"detail": "Column added successfully"},
                    status=status.HTTP_201_CREATED,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except ValueError as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_column_details(silo_id: str, table_name: str):
        """Retrieve all column details within a table using direct SQL safely with parameterization."""
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = %s AND table_name = %s;
            """,
                [silo_id, table_name],
            )
            columns = cursor.fetchall()
            columns_details = []
            for col in columns:
                column_detail = {
                    "field": col[0],
                    "headerName": col[0].replace("_", " ").title(),
                    "width": 150 if col[2] is None else min(max(col[2] * 9, 100), 300),
                    "editable": True,
                    "type": (
                        "number"
                        if "int" in col[1]
                        else "date" if "date" in col[1] else "string"
                    ),
                    "sortable": True,
                    "filterable": True,
                    "defaultValue": col[4] if col[4] else "",
                    "nullable": True if col[3] == "YES" else False,
                }
                columns_details.append(column_detail)
            return columns_details

    @staticmethod
    def create_column(
        silo_id: str,
        table_name: str,
        column_name: str,
        column_type: str,
        default_value=None,
        check_constraint=None,
        is_unique=False,
        is_nullable=True,
        is_primary_key=False,
        create_index=False,
        collation=None,
    ):
        """Create a column within a table using direct SQL safely with parameterization."""
        # Validate identifiers to prevent SQL Injection in non-parameterizable fields
        if not re.match(r"^[A-Za-z0-9_]+$", column_name):
            raise ValueError("Invalid column name")
        if not re.match(r"^[A-Za-z0-9_]+$", table_name):
            raise ValueError("Invalid table name")
        if not re.match(r"^[A-Za-z0-9_]+$", column_type):
            raise ValueError("Invalid data type")

        # Begin SQL statement construction
        sql = f'ALTER TABLE "{silo_id}"."{table_name}" ADD COLUMN "{column_name}" {column_type}'
        modifiers = []

        # Parameterize where possible
        params = []
        if default_value is not None and default_value != "":
            modifiers.append("DEFAULT %s")
            params.append(default_value)
        if not is_nullable:
            modifiers.append("NOT NULL")
        if is_unique:
            modifiers.append("UNIQUE")
        if check_constraint:
            modifiers.append(
                f"CHECK ({check_constraint})"
            )  # Be careful with the contents of check constraints
        if collation:
            modifiers.append("COLLATE %s")
            params.append(collation)

        if modifiers:
            sql += " " + " ".join(modifiers)

        if is_primary_key:
            sql += f', ADD PRIMARY KEY ("{column_name}")'
        if create_index:
            sql += f'; CREATE INDEX ON "{silo_id}"."{table_name}" ("{column_name}")'

        # Execute SQL safely
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
