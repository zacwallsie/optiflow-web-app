FROM python:3.12.3-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update
# Add dependcies for pyscopg2, which django uses to connect to postgres sql database
RUN apt-get install -y --no-install-recommends libpq-dev gcc python3-dev
# Remove all the unecessary packages installed by the update command
RUN rm -rf /var/lib/apt/lists/*
# Add new user so we don't run as root
RUN adduser --disabled-login worker
USER worker
WORKDIR /home/worker/app/backend
COPY --chown=worker:worker ["config/*.py", "config/"]
COPY --chown=worker:worker ["accounts/", "accounts/"]
COPY --chown=worker:worker ["silos/", "silos/"]
COPY --chown=worker:worker ["manage.py", "requirements.txt", "startserver.sh", "./"]
ENV PATH="/home/worker/.local/bin:${PATH}"
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN chmod 500 startserver.sh
EXPOSE 8000
CMD ./startserver.sh