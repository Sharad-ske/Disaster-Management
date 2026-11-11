import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Ambulance,
  HeartPulse,
  Activity,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Server
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useNetwork } from '../context/NetworkContext';
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital
} from '../services/api';

export default function Hospitals() {
  const { syncTick } = useNetwork();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_beds: 300,
    available_beds: 50,
    icu_total: 25,
    icu_available: 5,
    oxygen_cylinders: 100,
    oxygen_pct: 90,
    ambulances_total: 10,
    ambulances_available: 4,
    emergency_capacity: 'Normal',
    operational_status: 'Fully Operational',
    contact_number: '+1 (555) 000-0000',
    ip_address: '10.10.20.25',
    vlan: 'VLAN 20 (ADMIN)'
  });

  const loadHospitals = async () => {
    try {
      const res = await getHospitals();
      if (res.data?.success) setHospitals(res.data.data);
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [syncTick]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createHospital(formData);
      if (res.data?.success) {
        setIsCreateModalOpen(false);
        loadHospitals();
      }
    } catch (err) {
      console.error('Failed to create hospital:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedHospital) return;
    try {
      const res = await updateHospital(selectedHospital.id, formData);
      if (res.data?.success) {
        setIsEditModalOpen(false);
        loadHospitals();
      }
    } catch (err) {
      console.error('Failed to update hospital:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete hospital from emergency registry?')) return;
    try {
      await deleteHospital(id);
      loadHospitals();
    } catch (err) {
      console.error('Failed to delete hospital:', err);
    }
  };

  const openEditModal = (hosp) => {
    setSelectedHospital(hosp);
    setFormData({
      name: hosp.name,
      location: hosp.location,
      total_beds: hosp.total_beds,
      available_beds: hosp.available_beds,
      icu_total: hosp.icu_total,
      icu_available: hosp.icu_available,
      oxygen_cylinders: hosp.oxygen_cylinders,
      oxygen_pct: hosp.oxygen_pct,
      ambulances_total: hosp.ambulances_total,
      ambulances_available: hosp.ambulances_available,
      emergency_capacity: hosp.emergency_capacity,
      operational_status: hosp.operational_status,
      contact_number: hosp.contact_number,
      ip_address: hosp.ip_address,
      vlan: hosp.vlan
    });
    setIsEditModalOpen(true);
  };

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.ip_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primaryTeal" />
            Hospital & Trauma Center Directory (VLAN 20)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor ICU capacities, oxygen storage, ambulance availability, and network gateway status.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              location: '',
              total_beds: 300,
              available_beds: 50,
              icu_total: 25,
              icu_available: 5,
              oxygen_cylinders: 100,
              oxygen_pct: 90,
              ambulances_total: 10,
              ambulances_available: 4,
              emergency_capacity: 'Normal',
              operational_status: 'Fully Operational',
              contact_number: '+1 (555) 000-0000',
              ip_address: '10.10.20.25',
              vlan: 'VLAN 20 (ADMIN)'
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4" />
          Add Medical Facility
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-cardNavy p-3 rounded-xl border border-borderNavy">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospitals by name, location, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-panelNavy border border-borderNavy rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primaryTeal"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Total Facilities: <strong className="text-white">{hospitals.length}</strong>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading hospital network...</div>
      ) : filteredHospitals.length === 0 ? (
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-8 text-center text-slate-400">
          No hospital records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hosp) => {
            const bedUsagePct = Math.round(((hosp.total_beds - hosp.available_beds) / hosp.total_beds) * 100);
            return (
              <div
                key={hosp.id}
                className="bg-cardNavy border border-borderNavy hover:border-slate-500 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-borderNavy">
                    <div>
                      <h3 className="text-base font-bold text-white">{hosp.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primaryTeal" />
                        {hosp.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(hosp)}
                        className="p-1.5 text-slate-400 hover:text-white bg-panelNavy rounded-lg transition-colors"
                        title="Edit hospital"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(hosp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-panelNavy rounded-lg transition-colors"
                        title="Delete hospital"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <StatusBadge status={hosp.operational_status} />
                    <StatusBadge status={hosp.emergency_capacity} />
                  </div>

                  {/* Bed Occupancy Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Total Bed Occupancy:</span>
                      <span className="font-bold text-white">
                        {hosp.total_beds - hosp.available_beds} / {hosp.total_beds} ({bedUsagePct}%)
                      </span>
                    </div>
                    <div className="w-full bg-darkNavy h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          bedUsagePct > 85 ? 'bg-red-500' : 'bg-primaryTeal'
                        }`}
                        style={{ width: `${bedUsagePct}%` }}
                      />
                    </div>
                  </div>

                  {/* ICU & Oxygen Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                    <div className="p-2.5 bg-panelNavy rounded-lg border border-borderNavy">
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                        <span>ICU Beds Free</span>
                      </div>
                      <span className="text-base font-bold text-white">
                        {hosp.icu_available} <span className="text-xs text-slate-400">/ {hosp.icu_total}</span>
                      </span>
                    </div>

                    <div className="p-2.5 bg-panelNavy rounded-lg border border-borderNavy">
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Oxygen Tanks</span>
                      </div>
                      <span className="text-base font-bold text-white">
                        {hosp.oxygen_pct}% <span className="text-xs text-slate-400">({hosp.oxygen_cylinders})</span>
                      </span>
                    </div>
                  </div>

                  {/* Ambulances & Contact */}
                  <div className="mt-3.5 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Ambulance className="w-3.5 h-3.5 text-amber-400" /> Ambulances Available:
                      </span>
                      <span className="font-mono font-bold text-white">
                        {hosp.ambulances_available} / {hosp.ambulances_total}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> Hotline:
                      </span>
                      <span className="font-mono text-slate-300">{hosp.contact_number}</span>
                    </div>
                  </div>
                </div>

                {/* Network IP & VLAN Footer */}
                <div className="mt-4 pt-3 border-t border-borderNavy flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Server className="w-3 h-3 text-secondaryCyan" /> {hosp.ip_address}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-panelNavy border border-teal-500/30 text-teal-300">
                    {hosp.vlan}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Hospital Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isCreateModalOpen ? 'Add Emergency Hospital Facility' : `Edit: ${selectedHospital?.name}`}
      >
        <form onSubmit={isCreateModalOpen ? handleCreate : handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital / Clinic Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Geographical Location / Sector</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Beds</label>
              <input
                type="number"
                required
                value={formData.total_beds}
                onChange={(e) => setFormData({ ...formData, total_beds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Available Beds</label>
              <input
                type="number"
                required
                value={formData.available_beds}
                onChange={(e) => setFormData({ ...formData, available_beds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total ICU Beds</label>
              <input
                type="number"
                value={formData.icu_total}
                onChange={(e) => setFormData({ ...formData, icu_total: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Available ICU Beds</label>
              <input
                type="number"
                value={formData.icu_available}
                onChange={(e) => setFormData({ ...formData, icu_available: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Available Ambulances</label>
              <input
                type="number"
                value={formData.ambulances_available}
                onChange={(e) => setFormData({ ...formData, ambulances_available: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Oxygen Supply %</label>
              <input
                type="number"
                value={formData.oxygen_pct}
                onChange={(e) => setFormData({ ...formData, oxygen_pct: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity Status</label>
              <select
                value={formData.emergency_capacity}
                onChange={(e) => setFormData({ ...formData, emergency_capacity: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Normal">Normal</option>
                <option value="Surging">Surging</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operational State</label>
              <select
                value={formData.operational_status}
                onChange={(e) => setFormData({ ...formData, operational_status: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Fully Operational">Fully Operational</option>
                <option value="Emergency Divert">Emergency Divert</option>
                <option value="Degraded">Degraded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">IP Address (VLAN 20)</label>
              <input
                type="text"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-borderNavy">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 bg-panelNavy hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs shadow"
            >
              {isCreateModalOpen ? 'Create Facility' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
