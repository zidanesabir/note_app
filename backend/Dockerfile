# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Set the working directory in the container
WORKDIR /app/backend

# Install poetry
RUN pip install "poetry==1.6.1"


# Increase Poetry's HTTP timeout
ENV POETRY_HTTP_TIMEOUT=300
# --- END FIX ---

# Copy project files
COPY pyproject.toml poetry.lock ./
COPY app ./app
COPY alembic.ini ./
COPY alembic ./alembic

# Install dependencies using poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-root

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]