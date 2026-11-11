import React, { useState, useEffect } from 'react';
import {
  Tent,
  Plus,
  Search,
  Users,
  Zap,
  Coffee,
  Droplet,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Server,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useNetwork } from '../context/NetworkContext';
import {
  getShelters,
  createShelter,
  updateShelter,
  deleteShelter
} from '../services/api';

export default function Shelters() {
  const { syncTick } = useNetwork();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_capacity: 1000,
    current_occupancy: 450,
    food_supply_days: 7,
    water_supply_days: 6,
    power_status: 'Auxiliary Generator Active (90%)',
    medical_station: true,
    operational_status: 'Accepting Evacuees',
    contact_person: '',
    contact_phone: '+1 (555) 000-0000',
    ip_address: '10.10.30.40',
    vlan: 'VLAN 30 (PUBLIC)'
  });

  const loadShelters = async () => {
    try {
      const res = await getShelters();
      if (res.data?.success) setShelters(res.data.data);
    } catch (err) {
      console.error('Failed to load shelters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, [syncTick]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createShelter(formData);
      if (res.data?.success) {
        setIsCreateModalOpen(false);
        loadShelters();
      }
    } catch (err) {
      console.error('Failed to create shelter:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedShelter) return;
    try {
      const res = await updateShelter(selectedShelter.id, formData);
      if (res.data?.success) {
        setIsEditModalOpen(false);
        loadShelters();
      }
    } catch (err) {
      console.error('Failed to update shelter:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete shelter from database?')) return;
    try {
      await deleteShelter(id);
      loadShelters();
    } catch (err) {
      console.error('Failed to delete shelter:', err);
    }
  };

  const openEditModal = (s) => {
    setSelectedShelter(s);
    setFormData({
      name: s.name,
      location: s.location,
      total_capacity: s.total_capacity,
      current_occupancy: s.current_occupancy,
      food_supply_days: s.food_supply_days,
      water_supply_days: s.water_supply_days,
      power_status: s.power_status,
      medical_station: s.medical_station === 1 || s.medical_station === true,
      operational_status: s.operational_status,
      contact_person: s.contact_person || '',
      contact_phone: s.contact_phone || '',
      ip_address: s.ip_address,
      vlan: s.vlan
    });
    setIsEditModalOpen(true);
  };

  const filteredShelters = shelters.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ip_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tent className="w-5 h-5 text-secondaryCyan" />
            Disaster Evacuee Shelters Directory (VLAN 30)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track survivor headcounts, food/water logistics, auxiliary generator power, and public Wi-Fi portals.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              location: '',
              total_capacity: 1000,
              current_occupancy: 450,
              food_supply_days: 7,
              water_supply_days: 6,
              power_status: 'Auxiliary Generator Active (90%)',
              medical_station: true,
              operational_status: 'Accepting Evacuees',
              contact_person: '',
              contact_phone: '+1 (555) 000-0000',
              ip_address: '10.10.30.40',
              vlan: 'VLAN 30 (PUBLIC)'
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4" />
          Register New Shelter
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-cardNavy p-3 rounded-xl border border-borderNavy">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shelters by name, location, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-panelNavy border border-borderNavy rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primaryTeal"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Active Shelters: <strong className="text-white">{shelters.length}</strong>
        </div>
      </div>

      {/* Shelters Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading shelter telemetry...</div>
      ) : filteredShelters.length === 0 ? (
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-8 text-center text-slate-400">
          No shelter records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredShelters.map((s) => {
            const occPct = Math.round((s.current_occupancy / (s.total_capacity || 1)) * 100);
            const availableSlots = Math.max(0, s.total_capacity - s.current_occupancy);

            return (
              <div
                key={s.id}
                className="bg-cardNavy border border-borderNavy hover:border-slate-500 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-borderNavy">
                    <div>
                      <h3 className="text-base font-bold text-white">{s.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primaryTeal" />
                        {s.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-slate-400 hover:text-white bg-panelNavy rounded-lg transition-colors"
                        title="Edit shelter"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-panelNavy rounded-lg transition-colors"
                        title="Delete shelter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <StatusBadge status={s.operational_status} />
                    {s.medical_station ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Medical Clinic
                      </span>
                    ) : null}
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Evacuee Occupancy:</span>
                      <span className="font-bold text-white">
                        {s.current_occupancy} / {s.total_capacity} ({occPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-darkNavy h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occPct > 90 ? 'bg-red-500' : occPct > 75 ? 'bg-amber-400' : 'bg-secondaryCyan'
                        }`}
                        style={{ width: `${occPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 text-right font-mono">
                      {availableSlots} beds remaining
                    </div>
                  </div>

                  {/* Logistics Metrics: Food, Water, Power */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                    <div className="p-2.5 bg-panelNavy rounded-lg border border-borderNavy">
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                        <span>Food Rations</span>
                      </div>
                      <span className="text-base font-bold text-white">
                        {s.food_supply_days} <span className="text-xs text-slate-400">days left</span>
                      </span>
                    </div>

                    <div className="p-2.5 bg-panelNavy rounded-lg border border-borderNavy">
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Potable Water</span>
                      </div>
                      <span className="text-base font-bold text-white">
                        {s.water_supply_days} <span className="text-xs text-slate-400">days left</span>
                      </span>
                    </div>
                  </div>

                  {/* Power Generator & Contact */}
                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" /> Power Grid:
                      </span>
                      <span className="text-[11px] text-slate-200 truncate max-w-[170px]" title={s.power_status}>
                        {s.power_status}
                      </span>
                    </div>

                    {s.contact_person && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">Coordinator:</span>
                        <span className="text-slate-200">{s.contact_person}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Network IP & VLAN Footer */}
                <div className="mt-4 pt-3 border-t border-borderNavy flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Server className="w-3 h-3 text-secondaryCyan" /> {s.ip_address}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-panelNavy border border-purple-500/30 text-purple-300">
                    {s.vlan}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Shelter Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isCreateModalOpen ? 'Register Disaster Evacuee Shelter' : `Edit: ${selectedShelter?.name}`}
      >
        <form onSubmit={isCreateModalOpen ? handleCreate : handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Shelter Facility Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Safe Zone</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Capacity</label>
              <input
                type="number"
                required
                value={formData.total_capacity}
                onChange={(e) => setFormData({ ...formData, total_capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Occupancy</label>
              <input
                type="number"
                required
                value={formData.current_occupancy}
                onChange={(e) => setFormData({ ...formData, current_occupancy: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Food Supply (Days)</label>
              <input
                type="number"
                value={formData.food_supply_days}
                onChange={(e) => setFormData({ ...formData, food_supply_days: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Water Supply (Days)</label>
              <input
                type="number"
                value={formData.water_supply_days}
                onChange={(e) => setFormData({ ...formData, water_supply_days: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Power Status</label>
              <input
                type="text"
                value={formData.power_status}
                onChange={(e) => setFormData({ ...formData, power_status: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operational State</label>
              <select
                value={formData.operational_status}
                onChange={(e) => setFormData({ ...formData, operational_status: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Accepting Evacuees">Accepting Evacuees</option>
                <option value="At Capacity">At Capacity</option>
                <option value="Evacuation Imminent">Evacuation Imminent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Shelter Lead / Coordinator</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Coordinator Phone</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="med_station"
              checked={formData.medical_station}
              onChange={(e) => setFormData({ ...formData, medical_station: e.target.checked })}
              className="w-4 h-4 rounded bg-darkNavy border-borderNavy text-primaryTeal focus:ring-0"
            />
            <label htmlFor="med_station" className="text-xs text-slate-300">
              Stationed emergency medical triage unit on-site
            </label>
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
              {isCreateModalOpen ? 'Register Shelter' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
