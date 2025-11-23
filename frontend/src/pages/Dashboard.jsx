import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { deviceService } from '../services/api';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await deviceService.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'text-green-accent',
      AVAILABLE: 'text-green-accent',
      IN_USE: 'text-primary',
      IN_MAINTENANCE: 'text-red-accent',
      IN_REPAIR: 'text-red-accent',
      DECOMMISSIONED: 'text-neutral-text',
    };
    return colors[status] || 'text-neutral-text';
  };

  const getStatusLabel = (status) => {
    const labels = {
      ACTIVE: 'Activo',
      AVAILABLE: 'Disponible',
      IN_USE: 'En Uso',
      IN_MAINTENANCE: 'En Mantenimiento',
      IN_REPAIR: 'En Reparación',
      DECOMMISSIONED: 'Desmantelado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-text">Cargando estadísticas...</p>
        </div>
      </Layout>
    );
  }

  if (!statistics) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-error">Error al cargar estadísticas</p>
        </div>
      </Layout>
    );
  }

  // Calcular porcentajes para el gráfico
  const total = statistics.total_devices || 1;
  const availablePercent = Math.round((statistics.available_devices / total) * 100);
  const inUsePercent = Math.round((statistics.in_use_devices / total) * 100);
  const maintenancePercent = Math.round((statistics.maintenance_needed / total) * 100);

  return (
    <Layout>
      {/* PageHeading and ButtonGroup */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-black leading-tight tracking-[-0.033em]">
            Medical Device Dashboard
          </p>
          <p className="text-neutral-700 dark:text-neutral-200/80 text-base font-normal leading-normal">
            Overview of device inventory and key metrics.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-start">
          <Link
            to="/devices/new"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span className="truncate">Add New Device</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white dark:bg-background-dark/50">
          <p className="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal">Total Devices</p>
          <p className="text-neutral-900 dark:text-neutral-100 tracking-light text-3xl font-bold leading-tight">
            {statistics.total_devices}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white dark:bg-background-dark/50">
          <p className="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal">Requires Maintenance</p>
          <p className="text-neutral-900 dark:text-neutral-100 tracking-light text-3xl font-bold leading-tight text-red-accent">
            {statistics.maintenance_needed}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white dark:bg-background-dark/50">
          <p className="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal">Available Devices</p>
          <p className="text-neutral-900 dark:text-neutral-100 tracking-light text-3xl font-bold leading-tight text-green-accent">
            {statistics.available_devices}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white dark:bg-background-dark/50">
          <p className="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal">Devices in Use</p>
          <p className="text-neutral-900 dark:text-neutral-100 tracking-light text-3xl font-bold leading-tight">
            {statistics.in_use_devices}
          </p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-background-dark/50 rounded-xl border border-neutral-200 dark:border-neutral-700/50 p-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Device Status Breakdown</h3>
          <div className="relative flex items-center justify-center h-64">
            <svg className="size-full" viewBox="0 0 36 36">
              <path
                className="stroke-neutral-100 dark:stroke-white/10"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
              />
              <path
                className="stroke-green-accent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                strokeDasharray={`${availablePercent}, 100`}
                strokeDashoffset="0"
                strokeWidth="3"
              />
              <path
                className="stroke-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                strokeDasharray={`${inUsePercent}, 100`}
                strokeDashoffset={`-${availablePercent}`}
                strokeWidth="3"
              />
              <path
                className="stroke-red-accent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                strokeDasharray={`${maintenancePercent}, 100`}
                strokeDashoffset={`-${availablePercent + inUsePercent}`}
                strokeWidth="3"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{statistics.total_devices}</span>
              <span className="text-sm text-neutral-700 dark:text-neutral-200/80">Total Devices</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-green-accent"></span>
                <span className="text-sm text-neutral-700 dark:text-neutral-200/80">Available</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{statistics.available_devices}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-primary"></span>
                <span className="text-sm text-neutral-700 dark:text-neutral-200/80">In Use</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{statistics.in_use_devices}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-accent"></span>
                <span className="text-sm text-neutral-700 dark:text-neutral-200/80">Maintenance</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{statistics.maintenance_needed}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white dark:bg-background-dark/50 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 p-6 pb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-neutral-200 dark:border-neutral-700/50">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200/80">Device Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200/80">Serial Number</th>
                  <th className="px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200/80">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200/80">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {statistics.recent_activity && statistics.recent_activity.length > 0 ? (
                  statistics.recent_activity.map((activity) => (
                    <tr key={activity.id} className="border-b border-neutral-200 dark:border-neutral-700/50">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        <Link to={`/devices/${activity.id}`} className="hover:text-primary">
                          {activity.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200/80">{activity.serial_number}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200/80">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {getStatusLabel(activity.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200/80">
                        {new Date(activity.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-neutral-700 dark:text-neutral-200/80">
                      No hay actividad reciente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

