import { dbQuery } from '../config/db.js';

// In-memory telemetry cache for high-frequency chart updates
let currentNetworkState = {
  primaryLinkStatus: 'Active',
  backupLinkStatus: 'Standby',
  activePath: 'Primary Path (Fiber Backbone - OSPF Cost 10)',
  latencyMs: 2.3,
  packetLossPct: 0.0,
  bandwidthMbps: 940.0,
  jitterMs: 0.3,
  networkHealthPct: 98.6,
  totalDevices: 12,
  connectedDevices: 12,
  lastFailoverTime: null,
  isSimulated: true, // Transparently labeled as required
  telemetrySource: 'Development Simulation Engine (Ready for Python NetNS Daemon)'
};

let telemetryHistory = [];

// Initialize rolling history
for (let i = 24; i >= 0; i--) {
  const time = new Date(Date.now() - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  telemetryHistory.push({
    time,
    latency: +(2.0 + Math.random() * 0.8).toFixed(1),
    packetLoss: 0.0,
    bandwidth: +(920 + Math.random() * 30).toFixed(0),
    link: 'Primary'
  });
}

export function getCurrentNetworkState() {
  return currentNetworkState;
}

export function pushTelemetryPoint(point) {
  telemetryHistory.push(point);
  if (telemetryHistory.length > 40) {
    telemetryHistory.shift();
  }
}

export async function getNetworkDevices(req, res) {
  try {
    const devices = await dbQuery('SELECT * FROM network_devices ORDER BY ip_address ASC');
    res.json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getNetworkLinks(req, res) {
  try {
    const links = await dbQuery('SELECT * FROM network_links');
    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getNetworkStatus(req, res) {
  try {
    const [devCounts] = await dbQuery('SELECT COUNT(*) as total, SUM(CASE WHEN status = "Online" THEN 1 ELSE 0 END) as connected FROM network_devices');
    const [links] = await dbQuery('SELECT * FROM network_links WHERE id IN ("link-wan-primary", "link-wan-backup")');
    
    const primary = links.find(l => l.id === 'link-wan-primary');
    const backup = links.find(l => l.id === 'link-wan-backup');

    const total = devCounts?.total || 12;
    const connected = devCounts?.connected || 12;

    res.json({
      success: true,
      data: {
        ...currentNetworkState,
        totalDevices: total,
        connectedDevices: connected,
        primaryLink: primary || { status: currentNetworkState.primaryLinkStatus },
        backupLink: backup || { status: currentNetworkState.backupLinkStatus },
        history: telemetryHistory
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleLinkFailover(req, res) {
  try {
    const { action } = req.body; // 'cut' or 'restore'
    const io = req.app.get('io');

    if (action === 'cut') {
      // Simulate physical backhaul fiber severed
      currentNetworkState.primaryLinkStatus = 'Failed';
      currentNetworkState.backupLinkStatus = 'Active';
      currentNetworkState.activePath = 'Backup Path (Satellite/Radio Gateway - OSPF Cost 100)';
      currentNetworkState.latencyMs = 354.2;
      currentNetworkState.packetLossPct = 2.4;
      currentNetworkState.bandwidthMbps = 4.8;
      currentNetworkState.jitterMs = 18.5;
      currentNetworkState.networkHealthPct = 84.2;
      currentNetworkState.lastFailoverTime = new Date().toISOString();

      await dbQuery('UPDATE network_links SET status = "Failed", latency_ms = 0 WHERE id = "link-wan-primary"');
      await dbQuery('UPDATE network_links SET status = "Active", latency_ms = 350.0 WHERE id = "link-wan-backup"');

      // Log to database
      await dbQuery(
        `INSERT INTO telemetry_logs (primary_link_status, backup_link_status, active_path, latency_ms, packet_loss_pct, bandwidth_mbps, jitter_ms, is_simulated)
         VALUES ('Failed', 'Active', 'Backup Path (Satellite Gateway)', 354.2, 2.4, 4.8, 18.5, 1)`
      );

      const alertPayload = {
        title: 'CRITICAL ALERT: Primary Fiber WAN Link Severed!',
        severity: 'Critical',
        location: 'WAN Backbone (10.0.1.0/30)',
        message: 'OSPF dynamic routing engaged satellite/radio backup (10.0.2.0/30). Latency degraded to ~350ms, bandwidth throttled to 5Mbps.',
        timestamp: new Date().toISOString()
      };

      if (io) {
        io.emit('network_failover_event', {
          event: 'PRIMARY_LINK_FAILED',
          state: currentNetworkState,
          alert: alertPayload
        });
      }

      return res.json({
        success: true,
        message: 'Primary fiber link severed. Dynamic OSPF failover engaged satellite gateway.',
        state: currentNetworkState
      });
    } else {
      // Restore primary link
      currentNetworkState.primaryLinkStatus = 'Active';
      currentNetworkState.backupLinkStatus = 'Standby';
      currentNetworkState.activePath = 'Primary Path (Fiber Backbone - OSPF Cost 10)';
      currentNetworkState.latencyMs = 2.4;
      currentNetworkState.packetLossPct = 0.0;
      currentNetworkState.bandwidthMbps = 945.0;
      currentNetworkState.jitterMs = 0.4;
      currentNetworkState.networkHealthPct = 98.8;

      await dbQuery('UPDATE network_links SET status = "Active", latency_ms = 2.2 WHERE id = "link-wan-primary"');
      await dbQuery('UPDATE network_links SET status = "Standby", latency_ms = 350.0 WHERE id = "link-wan-backup"');

      await dbQuery(
        `INSERT INTO telemetry_logs (primary_link_status, backup_link_status, active_path, latency_ms, packet_loss_pct, bandwidth_mbps, jitter_ms, is_simulated)
         VALUES ('Active', 'Standby', 'Primary Path (Fiber Backbone)', 2.4, 0.0, 945.0, 0.4, 1)`
      );

      const alertPayload = {
        title: 'RESTORATION: Primary WAN Fiber Link Restored',
        severity: 'Low',
        location: 'WAN Backbone (10.0.1.0/30)',
        message: 'OSPF adjacency re-established over primary fiber link. Traffic preemptively returned to high-speed path.',
        timestamp: new Date().toISOString()
      };

      if (io) {
        io.emit('network_failover_event', {
          event: 'PRIMARY_LINK_RESTORED',
          state: currentNetworkState,
          alert: alertPayload
        });
      }

      return res.json({
        success: true,
        message: 'Primary fiber link restored. High-speed OSPF route re-established.',
        state: currentNetworkState
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateDeviceStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await dbQuery('UPDATE network_devices SET status = ?, last_seen = datetime("now") WHERE id = ?', [status, id]);
    const [updated] = await dbQuery('SELECT * FROM network_devices WHERE id = ?', [id]);

    if (req.app.get('io')) {
      req.app.get('io').emit('device_status_changed', updated);
    }

    res.json({ success: true, data: updated, message: 'Device status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Telemetry ingestion endpoint for the actual Python Network Monitor Daemon
export async function ingestTelemetry(req, res) {
  try {
    const {
      primaryLinkStatus,
      backupLinkStatus,
      latencyMs,
      packetLossPct,
      bandwidthMbps,
      jitterMs,
      source
    } = req.body;

    currentNetworkState = {
      ...currentNetworkState,
      primaryLinkStatus: primaryLinkStatus || currentNetworkState.primaryLinkStatus,
      backupLinkStatus: backupLinkStatus || currentNetworkState.backupLinkStatus,
      latencyMs: Number(latencyMs || currentNetworkState.latencyMs),
      packetLossPct: Number(packetLossPct || 0),
      bandwidthMbps: Number(bandwidthMbps || currentNetworkState.bandwidthMbps),
      jitterMs: Number(jitterMs || 0.5),
      isSimulated: false, // LIVE TELEMETRY from Python Daemon!
      telemetrySource: source || 'Live Linux NetNS / CORE Telemetry Daemon'
    };

    const point = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latency: currentNetworkState.latencyMs,
      packetLoss: currentNetworkState.packetLossPct,
      bandwidth: currentNetworkState.bandwidthMbps,
      link: currentNetworkState.primaryLinkStatus === 'Active' ? 'Primary' : 'Backup'
    };

    pushTelemetryPoint(point);

    if (req.app.get('io')) {
      req.app.get('io').emit('telemetry_tick', {
        state: currentNetworkState,
        point
      });
    }

    res.json({ success: true, message: 'Live telemetry ingested' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getTelemetryHistory(req, res) {
  try {
    res.json({
      success: true,
      data: {
        currentState: currentNetworkState,
        history: telemetryHistory
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
