import { dbQuery } from '../config/db.js';

export async function getAllResponders(req, res) {
  try {
    const responders = await dbQuery('SELECT * FROM responders ORDER BY id ASC');
    res.json({ success: true, data: responders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getResponderById(req, res) {
  try {
    const rows = await dbQuery('SELECT * FROM responders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Responder not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createResponder(req, res) {
  try {
    const {
      id, name, department, assigned_location, contact_phone,
      availability_status, current_assignment, callsign, vlan, ip_address
    } = req.body;

    const respId = id || `RESP-${Math.floor(100 + Math.random() * 900)}`;

    if (!name || !department || !assigned_location) {
      return res.status(400).json({ success: false, message: 'Missing required responder fields' });
    }

    await dbQuery(
      `INSERT INTO responders (id, name, department, assigned_location, contact_phone, availability_status, current_assignment, callsign, vlan, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        respId, name, department, assigned_location, contact_phone || '+1 (555) 000-0000',
        availability_status || 'Available', current_assignment || 'Tactical Standby',
        callsign || `UNIT-${respId}`, vlan || 'VLAN 10 (OPS)', ip_address || '10.10.10.99'
      ]
    );

    const [created] = await dbQuery('SELECT * FROM responders WHERE id = ?', [respId]);

    if (req.app.get('io')) {
      req.app.get('io').emit('responder_updated', { type: 'create', data: created });
    }

    res.status(201).json({ success: true, data: created, message: 'Responder created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateResponder(req, res) {
  try {
    const { id } = req.params;
    const {
      name, department, assigned_location, contact_phone,
      availability_status, current_assignment, callsign, vlan, ip_address
    } = req.body;

    await dbQuery(
      `UPDATE responders SET
        name = COALESCE(?, name),
        department = COALESCE(?, department),
        assigned_location = COALESCE(?, assigned_location),
        contact_phone = COALESCE(?, contact_phone),
        availability_status = COALESCE(?, availability_status),
        current_assignment = COALESCE(?, current_assignment),
        callsign = COALESCE(?, callsign),
        vlan = COALESCE(?, vlan),
        ip_address = COALESCE(?, ip_address)
      WHERE id = ?`,
      [
        name, department, assigned_location, contact_phone,
        availability_status, current_assignment, callsign, vlan, ip_address,
        id
      ]
    );

    const [updated] = await dbQuery('SELECT * FROM responders WHERE id = ?', [id]);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Responder not found' });
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('responder_updated', { type: 'update', data: updated });
    }

    res.json({ success: true, data: updated, message: 'Responder updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteResponder(req, res) {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM responders WHERE id = ?', [id]);
    if (req.app.get('io')) {
      req.app.get('io').emit('responder_updated', { type: 'delete', id });
    }
    res.json({ success: true, message: 'Responder deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
