from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

# Simple health check endpoint
def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('health/', health_check, name='health-check'),
]