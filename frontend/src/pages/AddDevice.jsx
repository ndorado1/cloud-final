import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { deviceService } from '../services/api';

const AddDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    device_type: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    location: '',
    status: 'AVAILABLE',
    acquisition_date: '',
    warranty_expiration: '',
    last_maintenance_date: '',
    next_maintenance_date: '',
    description: '',
    purchase_price: '',
  });
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadDevice();
    }
  }, [id]);

  useEffect(() => {
    updateSummary();
  }, [formData]);

  const loadDevice = async () => {
    try {
      const response = await deviceService.getById(id);
      const device = response.data;
      setFormData({
        name: device.name || '',
        device_type: device.device_type || '',
        manufacturer: device.manufacturer || '',
        model_number: device.model_number || '',
        serial_number: device.serial_number || '',
        location: device.location || '',
        status: device.status || 'AVAILABLE',
        acquisition_date: device.acquisition_date || '',
        warranty_expiration: device.warranty_expiration || '',
        last_maintenance_date: device.last_maintenance_date || '',
        next_maintenance_date: device.next_maintenance_date || '',
        description: device.description || '',
        purchase_price: device.purchase_price || '',
      });
    } catch (error) {
      console.error('Error loading device:', error);
      alert('Error al cargar el dispositivo');
      navigate('/devices');
    }
  };

  const updateSummary = () => {
    setSummary({
      name: formData.name || 'Not set',
      type: formData.device_type ? getDeviceTypeLabel(formData.device_type) : 'Not set',
      serialNumber: formData.serial_number || 'Missing',
      status: formData.status ? getStatusLabel(formData.status) : 'Pending',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.serial_number.trim()) {
      newErrors.serial_number = 'Serial number is required.';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required.';
    }
    if (!formData.device_type) {
      newErrors.device_type = 'Device type is required.';
    }
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      };

      if (isEdit) {
        await deviceService.update(id, submitData);
      } else {
        await deviceService.create(submitData);
      }
      navigate('/devices');
    } catch (error) {
      console.error('Error saving device:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Error al guardar el dispositivo');
      }
    } finally {
      setLoading(false);
    }
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

  const isFormValid = formData.serial_number && formData.name && formData.device_type && formData.manufacturer;

  return (
    <Layout>
      <div className="flex flex-wrap justify-between gap-3 pb-8">
        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          {isEdit ? 'Edit Medical Device' : 'Register New Medical Device'}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit}>
            {/* Device Identification Section */}
            <div className="rounded-xl border border-neutral-border/50 dark:border-neutral-border/20 bg-white dark:bg-slate-900/50 p-6">
              <h2 className="text-primary text-xl font-bold leading-tight tracking-[-0.015em] pb-6">Device Identification</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col col-span-2">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Device Name</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 ${
                      errors.name ? 'focus:ring-error/50 border-error' : 'focus:ring-primary/50 border-neutral-border'
                    } dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 placeholder:text-neutral-text px-4 text-sm font-normal leading-normal`}
                    placeholder="e.g., Alaris PC 8015"
                  />
                  {errors.name && <p className="text-error text-xs pt-1">{errors.name}</p>}
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Device Type</p>
                  <select
                    name="device_type"
                    value={formData.device_type}
                    onChange={handleChange}
                    className={`form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 ${
                      errors.device_type ? 'focus:ring-error/50 border-error' : 'focus:ring-primary/50 border-neutral-border'
                    } dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 px-4 text-sm font-normal leading-normal`}
                  >
                    <option value="">Select Type</option>
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
                  {errors.device_type && <p className="text-error text-xs pt-1">{errors.device_type}</p>}
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Manufacturer</p>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 ${
                      errors.manufacturer ? 'focus:ring-error/50 border-error' : 'focus:ring-primary/50 border-neutral-border'
                    } dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 placeholder:text-neutral-text px-4 text-sm font-normal leading-normal`}
                    placeholder="e.g., Becton Dickinson"
                  />
                  {errors.manufacturer && <p className="text-error text-xs pt-1">{errors.manufacturer}</p>}
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Model Number</p>
                  <input
                    type="text"
                    name="model_number"
                    value={formData.model_number}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 placeholder:text-neutral-text px-4 text-sm font-normal leading-normal"
                    placeholder="e.g., 8015-04"
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Serial Number</p>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 ${
                      errors.serial_number ? 'focus:ring-error/50 border-error dark:border-error/70' : 'focus:ring-primary/50 border-neutral-border'
                    } dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 placeholder:text-neutral-text px-4 text-sm font-normal leading-normal`}
                    placeholder="e.g., SN-A4B12C8"
                  />
                  {errors.serial_number && <p className="text-error text-xs pt-1">{errors.serial_number}</p>}
                </label>
              </div>
            </div>

            {/* Operational Details Section */}
            <div className="rounded-xl border border-neutral-border/50 dark:border-neutral-border/20 bg-white dark:bg-slate-900/50 p-6">
              <h2 className="text-primary text-xl font-bold leading-tight tracking-[-0.015em] pb-6">Operational Details</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Location</p>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 placeholder:text-neutral-text px-4 text-sm font-normal leading-normal"
                    placeholder="e.g., ICU Ward B, Room 204"
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Current Status</p>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 px-4 text-sm font-normal leading-normal"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ACTIVE">Active</option>
                    <option value="IN_USE">In Use</option>
                    <option value="IN_MAINTENANCE">In Maintenance</option>
                    <option value="IN_REPAIR">In Repair</option>
                    <option value="DECOMMISSIONED">Decommissioned</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Acquisition Date</p>
                  <input
                    type="date"
                    name="acquisition_date"
                    value={formData.acquisition_date}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 px-4 text-sm font-normal leading-normal"
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Warranty Expiration</p>
                  <input
                    type="date"
                    name="warranty_expiration"
                    value={formData.warranty_expiration}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 px-4 text-sm font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Maintenance & Documentation Section */}
            <div className="rounded-xl border border-neutral-border/50 dark:border-neutral-border/20 bg-white dark:bg-slate-900/50 p-6">
              <h2 className="text-primary text-xl font-bold leading-tight tracking-[-0.015em] pb-6">Maintenance & Documentation</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Last Maintenance Date</p>
                  <input
                    type="date"
                    name="last_maintenance_date"
                    value={formData.last_maintenance_date}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 px-4 text-sm font-normal leading-normal"
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Next Scheduled Maintenance</p>
                  <input
                    type="date"
                    name="next_maintenance_date"
                    value={formData.next_maintenance_date}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 h-12 px-4 text-sm font-normal leading-normal"
                  />
                </label>
              </div>

              <div className="mt-6">
                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Description</p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-border dark:border-neutral-border/30 bg-background-light dark:bg-slate-800 placeholder:text-neutral-text px-4 py-3 text-sm font-normal leading-normal"
                    placeholder="Descripción adicional del equipo..."
                  />
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/devices')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="truncate">Cancel</span>
              </button>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <span className="truncate">{loading ? 'Saving...' : isEdit ? 'Update Device' : 'Register Device'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Summary Card */}
        <div className="col-span-1 lg:sticky lg:top-8 h-fit">
          <div className="rounded-xl border border-neutral-border/50 dark:border-neutral-border/20 bg-white dark:bg-slate-900/50 p-6">
            <h3 className="text-slate-800 dark:text-slate-200 text-lg font-bold">Device Summary</h3>
            <p className="text-neutral-text text-sm pt-1 pb-6">Details will appear here as you fill the form.</p>
            <div className="space-y-4 border-t border-neutral-border/50 dark:border-neutral-border/20 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-neutral-text text-sm">Device Name</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium text-right">{summary.name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-neutral-text text-sm">Type</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium text-right">{summary.type}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-neutral-text text-sm">Serial Number</p>
                <div className="flex items-center gap-2">
                  {summary.serialNumber === 'Missing' ? (
                    <>
                      <span className="material-symbols-outlined text-error text-base">error</span>
                      <p className="text-error text-sm font-medium">Missing</p>
                    </>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">{summary.serialNumber}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-neutral-text text-sm">Status</p>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-neutral-text">
                  {summary.status}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-neutral-border/50 dark:border-neutral-border/20">
              <h3 className="text-slate-800 dark:text-slate-200 text-lg font-bold">Validation Status</h3>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-xl ${formData.name && formData.device_type && formData.manufacturer ? 'text-success' : 'text-error'}`}>
                    {formData.name && formData.device_type && formData.manufacturer ? 'check_circle' : 'cancel'}
                  </span>
                  <p className="text-neutral-text dark:text-slate-300 text-sm">Device Details Complete</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-xl ${formData.location && formData.status ? 'text-success' : 'text-error'}`}>
                    {formData.location && formData.status ? 'check_circle' : 'cancel'}
                  </span>
                  <p className="text-neutral-text dark:text-slate-300 text-sm">Operational Details Complete</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-xl">pending</span>
                  <p className="text-neutral-text dark:text-slate-300 text-sm">Documentation Optional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddDevice;

