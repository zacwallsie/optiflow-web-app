import os
from rest_framework import permissions, views, response, status
from .models import UserSilo
from .serializers import UserSiloSerializer
from django.db import transaction, connection, DatabaseError
import re


class IndividualSiloView(views.APIView):
    """Endpoint to retrieve and manipulate a single silo by ID (would have to already exist)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, silo_id):
        """Used to retrieve a single silo by ID."""
        if not self.validate_id(silo_id):
            return response.Response(
                {"detail": "Invalid silo ID format"}, status=status.HTTP_400_BAD_REQUEST
            )
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
        if not self.validate_id(silo_id):
            return response.Response(
                {"detail": "Invalid silo ID format"}, status=status.HTTP_400_BAD_REQUEST
            )
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
        if not self.validate_id(silo_id):
            return response.Response(
                {"detail": "Invalid silo ID format"}, status=status.HTTP_400_BAD_REQUEST
            )
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
        except DatabaseError as e:
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def delete_silo(silo_id):
        """Used to delete a schema in the database via direct SQL queries."""
        # Ensuring the silo_id is safely included in the SQL query
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA IF EXISTS %s CASCADE;", [silo_id])

    @staticmethod
    def validate_id(silo_id):
        """Validate silo ID using a regex pattern to ensure it's a valid UUID."""
        return re.match(
            r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
            str(silo_id),
        )


class BatchDeleteSiloView(views.APIView):
    """Endpoint to delete multiple silos at once for the logged in user."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Used to delete multiple silos at once for the logged in user."""
        silo_ids = request.data.get("silo_ids", [])
        if not all(self.validate_uuid(silo_id) for silo_id in silo_ids):
            return response.Response(
                {"detail": "Invalid silo ID format"}, status=status.HTTP_400_BAD_REQUEST
            )

        silos_to_delete = UserSilo.objects.filter(id__in=silo_ids, user=request.user)

        if not silos_to_delete.exists():
            return response.Response(
                {"detail": "No valid silos found to delete"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            with transaction.atomic():  # Use atomic to ensure all or nothing is deleted
                # Drop each schema using a safe method
                for silo in silos_to_delete:
                    self.delete_silo(str(silo.id))

                # Delete the records after successful schema deletion
                silos_to_delete.delete()

                return response.Response(
                    {"detail": "Silos deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT,
                )

        except DatabaseError as e:
            # Explicitly mention the transaction rollback if there is an exception
            transaction.rollback()
            return response.Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def delete_silo(silo_id):
        """Used to delete a schema in the database via direct SQL queries."""
        # Validate the UUID here or ensure it's validated before calling this function.
        if not BatchDeleteSiloView.validate_uuid(silo_id):
            raise ValueError("Invalid UUID format for silo ID")

        with connection.cursor() as cursor:
            # Directly include the UUID in the SQL statement after validation
            # UUIDs are inherently safe to include in queries after validation because their format is fixed
            sql = f'DROP SCHEMA IF EXISTS "{silo_id}" CASCADE;'
            cursor.execute(sql)

    @staticmethod
    def validate_uuid(uuid_string):
        """Validate UUID format."""
        return re.match(
            r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
            uuid_string,
        )


class SiloView(views.APIView):
    """Parent view for all silo-related operations."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Used to retrieve all silos that belong to the logged-in user."""
        user_silos = UserSilo.objects.filter(user=request.user)
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
            except DatabaseError as e:  # Cleanup if schema creation fails
                transaction.rollback()
                return response.Response(
                    {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_schema(silo_id):
        """Used to create a schema in the database via direct SQL queries."""
        if not re.match(
            r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
            silo_id,
        ):
            raise ValueError("Invalid UUID format")

        db_username = os.environ.get("DB_USER")
        if not re.match(r"^\w+$", db_username):
            raise ValueError("Invalid database username format")

        with connection.cursor() as cursor:
            cursor.execute(f'CREATE SCHEMA "{silo_id}" AUTHORIZATION "{db_username}";')
            cursor.execute(
                f'GRANT ALL PRIVILEGES ON SCHEMA "{silo_id}" TO "{db_username}";'
            )
