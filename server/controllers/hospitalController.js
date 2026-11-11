import { dbQuery } from '../config/db.js';

export async function getAllHospitals(req, res) {
  try {
    const hospitals = await dbQuery('SELECT * FROM hospitals ORDER BY id ASC');
    res.json({ success: true, data: hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getHospitalById(req, res) {
  try {
    const rows = await dbQuery('SELECT * FROM hospitals WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createHospital(req, res) {
  try {
    const {
      name, location, total_beds, available_beds, icu_total, icu_available,
      oxygen_cylinders, oxygen_pct, ambulances_total, ambulances_available,
      emergency_capacity, operational_status, contact_number, ip_address, vlan
    } = req.body;

    if (!name || !location || total_beds === undefined || available_beds === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required hospital fields' });
    }

    const result = await dbQuery(
      `INSERT INTO hospitals (name, location, total_beds, available_beds, icu_total, icu_available, oxygen_cylinders, oxygen_pct, ambulances_total, ambulances_available, emergency_capacity, operational_status, contact_number, ip_address, vlan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, location, Number(total_beds), Number(available_beds),
        Number(icu_total || 20), Number(icu_available || 5),
        Number(oxygen_cylinders || 50), Number(oxygen_pct || 90),
        Number(ambulances_total || 10), Number(ambulances_available || 5),
        emergency_capacity || 'Normal', operational_status || 'Fully Operational',
        contact_number || '', ip_address || '10.10.20.50', vlan || 'VLAN 20 (ADMIN)'
      ]
    );

    const newId = result.insertId || result.lastID;
    const [created] = await dbQuery('SELECT * FROM hospitals WHERE id = ?', [newId]);

    // Emit socket event if io is available
    if (req.app.get('io')) {
      req.app.get('io').emit('hospital_updated', { type: 'create', data: created });
    }

    res.status(201).json({ success: true, data: created, message: 'Hospital created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateHospital(req, res) {
  try {
    const { id } = req.params;
    const {
      name, location, total_beds, available_beds, icu_total, icu_available,
      oxygen_cylinders, oxygen_pct, ambulances_total, ambulances_available,
      emergency_capacity, operational_status, contact_number, ip_address, vlan
    } = req.body;

    await dbQuery(
      `UPDATE hospitals SET
        name = COALESCE(?, name),
        location = COALESCE(?, location),
        total_beds = COALESCE(?, total_beds),
        available_beds = COALESCE(?, available_beds),
        icu_total = COALESCE(?, icu_total),
        icu_available = COALESCE(?, icu_available),
        oxygen_cylinders = COALESCE(?, oxygen_cylinders),
        oxygen_pct = COALESCE(?, oxygen_pct),
        ambulances_total = COALESCE(?, ambulances_total),
        ambulances_available = COALESCE(?, ambulances_available),
        emergency_capacity = COALESCE(?, emergency_capacity),
        operational_status = COALESCE(?, operational_status),
        contact_number = COALESCE(?, contact_number),
        ip_address = COALESCE(?, ip_address),
        vlan = COALESCE(?, vlan)
      WHERE id = ?`,
      [
        name, location, total_beds, available_beds, icu_total, icu_available,
        oxygen_cylinders, oxygen_pct, ambulances_total, ambulances_available,
        emergency_capacity, operational_status, contact_number, ip_address, vlan,
        id
      ]
    );

    const [updated] = await dbQuery('SELECT * FROM hospitals WHERE id = ?', [id]);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('hospital_updated', { type: 'update', data: updated });
    }

    res.json({ success: true, data: updated, message: 'Hospital updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteHospital(req, res) {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM hospitals WHERE id = ?', [id]);
    
    if (req.app.get('io')) {
      req.app.get('io').emit('hospital_updated', { type: 'delete', id });
    }
    res.json({ success: true, message: 'Hospital deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
