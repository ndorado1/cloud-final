from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet, MaintenanceRecordViewSet, DeviceDocumentViewSet

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')
router.register(r'maintenance', MaintenanceRecordViewSet, basename='maintenance')
router.register(r'documents', DeviceDocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]

