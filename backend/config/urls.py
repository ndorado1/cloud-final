"""
URL configuration for medical_devices project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('medical_devices.urls')),
]

