FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .
RUN mkdir -p api
# Create a health check endpoint
RUN printf "from django.http import JsonResponse\nfrom django.urls import path\n\ndef health_check(request):\n    return JsonResponse({'status': 'ok'})\n\nurlpatterns = [path('health/', health_check, name='health-check')]\n" > api/health_check.py
RUN echo 'from .health_check import urlpatterns as health_urlpatterns; urlpatterns += health_urlpatterns' >> api/urls.py
# Collect static files
RUN python3 manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "arxiv_summarizer.wsgi:application"]
