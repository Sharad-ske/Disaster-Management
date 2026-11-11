import { dbQuery } from '../config/db.js';

export async function getAllIncidents(req, res) {
  try {
    const incidents = await dbQuery('SELECT * FROM incidents ORDER BY reported_time DESC');
    // Format JSON array for assigned_responders
    const formatted = incidents.map(inc => {
      let respondersList = [];
      try {
        respondersList = typeof inc.assigned_responders === 'string' ? JSON.parse(inc.assigned_responders) : (inc.assigned_responders || []);
      } catch (e) {
        respondersList = inc.assigned_responders ? [inc.assigned_responders] : [];
      }
      return {
        ...inc,
        assigned_responders: respondersList
      };
    });
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getIncidentById(req, res) {
  try {
    const rows = await dbQuery('SELECT * FROM incidents WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    const inc = rows[0];
    let respondersList = [];
    try {
      respondersList = typeof inc.assigned_responders === 'string' ? JSON.parse(inc.assigned_responders) : (inc.assigned_responders || []);
    } catch (e) {
      respondersList = [];
    }
    res.json({ success: true, data: { ...inc, assigned_responders: respondersList } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createIncident(req, res) {
  try {
    const {
      name, location, severity, incident_status, assigned_responders,
      description, affected_sector, reported_by
    } = req.body;

    const incId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (!name || !location || !severity) {
      return res.status(400).json({ success: false, message: 'Missing required incident fields' });
    }

    const respondersJson = JSON.stringify(Array.isArray(assigned_responders) ? assigned_responders : []);

    await dbQuery(
      `INSERT INTO incidents (id, name, location, severity, incident_status, reported_time, assigned_responders, description, affected_sector, reported_by)
       VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?)`,
      [
        incId, name, location, severity, incident_status || 'Active',
        respondersJson, description || '', affected_sector || 'General', reported_by || 'EOC Dispatcher'
      ]
    );

    const [created] = await dbQuery('SELECT * FROM incidents WHERE id = ?', [incId]);
    const payload = {
      ...created,
      assigned_responders: Array.isArray(assigned_responders) ? assigned_responders : []
    };

    if (req.app.get('io')) {
      req.app.get('io').emit('incident_updated', { type: 'create', data: payload });
    }

    res.status(201).json({ success: true, data: payload, message: 'Incident created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateIncident(req, res) {
  try {
    const { id } = req.params;
    const {
      name, location, severity, incident_status, assigned_responders,
      description, affected_sector, reported_by
    } = req.body;

    let respondersJson = null;
    if (assigned_responders !== undefined) {
      respondersJson = JSON.stringify(Array.isArray(assigned_responders) ? assigned_responders : []);
    }

    await dbQuery(
      `UPDATE incidents SET
        name = COALESCE(?, name),
        location = COALESCE(?, location),
        severity = COALESCE(?, severity),
        incident_status = COALESCE(?, incident_status),
        assigned_responders = COALESCE(?, assigned_responders),
        description = COALESCE(?, description),
        affected_sector = COALESCE(?, affected_sector),
        reported_by = COALESCE(?, reported_by)
      WHERE id = ?`,
      [
        name, location, severity, incident_status,
        respondersJson, description, affected_sector, reported_by,
        id
      ]
    );

    const [updated] = await dbQuery('SELECT * FROM incidents WHERE id = ?', [id]);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    let parsedResponders = [];
    try {
      parsedResponders = JSON.parse(updated.assigned_responders);
    } catch (e) {
      parsedResponders = [];
    }

    const payload = { ...updated, assigned_responders: parsedResponders };

    if (req.app.get('io')) {
      req.app.get('io').emit('incident_updated', { type: 'update', data: payload });
    }

    res.json({ success: true, data: payload, message: 'Incident updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteIncident(req, res) {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM incidents WHERE id = ?', [id]);
    if (req.app.get('io')) {
      req.app.get('io').emit('incident_updated', { type: 'delete', id });
    }
    res.json({ success: true, message: 'Incident deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
