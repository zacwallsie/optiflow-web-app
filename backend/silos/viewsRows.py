from rest_framework import permissions, views, response, status
from .models import UserSilo
from django.db import transaction, connection, DatabaseError
from psycopg2 import sql
import re


class IndividualSiloRowView(views.APIView):
    """Endpoint to retrieve and manipulate a single row within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name, row_id):
        if not (
            self.validate_identifier(table_name) and self.validate_identifier(row_id)
        ):
            return response.Response(
                {"detail": "Invalid identifier format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            row = self.get_row_data(user_silo.id, table_name, row_id)
            return response.Response(row, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            return response.Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, silo_id, table_name, row_id):
        if not (
            self.validate_identifier(table_name) and self.validate_identifier(row_id)
        ):
            return response.Response(
                {"detail": "Invalid identifier format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            columns = request.data.get("columns")
            if not columns:
                return response.Response(
                    {"detail": "Columns not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            update_values = {
                sql.Identifier(key): sql.Literal(value)
                for key, value in columns.items()
            }
            query = sql.SQL("UPDATE {table} SET {values} WHERE id = {id}").format(
                table=sql.Identifier(str(user_silo.id), table_name),
                values=sql.SQL(", ").join(
                    sql.Composed(
                        [
                            sql.Identifier(k) + sql.SQL(" = ") + v
                            for k, v in update_values.items()
                        ]
                    )
                ),
                id=sql.Literal(row_id),
            )
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute(query)

                return response.Response(
                    {"detail": "Row updated successfully"},
                    status=status.HTTP_200_OK,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, silo_id, table_name, row_id):
        if not (
            self.validate_identifier(table_name) and self.validate_identifier(row_id)
        ):
            return response.Response(
                {"detail": "Invalid identifier format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            query = sql.SQL("DELETE FROM {table} WHERE id = {id}").format(
                table=sql.Identifier(str(user_silo.id), table_name),
                id=sql.Literal(row_id),
            )
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute(query)

                return response.Response(
                    {"detail": "Row deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def get_row_data(silo_id: str, table_name: str, row_id):
        """Used to retrieve a single row within a table using direct SQL."""
        with connection.cursor() as cursor:
            query = sql.SQL("SELECT * FROM {table} WHERE id = {id}").format(
                table=sql.Identifier(silo_id, table_name), id=sql.Literal(row_id)
            )
            cursor.execute(query)
            row = cursor.fetchone()
            return row

    @staticmethod
    def validate_identifier(identifier):
        """Validate that the identifier is a safe alphanumeric string, potentially with underscores."""
        return re.match(r"^[a-zA-Z0-9_]+$", identifier)


class BatchAddSiloRowView(views.APIView):
    """Endpoint to add multiple rows within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, silo_id, table_name):
        if not self.validate_identifiers(table_name):
            return response.Response(
                {"detail": "Invalid table name"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)

            rows = request.data.get("rows")
            if not rows:
                return response.Response(
                    {"detail": "Rows not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            queries = []
            for row in rows:
                columns = row.get("columns")
                if not columns:
                    return response.Response(
                        {"detail": "Columns not provided"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                keys = [sql.Identifier(col) for col in columns.keys()]
                values = [sql.Literal(val) for val in columns.values()]
                query = sql.SQL(
                    "INSERT INTO {table} ({fields}) VALUES ({vals})"
                ).format(
                    table=sql.Identifier(str(user_silo.id), table_name),
                    fields=sql.SQL(", ").join(keys),
                    vals=sql.SQL(", ").join(values),
                )
                queries.append(query)

            with transaction.atomic():
                with connection.cursor() as cursor:
                    for query in queries:
                        cursor.execute(query)

                return response.Response(
                    {"detail": "Rows added successfully"},
                    status=status.HTTP_201_CREATED,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def validate_identifiers(*args):
        """Validate identifiers to ensure they are alphanumeric or underscore."""
        pattern = re.compile(r"^[\w]+$")
        return all(pattern.match(identifier) for identifier in args)


class BatchUpdateSiloRowView(views.APIView):
    """Endpoint to update multiple rows within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, silo_id, table_name):
        if not self.validate_identifiers(table_name):
            return response.Response(
                {"detail": "Invalid silo ID or table name"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)

            rows = request.data.get("rows")
            if not rows:
                return response.Response(
                    {"detail": "Rows not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            with transaction.atomic():
                with connection.cursor() as cursor:
                    for row in rows:
                        row_id = row.get("id")
                        columns = row.get("columns")
                        if not columns:
                            continue

                        set_clause = sql.SQL(", ").join(
                            [
                                sql.SQL("{} = {}").format(
                                    sql.Identifier(col), sql.Literal(val)
                                )
                                for col, val in columns.items()
                            ]
                        )
                        query = sql.SQL(
                            "UPDATE {table} SET {set_clause} WHERE id = {id}"
                        ).format(
                            table=sql.Identifier(str(user_silo.id), table_name),
                            set_clause=set_clause,
                            id=sql.Literal(row_id),
                        )
                        cursor.execute(query)

                return response.Response(
                    {"detail": "Rows updated successfully"},
                    status=status.HTTP_200_OK,
                )
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def validate_identifiers(*args):
        """Validate identifiers to ensure they are alphanumeric or underscore."""
        pattern = re.compile(r"^[\w]+$")
        return all(pattern.match(identifier) for identifier in args)


class BatchDeleteSiloRowView(views.APIView):
    """Endpoint to delete multiple rows within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, silo_id, table_name):
        if not self.validate_identifiers(table_name):
            return response.Response(
                {"detail": "Invalid silo ID or table name"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)

            row_ids = request.data.get("row_ids", [])

            if not row_ids:
                return response.Response(
                    {"detail": "Row IDs not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                with connection.cursor() as cursor:
                    query = sql.SQL("DELETE FROM {table} WHERE id IN ({ids})").format(
                        table=sql.Identifier(str(user_silo.id), table_name),
                        ids=sql.SQL(", ").join(map(sql.Literal, row_ids)),
                    )
                    cursor.execute(query)

                return response.Response(
                    {"detail": "Rows deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )

        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def validate_identifiers(*args):
        """Validate identifiers to ensure they are alphanumeric or underscore."""
        pattern = re.compile(r"^[\w]+$")
        return all(pattern.match(identifier) for identifier in args)


class SiloRowView(views.APIView):
    """Endpoint to retrieve and manipulate rows within a table."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id, table_name):
        # Validate identifiers to prevent SQL injection
        if not self.validate_identifier(table_name):
            return response.Response(
                {"detail": "Invalid identifier format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            rows = self.get_row_data(str(user_silo.id), str(table_name))
            return response.Response({"rows": rows}, status=status.HTTP_200_OK)
        except UserSilo.DoesNotExist:
            return response.Response(
                {"detail": "Silo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, silo_id, table_name):
        # Validate identifiers to prevent SQL injection
        if not self.validate_identifier(table_name):
            return response.Response(
                {"detail": "Invalid identifier format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_silo = UserSilo.objects.get(id=silo_id, user=request.user)
            columns = request.data.get("columns")
            if not columns or not isinstance(columns, dict):
                return response.Response(
                    {"detail": "Columns not provided or invalid format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Using parameterization for safer SQL queries
            column_names = [
                col for col in columns.keys() if self.validate_identifier(col)
            ]
            column_values = list(columns.values())
            with transaction.atomic():
                with connection.cursor() as cursor:
                    query = sql.SQL(
                        "INSERT INTO {schema}.{table} ({fields}) VALUES ({values})"
                    ).format(
                        schema=sql.Identifier(str(user_silo.id)),
                        table=sql.Identifier(table_name),
                        fields=sql.SQL(", ").join(map(sql.Identifier, column_names)),
                        values=sql.SQL(", ").join(
                            sql.Placeholder() * len(column_values)
                        ),
                    )
                    cursor.execute(query, column_values)

                return response.Response(
                    {"detail": "Row added successfully"}, status=status.HTTP_201_CREATED
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
    def get_row_data(silo_id, table_name):
        """Used to retrieve all rows within a table using direct SQL and return them as a list of dictionaries."""
        with connection.cursor() as cursor:
            query = sql.SQL("SELECT * FROM {schema}.{table};").format(
                schema=sql.Identifier(silo_id), table=sql.Identifier(table_name)
            )
            cursor.execute(query)
            columns = [
                col[0] for col in cursor.description
            ]  # Extract column names from the cursor
            rows = [
                dict(zip(columns, row))  # Create a dictionary for each row
                for row in cursor.fetchall()
            ]
            return rows

    @staticmethod
    def validate_identifier(identifier):
        """Validate that the identifier is a safe alphanumeric string, potentially with underscores."""
        return re.match(r"^[a-zA-Z0-9_]+$", identifier)
