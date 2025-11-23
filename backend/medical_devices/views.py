from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Device, MaintenanceRecord, DeviceDocument
from .serializers import DeviceSerializer, DeviceListSerializer, MaintenanceRecordSerializer, DeviceDocumentSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar equipos médicos.
    Proporciona acciones CRUD completas.
    """
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DeviceListSerializer
        return DeviceSerializer
    
    def get_queryset(self):
        queryset = Device.objects.all()
        
        # Filtros
        status_filter = self.request.query_params.get('status', None)
        device_type_filter = self.request.query_params.get('device_type', None)
        search = self.request.query_params.get('search', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if device_type_filter:
            queryset = queryset.filter(device_type=device_type_filter)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(serial_number__icontains=search) |
                Q(manufacturer__icontains=search) |
                Q(model_number__icontains=search) |
                Q(location__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Endpoint para obtener estadísticas del dashboard
        """
        total_devices = Device.objects.count()
        active_devices = Device.objects.filter(status='ACTIVE').count()
        available_devices = Device.objects.filter(status='AVAILABLE').count()
        in_use_devices = Device.objects.filter(status='IN_USE').count()
        maintenance_needed = Device.objects.filter(status='IN_MAINTENANCE').count()
        
        # Dispositivos que requieren mantenimiento (próximo mantenimiento en menos de 30 días)
        today = timezone.now().date()
        maintenance_due_soon = Device.objects.filter(
            next_maintenance_date__lte=today + timedelta(days=30),
            next_maintenance_date__gte=today
        ).count()
        
        # Distribución por tipo
        device_types = Device.objects.values('device_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Distribución por estado
        status_distribution = Device.objects.values('status').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Actividad reciente (últimos 5 dispositivos creados o actualizados)
        recent_activity = Device.objects.order_by('-updated_at')[:5].values(
            'id', 'name', 'serial_number', 'status', 'updated_at'
        )
        
        return Response({
            'total_devices': total_devices,
            'active_devices': active_devices,
            'available_devices': available_devices,
            'in_use_devices': in_use_devices,
            'maintenance_needed': maintenance_needed,
            'maintenance_due_soon': maintenance_due_soon,
            'device_types': list(device_types),
            'status_distribution': list(status_distribution),
            'recent_activity': list(recent_activity),
        })


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar registros de mantenimiento
    """
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer
    
    def get_queryset(self):
        queryset = MaintenanceRecord.objects.all()
        device_id = self.request.query_params.get('device', None)
        
        if device_id:
            queryset = queryset.filter(device_id=device_id)
        
        return queryset.order_by('-maintenance_date')


class DeviceDocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar documentos de equipos
    """
    queryset = DeviceDocument.objects.all()
    serializer_class = DeviceDocumentSerializer
    
    def get_queryset(self):
        queryset = DeviceDocument.objects.all()
        device_id = self.request.query_params.get('device', None)
        
        if device_id:
            queryset = queryset.filter(device_id=device_id)
        
        return queryset.order_by('-upload_date')

