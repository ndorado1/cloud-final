import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { deviceService, maintenanceService, documentService } from '../services/api';

const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specifications');

  useEffect(() => {
    loadDevice();
    loadMaintenanceRecords();
    loadDocuments();
  }, [id]);

  const loadDevice = async () => {
    try {
      const response = await deviceService.getById(id);
      setDevice(response.data);
    } catch (error) {
      console.error('Error loading device:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMaintenanceRecords = async () => {
    try {
      const response = await maintenanceService.getByDevice(id);
      setMaintenanceRecords(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading maintenance records:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = documentService.getByDevice(id);
      setDocuments(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        await deviceService.delete(id);
        navigate('/devices');
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Error al eliminar el equipo');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'Activo', color: 'bg-success', textColor: 'text-success' },
      AVAILABLE: { label: 'Disponible', color: 'bg-success', textColor: 'text-success' },
      IN_USE: { label: 'En Uso', color: 'bg-primary', textColor: 'text-primary' },
      IN_MAINTENANCE: { label: 'En Mantenimiento', color: 'bg-danger', textColor: 'text-danger' },
      IN_REPAIR: { label: 'En Reparación', color: 'bg-danger', textColor: 'text-danger' },
      DECOMMISSIONED: { label: 'Desmantelado', color: 'bg-neutral-text', textColor: 'text-neutral-text' },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-neutral-text', textColor: 'text-neutral-text' };
    return (
      <span className={`inline-flex items-center gap-2 rounded-full ${config.color}/10 px-3 py-1 text-sm font-semibold ${config.textColor}`}>
        <span className={`h-2 w-2 rounded-full ${config.color}`}></span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getDeviceTypeLabel = (type) => {
    const types = {
      INFUSION_PUMP: 'Bomba de Infusión',
      VENTILATOR: 'Ventilador',
      ECG_MACHINE: 'Máquina ECG',
      MONITOR: 'Monitor de Signos Vitales',
      DEFIBRILLATOR: 'Desfibrilador',
      ULTRASOUND: 'Ultrasonido',
      XRAY: 'Rayos X',
      MRI: 'Resonancia Magnética',
      CT_SCANNER: 'Tomógrafo',
      ANESTHESIA: 'Equipo de Anestesia',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-text">Cargando detalles del dispositivo...</p>
        </div>
      </Layout>
    );
  }

  if (!device) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-error">Dispositivo no encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Heading and Actions */}
      <div className="flex flex-wrap justify-between items-start gap-4 p-4 mb-6">
        <div className="flex flex-col gap-2">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
            All Devices / {device.name}
          </p>
          <div className="flex items-center gap-4">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em]">
              {device.name}
            </h1>
            {getStatusBadge(device.status)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to={`/devices/${id}/edit`}
            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-container-dark text-text-primary-light dark:text-text-primary-dark text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="material-symbols-outlined !text-xl">edit</span>
            <span className="truncate">Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-transparent text-error text-sm font-bold leading-normal tracking-[0.015em] hover:bg-error/10"
          >
            <span className="material-symbols-outlined !text-xl">delete</span>
            <span className="truncate">Delete</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-container-light dark:bg-container-dark p-6">
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg bg-slate-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-slate-500">medical_services</span>
            </div>
            <div className="flex w-full grow flex-col items-stretch justify-center gap-4">
              <h2 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold leading-tight tracking-[-0.015em]">
                Device Summary
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Device ID</p>
                  <p className="text-text-primary-light dark:text-text-primary-dark font-medium">{device.serial_number}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Model</p>
                  <p className="text-text-primary-light dark:text-text-primary-dark font-medium">{device.model_number}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Manufacturer</p>
                  <p className="text-text-primary-light dark:text-text-primary-dark font-medium">{device.manufacturer}</p>
                </div>
                <hr className="border-border-light dark:border-border-dark my-1" />
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Location</p>
                  <p className="text-text-primary-light dark:text-text-primary-dark font-medium">{device.location}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Last Maintenance</p>
                  <p className="text-text-primary-light dark:text-text-primary-dark font-medium">{formatDate(device.last_maintenance_date)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Next Maintenance</p>
                  <p className="text-text-primary-light dark:text-text-primary-dark font-medium">{formatDate(device.next_maintenance_date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-container-light dark:bg-container-dark">
            {/* Tabs Navigation */}
            <div className="pb-0 px-6">
              <div className="flex border-b border-border-light dark:border-border-dark gap-8">
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'specifications' ? 'border-b-primary' : 'border-b-transparent'
                  }`}
                >
                  <p
                    className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                      activeTab === 'specifications'
                        ? 'text-primary'
                        : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                    }`}
                  >
                    Specifications
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'maintenance' ? 'border-b-primary' : 'border-b-transparent'
                  }`}
                >
                  <p
                    className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                      activeTab === 'maintenance'
                        ? 'text-primary'
                        : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                    }`}
                  >
                    Maintenance History
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'documents' ? 'border-b-primary' : 'border-b-transparent'
                  }`}
                >
                  <p
                    className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                      activeTab === 'documents'
                        ? 'text-primary'
                        : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                    }`}
                  >
                    Documents
                  </p>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-[30%_1fr] gap-x-6">
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Device ID</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{device.serial_number}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Serial Number</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{device.serial_number}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Device Type</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{getDeviceTypeLabel(device.device_type)}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Manufacturer</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{device.manufacturer}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Model Number</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{device.model_number}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Location</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{device.location}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Status</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{getStatusBadge(device.status)}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Acquisition Date</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{formatDate(device.acquisition_date)}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Warranty Expiration</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{formatDate(device.warranty_expiration)}</p>
                  </div>
                  {device.description && (
                    <div className="col-span-2 grid grid-cols-subgrid border-t border-t-border-light dark:border-border-dark py-5">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Description</p>
                      <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{device.description}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div>
                  {maintenanceRecords.length > 0 ? (
                    <div className="space-y-4">
                      {maintenanceRecords.map((record) => (
                        <div key={record.id} className="border-b border-border-light dark:border-border-dark pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-text-primary-light dark:text-text-primary-dark font-semibold">{record.maintenance_type}</p>
                              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">{formatDate(record.maintenance_date)}</p>
                            </div>
                            {record.cost && (
                              <p className="text-text-primary-light dark:text-text-primary-dark font-medium">${record.cost}</p>
                            )}
                          </div>
                          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-1">
                            Realizado por: {record.performed_by}
                          </p>
                          <p className="text-text-primary-light dark:text-text-primary-dark text-sm">{record.description}</p>
                          {record.next_maintenance_due && (
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-2">
                              Próximo mantenimiento: {formatDate(record.next_maintenance_due)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No hay registros de mantenimiento</p>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  {documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border-b border-border-light dark:border-border-dark pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-text-primary-light dark:text-text-primary-dark font-semibold">{doc.title}</p>
                              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">{doc.document_type}</p>
                              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{formatDate(doc.upload_date)}</p>
                            </div>
                            <a
                              href={doc.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <span className="material-symbols-outlined">download</span>
                            </a>
                          </div>
                          {doc.description && (
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-2">{doc.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No hay documentos disponibles</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeviceDetails;

