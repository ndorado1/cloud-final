import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
    } else {
      // Algo pasó al configurar la solicitud
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Servicios para dispositivos
export const deviceService = {
  // Obtener todos los dispositivos
  getAll: (params = {}) => {
    return api.get('/devices/', { params });
  },

  // Obtener un dispositivo por ID
  getById: (id) => {
    return api.get(`/devices/${id}/`);
  },

  // Crear un nuevo dispositivo
  create: (data) => {
    return api.post('/devices/', data);
  },

  // Actualizar un dispositivo
  update: (id, data) => {
    return api.put(`/devices/${id}/`, data);
  },

  // Eliminar un dispositivo
  delete: (id) => {
    return api.delete(`/devices/${id}/`);
  },

  // Obtener estadísticas
  getStatistics: () => {
    return api.get('/devices/statistics/');
  },
};

// Servicios para mantenimiento
export const maintenanceService = {
  getAll: (params = {}) => {
    return api.get('/maintenance/', { params });
  },

  getByDevice: (deviceId) => {
    return api.get('/maintenance/', { params: { device: deviceId } });
  },

  create: (data) => {
    return api.post('/maintenance/', data);
  },

  update: (id, data) => {
    return api.put(`/maintenance/${id}/`, data);
  },

  delete: (id) => {
    return api.delete(`/maintenance/${id}/`);
  },
};

// Servicios para documentos
export const documentService = {
  getAll: (params = {}) => {
    return api.get('/documents/', { params });
  },

  getByDevice: (deviceId) => {
    return api.get('/documents/', { params: { device: deviceId } });
  },

  create: (data) => {
    return api.post('/documents/', data);
  },

  update: (id, data) => {
    return api.put(`/documents/${id}/`, data);
  },

  delete: (id) => {
    return api.delete(`/documents/${id}/`);
  },
};

export default api;

