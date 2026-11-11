import { dbQuery } from '../config/db.js';

export async function getAllShelters(req, res) {
  try {
    const shelters = await dbQuery('SELECT * FROM shelters ORDER BY id ASC');
    res.json({ success: true, data: shelters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getShelterById(req, res) {
  try {
    const rows = await dbQuery('SELECT * FROM shelters WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createShelter(req, res) {
  try {
    const {
      name, location, total_capacity, current_occupancy, food_supply_days,
      water_supply_days, power_status, medical_station, operational_status,
      contact_person, contact_phone, ip_address, vlan
    } = req.body;

    if (!name || !location || total_capacity === undefined || current_occupancy === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required shelter fields' });
    }

    const result = await dbQuery(
      `INSERT INTO shelters (name, location, total_capacity, current_occupancy, food_supply_days, water_supply_days, power_status, medical_station, operational_status, contact_person, contact_phone, ip_address, vlan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, location, Number(total_capacity), Number(current_occupancy),
        Number(food_supply_days || 5), Number(water_supply_days || 5),
        power_status || 'Auxiliary Generator Active (90%)',
        medical_station ? 1 : 0, operational_status || 'Accepting Evacuees',
        contact_person || '', contact_phone || '', ip_address || '10.10.30.50',
        vlan || 'VLAN 30 (PUBLIC)'
      ]
    );

    const newId = result.insertId || result.lastID;
    const [created] = await dbQuery('SELECT * FROM shelters WHERE id = ?', [newId]);

    if (req.app.get('io')) {
      req.app.get('io').emit('shelter_updated', { type: 'create', data: created });
    }

    res.status(201).json({ success: true, data: created, message: 'Shelter created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateShelter(req, res) {
  try {
    const { id } = req.params;
    const {
      name, location, total_capacity, current_occupancy, food_supply_days,
      water_supply_days, power_status, medical_station, operational_status,
      contact_person, contact_phone, ip_address, vlan
    } = req.body;

    await dbQuery(
      `UPDATE shelters SET
        name = COALESCE(?, name),
        location = COALESCE(?, location),
        total_capacity = COALESCE(?, total_capacity),
        current_occupancy = COALESCE(?, current_occupancy),
        food_supply_days = COALESCE(?, food_supply_days),
        water_supply_days = COALESCE(?, water_supply_days),
        power_status = COALESCE(?, power_status),
        medical_station = COALESCE(?, medical_station),
        operational_status = COALESCE(?, operational_status),
        contact_person = COALESCE(?, contact_person),
        contact_phone = COALESCE(?, contact_phone),
        ip_address = COALESCE(?, ip_address),
        vlan = COALESCE(?, vlan)
      WHERE id = ?`,
      [
        name, location, total_capacity, current_occupancy, food_supply_days,
        water_supply_days, power_status, medical_station !== undefined ? (medical_station ? 1 : 0) : null,
        operational_status, contact_person, contact_phone, ip_address, vlan,
        id
      ]
    );

    const [updated] = await dbQuery('SELECT * FROM shelters WHERE id = ?', [id]);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('shelter_updated', { type: 'update', data: updated });
    }

    res.json({ success: true, data: updated, message: 'Shelter updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteShelter(req, res) {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM shelters WHERE id = ?', [id]);
    if (req.app.get('io')) {
      req.app.get('io').emit('shelter_updated', { type: 'delete', id });
    }
    res.json({ success: true, message: 'Shelter deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
