gunicorn --bind :8000 --workers 4 config.wsgi:application
fi