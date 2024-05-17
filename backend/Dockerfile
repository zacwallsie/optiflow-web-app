FROM python:3.12.3-bookworm

# Install dependencies and clean up in one layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Add non-root user
RUN adduser --disabled-login worker

# Set work directory and change owner
WORKDIR /home/worker/app/backend
COPY --chown=worker:worker ["requirements.txt", "./"]

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the application
COPY --chown=worker:worker ["config/*.py", "config/"]
COPY --chown=worker:worker ["accounts/", "accounts/"]
COPY --chown=worker:worker ["silos/", "silos/"]
COPY --chown=worker:worker ["static/", "static/"]
COPY --chown=worker:worker ["manage.py", "./"]

USER worker
ENV PATH="/home/worker/.local/bin:${PATH}"

EXPOSE 8000
RUN python manage.py runserver