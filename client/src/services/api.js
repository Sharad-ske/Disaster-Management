import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Hospitals
export const getHospitals = () => api.get('/hospitals');
export const createHospital = (data) => api.post('/hospitals', data);
export const updateHospital = (id, data) => api.put(`/hospitals/${id}`, data);
export const deleteHospital = (id) => api.delete(`/hospitals/${id}`);

// Shelters
export const getShelters = () => api.get('/shelters');
export const createShelter = (data) => api.post('/shelters', data);
export const updateShelter = (id, data) => api.put(`/shelters/${id}`, data);
export const deleteShelter = (id) => api.delete(`/shelters/${id}`);

// Responders
export const getResponders = () => api.get('/responders');
export const createResponder = (data) => api.post('/responders', data);
export const updateResponder = (id, data) => api.put(`/responders/${id}`, data);
export const deleteResponder = (id) => api.delete(`/responders/${id}`);

// Incidents
export const getIncidents = () => api.get('/incidents');
export const createIncident = (data) => api.post('/incidents', data);
export const updateIncident = (id, data) => api.put(`/incidents/${id}`, data);
export const deleteIncident = (id) => api.delete(`/incidents/${id}`);

// Alerts
export const getAlerts = () => api.get('/alerts');
export const createAlert = (data) => api.post('/alerts', data);
export const dismissAlert = (id) => api.put(`/alerts/${id}/dismiss`);

// Network & Telemetry
export const getNetworkDevices = () => api.get('/network/devices');
export const updateDeviceStatus = (id, status) => api.put(`/network/devices/${id}/status`, { status });
export const getNetworkLinks = () => api.get('/network/links');
export const getNetworkStatus = () => api.get('/network/status');
export const triggerFailover = (action) => api.post('/network/failover', { action });
export const getTelemetryHistory = () => api.get('/network/telemetry/history');

// Reports
export const getSystemReport = () => api.get('/reports');

export default api;
