import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { deviceService } from '../services/api';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadDevices();
  }, [currentPage, statusFilter, typeFilter, searchTerm]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { device_type: typeFilter }),
        ...(searchTerm && { search: searchTerm }),
      };
      const response = await deviceService.getAll(params);
      setDevices(response.data.results || response.data);
      if (response.data.count !== undefined) {
        setTotalPages(Math.ceil(response.data.count / 10));
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        await deviceService.delete(id);
        loadDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Error al eliminar el equipo');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'Activo', color: 'bg-success' },
      AVAILABLE: { label: 'Disponible', color: 'bg-success' },
      IN_USE: { label: 'En Uso', color: 'bg-primary' },
      IN_MAINTENANCE: { label: 'En Mantenimiento', color: 'bg-danger' },
      IN_REPAIR: { label: 'En Reparación', color: 'bg-danger' },
      DECOMMISSIONED: { label: 'Desmantelado', color: 'bg-neutral-text' },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-neutral-text' };
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2.5 w-2.5 rounded-full ${config.color}`}></div>
        {config.label}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <Layout>
      {/* PageHeading */}
      <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
        <p className="text-slate-900 dark:text-slate-50 text-3xl font-black tracking-tight">Medical Devices</p>
      </div>

      {/* Main Content Area */}
      <div className="mt-6 flex flex-1 flex-col">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {/* ToolBar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex items-center min-w-40 max-w-xs flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base">
                  search
                </span>
                <input
                  type="text"
                  className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm pl-9 pr-8 h-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Search devices, serial numbers..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <label className="relative flex items-center min-w-40 max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base">
                  filter_list
                </span>
                <select
                  className="form-select w-full rounded-lg border-slate-200 dark:border-slate-700 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm pl-9 pr-8 h-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Filter by Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="IN_USE">In Use</option>
                  <option value="IN_MAINTENANCE">Needs Maintenance</option>
                  <option value="IN_REPAIR">In Repair</option>
                  <option value="DECOMMISSIONED">Decommissioned</option>
                </select>
              </label>
              <label className="relative flex items-center min-w-40 max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base">
                  category
                </span>
                <select
                  className="form-select w-full rounded-lg border-slate-200 dark:border-slate-700 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm pl-9 pr-8 h-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Filter by Type</option>
                  <option value="INFUSION_PUMP">Infusion Pump</option>
                  <option value="VENTILATOR">Ventilator</option>
                  <option value="ECG_MACHINE">ECG Machine</option>
                  <option value="MONITOR">Monitor</option>
                  <option value="DEFIBRILLATOR">Defibrillator</option>
                  <option value="ULTRASOUND">Ultrasound</option>
                  <option value="XRAY">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT_SCANNER">CT Scanner</option>
                  <option value="ANESTHESIA">Anesthesia</option>
                </select>
              </label>
            </div>
            <Link
              to="/devices/new"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide gap-2 hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span className="truncate">Add New Device</span>
            </Link>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-8 text-center text-neutral-text">Cargando dispositivos...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                  <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3" scope="col">Device Name</th>
                      <th className="px-6 py-3" scope="col">Serial Number</th>
                      <th className="px-6 py-3" scope="col">Location</th>
                      <th className="px-6 py-3" scope="col">Status</th>
                      <th className="px-6 py-3" scope="col">Last Maintenance</th>
                      <th className="px-6 py-3" scope="col">Next Maintenance</th>
                      <th className="px-6 py-3 text-right" scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.length > 0 ? (
                      devices.map((device) => (
                        <tr
                          key={device.id}
                          className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            <Link to={`/devices/${device.id}`} className="hover:text-primary">
                              {device.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4">{device.serial_number}</td>
                          <td className="px-6 py-4">{device.location}</td>
                          <td className="px-6 py-4">{getStatusBadge(device.status)}</td>
                          <td className="px-6 py-4">{formatDate(device.last_maintenance_date)}</td>
                          <td className="px-6 py-4">{formatDate(device.next_maintenance_date)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Link
                                to={`/devices/${device.id}`}
                                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                title="Ver detalles"
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </Link>
                              <Link
                                to={`/devices/${device.id}/edit`}
                                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                title="Editar"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(device.id)}
                                className="p-2 rounded-md hover:bg-danger/10 text-danger"
                                title="Eliminar"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-neutral-text">
                          No se encontraron dispositivos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Table navigation" className="flex items-center justify-between p-4">
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    Página <span className="font-semibold text-slate-900 dark:text-white">{currentPage}</span> de{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
                  </span>
                  <ul className="inline-flex items-center -space-x-px">
                    <li>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 h-8 ml-0 leading-tight text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white flex items-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                    </li>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      const page = currentPage <= 3 ? idx + 1 : currentPage - 2 + idx;
                      if (page > totalPages) return null;
                      return (
                        <li key={page}>
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 h-8 leading-tight border flex items-center ${
                              currentPage === page
                                ? 'text-primary bg-primary/10 border-primary'
                                : 'text-slate-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 h-8 leading-tight text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-r-lg hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white flex items-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DeviceList;

