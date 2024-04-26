from rest_framework import permissions, views, response, status
from .models import UserDatabase
from .serializers import UserDatabaseSerializer
import psycopg2


class CreateDatabaseView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UserDatabaseSerializer(data=request.data)
        if serializer.is_valid():
            # Check if database with this name already exists
            if UserDatabase.objects.filter(
                name=serializer.validated_data["name"]
            ).exists():
                return response.Response(
                    {"detail": "Database with this name already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create database entry in Django
            user_database = serializer.save(user=request.user)

            # Actually create the database in PostgreSQL
            try:
                self.create_postgres_db(
                    user_database.name,
                    user_database.db_username,
                    user_database.db_password,
                )
            except Exception as e:
                user_database.delete()  # Cleanup if failed
                return response.Response(
                    {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_postgres_db(name, username, password):
        conn = psycopg2.connect(
            dbname="postgres",
            user="your_admin_username",
            password="your_admin_password",
            host="localhost",
        )
        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE {name}")
        cursor.execute(f"CREATE USER {username} WITH PASSWORD '{password}'")
        cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {name} TO {username}")
        cursor.close()
        conn.close()
