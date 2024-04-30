import os
import psycopg2
from rest_framework import permissions, views, response, status
from .models import UserSilo
from .serializers import UserSiloSerializer


class ListUserSilosView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Retrieve all silos that belong to the logged-in user
        user_silos = UserSilo.objects.filter(user=request.user)
        # Serialize the data
        serializer = UserSiloSerializer(user_silos, many=True)
        return response.Response(serializer.data)


class CreateSiloView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserSiloSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            schema_name = serializer.validated_data["schema_name"]
            if UserSilo.objects.filter(schema_name=schema_name).exists():
                return response.Response(
                    {"detail": "Silo with this name already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_silo = serializer.save()

            try:
                self.create_schema(
                    schema_name,
                )
            except Exception as e:
                user_silo.delete()  # Cleanup if schema creation fails
                return response.Response(
                    {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_schema(silo_name):
        conn = psycopg2.connect(
            dbname=os.environ.get("DB_NAME"),
            user=os.environ.get("DB_USER"),
            password=os.environ.get("DB_PASSWORD"),
            host=os.environ.get("DB_HOST"),
            port=os.environ.get("DB_PORT"),
        )
        conn.autocommit = True
        cursor = conn.cursor()
        try:
            # Create schema
            cursor.execute(
                f'CREATE SCHEMA "{silo_name}" AUTHORIZATION {os.environ.get("DB_SCHEMA_EDITOR_USERNAME")};'
            )
            # Grant privileges to the schema editor user
            cursor.execute(
                f'GRANT ALL PRIVILEGES ON SCHEMA "{silo_name}" TO {os.environ.get("DB_SCHEMA_EDITOR_USERNAME")};'
            )
        except psycopg2.Error as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()
