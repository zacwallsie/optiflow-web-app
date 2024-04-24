from django.http import JsonResponse
from utils.db_utils import create_db, delete_db


def create_database(request):
    # Assume you extract db_name, user, password from request
    result = create_db(db_name, user, password)
    return JsonResponse({"status": "success", "result": result})


def delete_database(request):
    # Assume you get db_identifier from request
    result = delete_db(db_identifier)
    return JsonResponse({"status": "success", "result": result})
