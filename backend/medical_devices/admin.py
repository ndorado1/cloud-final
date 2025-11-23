from django.contrib import admin
from .models import Device, MaintenanceRecord, DeviceDocument


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ['name', 'device_type', 'manufacturer', 'serial_number', 'status', 'location', 'created_at']
    list_filter = ['status', 'device_type', 'manufacturer']
    search_fields = ['name', 'serial_number', 'model_number', 'manufacturer']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ['device', 'maintenance_type', 'maintenance_date', 'performed_by', 'cost']
    list_filter = ['maintenance_type', 'maintenance_date']
    search_fields = ['device__name', 'performed_by']


@admin.register(DeviceDocument)
class DeviceDocumentAdmin(admin.ModelAdmin):
    list_display = ['device', 'document_type', 'title', 'upload_date']
    list_filter = ['document_type', 'upload_date']
    search_fields = ['device__name', 'title']

