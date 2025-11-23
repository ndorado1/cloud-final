from rest_framework import serializers
from .models import Device, MaintenanceRecord, DeviceDocument


class DeviceDocumentSerializer(serializers.ModelSerializer):
    """Serializer para documentos de equipos"""
    
    class Meta:
        model = DeviceDocument
        fields = ['id', 'document_type', 'title', 'file_path', 'upload_date', 'description']


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    """Serializer para registros de mantenimiento"""
    
    class Meta:
        model = MaintenanceRecord
        fields = ['id', 'maintenance_type', 'maintenance_date', 'performed_by', 'description', 'cost', 'next_maintenance_due', 'created_at']


class DeviceSerializer(serializers.ModelSerializer):
    """Serializer para equipos médicos"""
    maintenance_records = MaintenanceRecordSerializer(many=True, read_only=True)
    documents = DeviceDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Device
        fields = [
            'id', 'name', 'device_type', 'manufacturer', 'model_number', 
            'serial_number', 'location', 'status', 'acquisition_date', 
            'warranty_expiration', 'last_maintenance_date', 'next_maintenance_date',
            'description', 'purchase_price', 'created_at', 'updated_at',
            'maintenance_records', 'documents'
        ]
        read_only_fields = ['created_at', 'updated_at']


class DeviceListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listado de equipos"""
    
    class Meta:
        model = Device
        fields = [
            'id', 'name', 'device_type', 'manufacturer', 'serial_number',
            'location', 'status', 'last_maintenance_date', 'next_maintenance_date'
        ]

