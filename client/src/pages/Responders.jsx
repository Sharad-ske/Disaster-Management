import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Radio,
  MapPin,
  Edit,
  Trash2,
  Server,
  Shield,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import {
  getResponders,
  createResponder,
  updateResponder,
  deleteResponder,
  getIncidents
} from '../services/api';

export default function Responders() {
  const [responders, setResponders] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResponder, setSelectedResponder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    department: 'Fire & Rescue',
    assigned_location: '',
    contact_phone: '+1 (555) 701-0000',
    availability_status: 'Available',
    current_assignment: 'Tactical Reserve',
    callsign: 'UNIT-ALPHA',
    vlan: 'VLAN 10 (OPS)',
    ip_address: '10.10.10.88'
  });

  const loadData = async () => {
    try {
      const [rRes, iRes] = await Promise.all([
        getResponders(),
        getIncidents()
      ]);
      if (rRes.data?.success) setResponders(rRes.data.data);
      if (iRes.data?.success) setIncidents(iRes.data.data);
    } catch (err) {
      console.error('Failed to load responders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createResponder(formData);
      if (res.data?.success) {
        setIsCreateModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error('Failed to create responder:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedResponder) return;
    try {
      const res = await updateResponder(selectedResponder.id, formData);
      if (res.data?.success) {
        setIsEditModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error('Failed to update responder:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete responder ${id}?`)) return;
    try {
      await deleteResponder(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete responder:', err);
    }
  };

  const openEditModal = (r) => {
    setSelectedResponder(r);
    setFormData({
      name: r.name,
      department: r.department,
      assigned_location: r.assigned_location,
      contact_phone: r.contact_phone,
      availability_status: r.availability_status,
      current_assignment: r.current_assignment || '',
      callsign: r.callsign || '',
      vlan: r.vlan || 'VLAN 10 (OPS)',
      ip_address: r.ip_address || '10.10.10.88'
    });
    setIsEditModalOpen(true);
  };

  const filteredResponders = responders.filter(r => {
    const matchesDept = selectedDept === 'ALL' || r.department.toUpperCase() === selectedDept;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.callsign?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assigned_location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-secondaryCyan" />
            Field Responders & Tactical Personnel (VLAN 10)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate tactical units, callsigns, radio channels, and assignment deployment.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              department: 'Fire & Rescue',
              assigned_location: '',
              contact_phone: '+1 (555) 701-0000',
              availability_status: 'Available',
              current_assignment: 'Tactical Reserve',
              callsign: `UNIT-${Math.floor(10 + Math.random() * 90)}`,
              vlan: 'VLAN 10 (OPS)',
              ip_address: `10.10.10.${Math.floor(60 + Math.random() * 120)}`
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4" />
          Enlist Field Responder
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-cardNavy p-3.5 rounded-xl border border-borderNavy">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-300 font-medium shrink-0">Department:</span>
          {['ALL', 'FIRE & RESCUE', 'POLICE & SECURITY', 'MEDICAL / EMS', 'TACTICAL COMMS', 'HAZMAT RESPONSE'].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === d
                  ? 'bg-primaryTeal text-darkNavy font-bold shadow'
                  : 'bg-panelNavy text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, ID, callsign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-panelNavy border border-borderNavy rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primaryTeal"
          />
        </div>
      </div>

      {/* Responders Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading field responder roster...</div>
      ) : filteredResponders.length === 0 ? (
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-8 text-center text-slate-400">
          No field personnel found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResponders.map((r) => (
            <div
              key={r.id}
              className="bg-cardNavy border border-borderNavy hover:border-slate-500 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-borderNavy">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-primaryTeal uppercase">
                      {r.id} • {r.callsign}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{r.name}</h3>
                    <span className="text-xs text-slate-400 block">{r.department}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(r)}
                      className="p-1.5 text-slate-400 hover:text-white bg-panelNavy rounded-lg transition-colors"
                      title="Edit responder"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-panelNavy rounded-lg transition-colors"
                      title="Delete responder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StatusBadge status={r.availability_status} />
                  <StatusBadge status={r.vlan} type="vlan" />
                </div>

                {/* Assignment & Location */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-2.5 bg-panelNavy rounded-lg border border-borderNavy">
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Current Assignment</span>
                    <span className="text-slate-200 font-medium block mt-0.5">
                      {r.current_assignment || 'Tactical Standby'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300 pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-primaryTeal" /> Assigned Base:
                    </span>
                    <span className="font-medium text-white">{r.assigned_location}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> Radio / Phone:
                    </span>
                    <span className="font-mono text-slate-300">{r.contact_phone}</span>
                  </div>
                </div>
              </div>

              {/* Network Node Footer */}
              <div className="mt-4 pt-3 border-t border-borderNavy flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-secondaryCyan" /> {r.ip_address}
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Encrypted Link
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Responder Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isCreateModalOpen ? 'Enlist Field Tactical Responder' : `Edit: ${selectedResponder?.name}`}
      >
        <form onSubmit={isCreateModalOpen ? handleCreate : handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name & Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Fire & Rescue">Fire & Rescue</option>
                <option value="Police & Security">Police & Security</option>
                <option value="Medical / EMS">Medical / EMS</option>
                <option value="Tactical Comms">Tactical Comms</option>
                <option value="Hazmat Response">Hazmat Response</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Radio Callsign</label>
              <input
                type="text"
                value={formData.callsign}
                onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
              <select
                value={formData.availability_status}
                onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Available">Available</option>
                <option value="Deployed">Deployed</option>
                <option value="En Route">En Route</option>
                <option value="On Scene">On Scene</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Station / Location</label>
              <input
                type="text"
                required
                value={formData.assigned_location}
                onChange={(e) => setFormData({ ...formData, assigned_location: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">IP Address (VLAN 10)</label>
              <input
                type="text"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Radio / Comms Phone</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Assignment / Mission</label>
            <textarea
              rows={2}
              value={formData.current_assignment}
              onChange={(e) => setFormData({ ...formData, current_assignment: e.target.value })}
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
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
              {isCreateModalOpen ? 'Enlist Responder' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
