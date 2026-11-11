import { dbQuery } from '../config/db.js';
import { getCurrentNetworkState } from './networkController.js';

export async function getSystemReport(req, res) {
  try {
    // 1. Incidents breakdown
    const incidents = await dbQuery('SELECT * FROM incidents');
    const incidentStats = {
      total: incidents.length,
      active: incidents.filter(i => i.incident_status === 'Active' || i.incident_status === 'On Scene' || i.incident_status === 'En Route').length,
      resolved: incidents.filter(i => i.incident_status === 'Resolved' || i.incident_status === 'Closed').length,
      bySeverity: {
        Critical: incidents.filter(i => i.severity === 'Critical').length,
        High: incidents.filter(i => i.severity === 'High').length,
        Medium: incidents.filter(i => i.severity === 'Medium').length,
        Low: incidents.filter(i => i.severity === 'Low').length
      }
    };

    // 2. Hospital statistics
    const hospitals = await dbQuery('SELECT * FROM hospitals');
    const hospitalStats = {
      count: hospitals.length,
      totalBeds: hospitals.reduce((acc, h) => acc + (h.total_beds || 0), 0),
      availableBeds: hospitals.reduce((acc, h) => acc + (h.available_beds || 0), 0),
      totalICU: hospitals.reduce((acc, h) => acc + (h.icu_total || 0), 0),
      availableICU: hospitals.reduce((acc, h) => acc + (h.icu_available || 0), 0),
      totalAmbulances: hospitals.reduce((acc, h) => acc + (h.ambulances_total || 0), 0),
      availableAmbulances: hospitals.reduce((acc, h) => acc + (h.ambulances_available || 0), 0),
      averageOccupancyPct: hospitals.length ? Math.round(
        (1 - (hospitals.reduce((acc, h) => acc + h.available_beds, 0) / hospitals.reduce((acc, h) => acc + h.total_beds, 0))) * 100
      ) : 0
    };

    // 3. Shelter statistics
    const shelters = await dbQuery('SELECT * FROM shelters');
    const shelterStats = {
      count: shelters.length,
      totalCapacity: shelters.reduce((acc, s) => acc + (s.total_capacity || 0), 0),
      currentOccupancy: shelters.reduce((acc, s) => acc + (s.current_occupancy || 0), 0),
      availableCapacity: shelters.reduce((acc, s) => acc + Math.max(0, (s.total_capacity || 0) - (s.current_occupancy || 0)), 0),
      overallOccupancyPct: shelters.length ? Math.round(
        (shelters.reduce((acc, s) => acc + s.current_occupancy, 0) / shelters.reduce((acc, s) => acc + s.total_capacity, 0)) * 100
      ) : 0,
      avgFoodDays: shelters.length ? (shelters.reduce((acc, s) => acc + (s.food_supply_days || 0), 0) / shelters.length).toFixed(1) : 0,
      avgWaterDays: shelters.length ? (shelters.reduce((acc, s) => acc + (s.water_supply_days || 0), 0) / shelters.length).toFixed(1) : 0
    };

    // 4. Responders statistics
    const responders = await dbQuery('SELECT * FROM responders');
    const responderStats = {
      total: responders.length,
      deployed: responders.filter(r => r.availability_status === 'Deployed' || r.availability_status === 'On Scene' || r.availability_status === 'En Route').length,
      available: responders.filter(r => r.availability_status === 'Available').length,
      byDepartment: {
        'Fire & Rescue': responders.filter(r => r.department === 'Fire & Rescue').length,
        'Police & Security': responders.filter(r => r.department === 'Police & Security').length,
        'Medical / EMS': responders.filter(r => r.department === 'Medical / EMS').length,
        'Tactical Comms': responders.filter(r => r.department === 'Tactical Comms').length,
        'Hazmat Response': responders.filter(r => r.department === 'Hazmat Response').length
      }
    };

    // 5. Network telemetry & uptime
    const netState = getCurrentNetworkState();
    const networkStats = {
      uptimePct: 99.4,
      currentHealth: netState.networkHealthPct,
      primaryLink: netState.primaryLinkStatus,
      backupLink: netState.backupLinkStatus,
      activePath: netState.activePath,
      currentLatencyMs: netState.latencyMs,
      packetLossPct: netState.packetLossPct,
      bandwidth: netState.bandwidthMbps,
      failoverReady: true,
      lastFailover: netState.lastFailoverTime || 'None in current operational window'
    };

    res.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        incidentStats,
        hospitalStats,
        shelterStats,
        responderStats,
        networkStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
