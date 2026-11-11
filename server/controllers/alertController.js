import { dbQuery } from '../config/db.js';

export async function getAllAlerts(req, res) {
  try {
    const alerts = await dbQuery('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createAlert(req, res) {
  try {
    const { title, severity, location, affected_locations, description, broadcast_channel } = req.body;

    if (!title || !severity || !location || !description) {
      return res.status(400).json({ success: false, message: 'Missing required alert fields' });
    }

    const result = await dbQuery(
      `INSERT INTO alerts (title, severity, location, affected_locations, description, broadcast_channel, active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
      [
        title, severity, location, affected_locations || location,
        description, broadcast_channel || 'ALL NETWORKS (VLAN 10/20/30)'
      ]
    );

    const newId = result.insertId || result.lastID;
    const [created] = await dbQuery('SELECT * FROM alerts WHERE id = ?', [newId]);

    if (req.app.get('io')) {
      req.app.get('io').emit('alert_broadcast', created);
    }

    res.status(201).json({ success: true, data: created, message: 'Alert broadcasted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function dismissAlert(req, res) {
  try {
    const { id } = req.params;
    await dbQuery('UPDATE alerts SET active = 0 WHERE id = ?', [id]);
    
    if (req.app.get('io')) {
      req.app.get('io').emit('alert_dismissed', { id });
    }
    res.json({ success: true, message: 'Alert dismissed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
