import express from 'express';
import {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
} from '../controllers/hospitalController.js';
import {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter
} from '../controllers/shelterController.js';
import {
  getAllResponders,
  getResponderById,
  createResponder,
  updateResponder,
  deleteResponder
} from '../controllers/responderController.js';
import {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident
} from '../controllers/incidentController.js';
import {
  getAllAlerts,
  createAlert,
  dismissAlert
} from '../controllers/alertController.js';
import {
  getNetworkDevices,
  getNetworkLinks,
  getNetworkStatus,
  toggleLinkFailover,
  updateDeviceStatus,
  ingestTelemetry,
  getTelemetryHistory
} from '../controllers/networkController.js';
import { getSystemReport } from '../controllers/reportController.js';

const router = express.Router();

// 1. Hospitals API
router.get('/hospitals', getAllHospitals);
router.get('/hospitals/:id', getHospitalById);
router.post('/hospitals', createHospital);
router.put('/hospitals/:id', updateHospital);
router.delete('/hospitals/:id', deleteHospital);

// 2. Disaster Shelters API
router.get('/shelters', getAllShelters);
router.get('/shelters/:id', getShelterById);
router.post('/shelters', createShelter);
router.put('/shelters/:id', updateShelter);
router.delete('/shelters/:id', deleteShelter);

// 3. Responders API
router.get('/responders', getAllResponders);
router.get('/responders/:id', getResponderById);
router.post('/responders', createResponder);
router.put('/responders/:id', updateResponder);
router.delete('/responders/:id', deleteResponder);

// 4. Incidents API
router.get('/incidents', getAllIncidents);
router.get('/incidents/:id', getIncidentById);
router.post('/incidents', createIncident);
router.put('/incidents/:id', updateIncident);
router.delete('/incidents/:id', deleteIncident);

// 5. Alerts API
router.get('/alerts', getAllAlerts);
router.post('/alerts', createAlert);
router.put('/alerts/:id/dismiss', dismissAlert);

// 6. Network API
router.get('/network/devices', getNetworkDevices);
router.put('/network/devices/:id/status', updateDeviceStatus);
router.get('/network/links', getNetworkLinks);
router.get('/network/status', getNetworkStatus);
router.post('/network/failover', toggleLinkFailover);
router.post('/network/telemetry', ingestTelemetry);
router.get('/network/telemetry/history', getTelemetryHistory);

// 7. Reports API
router.get('/reports', getSystemReport);

export default router;
