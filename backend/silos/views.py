import os
from rest_framework import permissions, views, response, status
from .models import UserSilo
from .serializers import UserSiloSerializer
from django.db import transaction, connection

# ------------------------- Silo Data Getting -------------------------


class SiloTableNamesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, schema_name):
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = '{schema_name}'
                    ORDER BY table_name;
                """
                )
                tables = cursor.fetchall()
                table_names = [
                    table[0] for table in tables
                ]  # Assuming the table name is the first column in the result
                return response.Response(
                    {"tables": table_names}, status=status.HTTP_200_OK
                )
        except Exception as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SiloTableMetadataView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, schema_name, table_name):
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = '{schema_name}' AND table_name = '{table_name}'
                    ORDER BY ordinal_position;
                """
                )
                columns = cursor.fetchall()
                column_details = [{"name": col[0], "type": col[1]} for col in columns]
                return response.Response(
                    {"columns": column_details}, status=status.HTTP_200_OK
                )
        except Exception as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SiloTableDataView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, schema_name, table_name):
        # Pagination parameters
        page = request.query_params.get("page", 1)
        page_size = request.query_params.get("page_size", 10)

        # Start building the query
        query = f'SELECT * FROM "{schema_name}"."{table_name}"'
        query_params = []

        # Dynamic filtering
        for key, value in request.query_params.items():
            if key in ["page", "page_size"]:
                continue  # Skip pagination parameters
            query += f' AND "{key}" = %s'
            query_params.append(value)

        # Add pagination logic
        query += f" LIMIT %s OFFSET %s"
        query_params.extend([page_size, (int(page) - 1) * int(page_size)])

        try:
            with connection.cursor() as cursor:
                cursor.execute(query, query_params)
                rows = cursor.fetchall()
                # Assuming column headers are needed
                columns = [col[0] for col in cursor.description]
                data = [dict(zip(columns, row)) for row in rows]
                return response.Response({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListUserSilosView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Retrieve all silos that belong to the logged-in user
        user_silos = UserSilo.objects.filter(user=request.user)
        # Serialize the data
        serializer = UserSiloSerializer(user_silos, many=True)
        return response.Response(serializer.data)


# ------------------------- Silo Management -------------------------


class DeleteUserSiloView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        silo_ids = request.data.get("ids", [])
        if not silo_ids:
            return response.Response(
                {"detail": "No silo IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        silos_to_delete = UserSilo.objects.filter(id__in=silo_ids, user=request.user)

        try:
            with connection.cursor() as cursor:
                with transaction.atomic():  # Use atomic to ensure all or nothing is deleted
                    # Drop each schema
                    for silo in silos_to_delete:
                        self.delete_silo(silo.schema_name)

                    # Delete the records after successful schema deletion
                    silos_to_delete.delete()

        except Exception as e:
            # Explicitly mention the transaction rollback if there is an exception
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return response.Response(
            {"detail": "Silos deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )

    @staticmethod
    def delete_silo(silo_name):
        with connection.cursor() as cursor:
            cursor.execute(f'DROP SCHEMA IF EXISTS "{silo_name}" CASCADE;')


class CreateUserSiloView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserSiloSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            schema_name = serializer.validated_data["schema_name"]
            if UserSilo.objects.filter(
                user=request.user, schema_name=schema_name
            ).exists():
                return response.Response(
                    {"detail": "Silo with this name already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                with transaction.atomic():  # Start a transaction
                    self.create_schema(schema_name)
                    # Save the user silo upon successful schema creation
                    serializer.save()
            except Exception as e:  # Cleanup if schema creation fails
                transaction.rollback()
                return response.Response(
                    {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_schema(silo_name):
        with connection.cursor() as cursor:
            cursor.execute(
                f'CREATE SCHEMA "{silo_name}" AUTHORIZATION {os.environ.get("DB_SCHEMA_EDITOR_USERNAME")};'
            )
            cursor.execute(
                f'GRANT ALL PRIVILEGES ON SCHEMA "{silo_name}" TO {os.environ.get("DB_SCHEMA_EDITOR_USERNAME")};'
            )
