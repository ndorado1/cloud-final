from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Device(models.Model):
    """Modelo para equipos médicos"""
    
    DEVICE_TYPES = [
        ('INFUSION_PUMP', 'Bomba de Infusión'),
        ('VENTILATOR', 'Ventilador'),
        ('ECG_MACHINE', 'Máquina ECG'),
        ('MONITOR', 'Monitor de Signos Vitales'),
        ('DEFIBRILLATOR', 'Desfibrilador'),
        ('ULTRASOUND', 'Ultrasonido'),
        ('XRAY', 'Rayos X'),
        ('MRI', 'Resonancia Magnética'),
        ('CT_SCANNER', 'Tomógrafo'),
        ('ANESTHESIA', 'Equipo de Anestesia'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Activo'),
        ('IN_MAINTENANCE', 'En Mantenimiento'),
        ('IN_REPAIR', 'En Reparación'),
        ('DECOMMISSIONED', 'Desmantelado'),
        ('AVAILABLE', 'Disponible'),
        ('IN_USE', 'En Uso'),
    ]
    
    # Identificación del dispositivo
    name = models.CharField(max_length=200, verbose_name='Nombre del Equipo')
    device_type = models.CharField(max_length=50, choices=DEVICE_TYPES, verbose_name='Tipo de Equipo')
    manufacturer = models.CharField(max_length=100, verbose_name='Fabricante')
    model_number = models.CharField(max_length=100, verbose_name='Número de Modelo')
    serial_number = models.CharField(max_length=100, unique=True, verbose_name='Número de Serie')
    
    # Detalles operacionales
    location = models.CharField(max_length=200, verbose_name='Ubicación')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE', verbose_name='Estado')
    acquisition_date = models.DateField(verbose_name='Fecha de Adquisición')
    warranty_expiration = models.DateField(null=True, blank=True, verbose_name='Vencimiento de Garantía')
    
    # Mantenimiento
    last_maintenance_date = models.DateField(null=True, blank=True, verbose_name='Última Fecha de Mantenimiento')
    next_maintenance_date = models.DateField(null=True, blank=True, verbose_name='Próxima Fecha de Mantenimiento')
    
    # Información adicional
    description = models.TextField(blank=True, verbose_name='Descripción')
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name='Precio de Compra')
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de Actualización')
    
    class Meta:
        verbose_name = 'Equipo Médico'
        verbose_name_plural = 'Equipos Médicos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['serial_number']),
            models.Index(fields=['status']),
            models.Index(fields=['device_type']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.serial_number}"


class MaintenanceRecord(models.Model):
    """Registro de mantenimiento de equipos médicos"""
    
    MAINTENANCE_TYPES = [
        ('PREVENTIVE', 'Preventivo'),
        ('CORRECTIVE', 'Correctivo'),
        ('CALIBRATION', 'Calibración'),
        ('INSPECTION', 'Inspección'),
    ]
    
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='maintenance_records', verbose_name='Equipo')
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPES, verbose_name='Tipo de Mantenimiento')
    maintenance_date = models.DateField(verbose_name='Fecha de Mantenimiento')
    performed_by = models.CharField(max_length=200, verbose_name='Realizado por')
    description = models.TextField(verbose_name='Descripción')
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Costo')
    next_maintenance_due = models.DateField(null=True, blank=True, verbose_name='Próximo Mantenimiento')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Registro de Mantenimiento'
        verbose_name_plural = 'Registros de Mantenimiento'
        ordering = ['-maintenance_date']
    
    def __str__(self):
        return f"{self.device.name} - {self.maintenance_type} - {self.maintenance_date}"


class DeviceDocument(models.Model):
    """Documentos asociados a equipos médicos"""
    
    DOCUMENT_TYPES = [
        ('MANUAL', 'Manual'),
        ('WARRANTY', 'Garantía'),
        ('CERTIFICATE', 'Certificado'),
        ('INVOICE', 'Factura'),
        ('OTHER', 'Otro'),
    ]
    
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='documents', verbose_name='Equipo')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, verbose_name='Tipo de Documento')
    title = models.CharField(max_length=200, verbose_name='Título')
    file_path = models.CharField(max_length=500, verbose_name='Ruta del Archivo')
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Subida')
    description = models.TextField(blank=True, verbose_name='Descripción')
    
    class Meta:
        verbose_name = 'Documento del Equipo'
        verbose_name_plural = 'Documentos de Equipos'
        ordering = ['-upload_date']
    
    def __str__(self):
        return f"{self.device.name} - {self.title}"

