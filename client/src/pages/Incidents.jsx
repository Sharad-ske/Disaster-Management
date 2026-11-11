import React, { useState, useEffect } from 'react';
import {
  Flame,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useNetwork } from '../context/NetworkContext';
import {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  getResponders
} from '../services/api';

export default function Incidents() {
  const { syncTick } = useNetwork();
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    severity: 'High',
    incident_status: 'Active',
    description: '',
    affected_sector: 'Sector 4',
    assigned_responders: []
  });

  const loadData = async () => {
    try {
      const [iRes, rRes] = await Promise.all([
        getIncidents(),
        getResponders()
      ]);
      if (iRes.data?.success) setIncidents(iRes.data.data);
      if (rRes.data?.success) setResponders(rRes.data.data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [syncTick]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createIncident(formData);
      if (res.data?.success) {
        setIsCreateModalOpen(false);
        setFormData({
          name: '',
          location: '',
          severity: 'High',
          incident_status: 'Active',
          description: '',
          affected_sector: 'Sector 4',
          assigned_responders: []
        });
        loadData();
      }
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedIncident) return;
    try {
      const res = await updateIncident(selectedIncident.id, formData);
      if (res.data?.success) {
        setIsEditModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error('Failed to update incident:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident log?')) return;
    try {
      await deleteIncident(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete incident:', err);
    }
  };

  const openEditModal = (inc) => {
    setSelectedIncident(inc);
    setFormData({
      name: inc.name,
      location: inc.location,
      severity: inc.severity,
      incident_status: inc.incident_status,
      description: inc.description || '',
      affected_sector: inc.affected_sector || '',
      assigned_responders: inc.assigned_responders || []
    });
    setIsEditModalOpen(true);
  };

  const toggleResponderSelection = (respId) => {
    setFormData(prev => {
      const current = prev.assigned_responders || [];
      const exists = current.includes(respId);
      return {
        ...prev,
        assigned_responders: exists ? current.filter(id => id !== respId) : [...current, respId]
      };
    });
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesStatus = selectedStatus === 'ALL' || inc.incident_status.toUpperCase() === selectedStatus;
    const matchesSearch =
      inc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-dangerRed" />
            Incident Command & Triage Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log disaster incidents, deploy response teams, and monitor emergency resolution progress.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              location: '',
              severity: 'High',
              incident_status: 'Active',
              description: '',
              affected_sector: 'Sector 4',
              assigned_responders: []
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4" />
          Log New Incident
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-cardNavy p-3.5 rounded-xl border border-borderNavy">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-300 font-medium shrink-0">Status:</span>
          {['ALL', 'ACTIVE', 'EN ROUTE', 'ON SCENE', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-primaryTeal text-darkNavy font-bold shadow'
                  : 'bg-panelNavy text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident name, ID, sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-panelNavy border border-borderNavy rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primaryTeal"
          />
        </div>
      </div>

      {/* Incidents Table / Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading incident registry...</div>
      ) : filteredIncidents.length === 0 ? (
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-8 text-center text-slate-400">
          No emergency incidents found.
        </div>
      ) : (
        <div className="bg-cardNavy border border-borderNavy rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-panelNavy text-slate-400 uppercase tracking-wider font-mono border-b border-borderNavy">
                <tr>
                  <th className="px-5 py-3.5">Incident ID / Title</th>
                  <th className="px-4 py-3.5">Severity</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Assigned Responders</th>
                  <th className="px-4 py-3.5">Reported</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNavy text-slate-300">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-panelNavy/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-primaryTeal font-bold block">
                          {inc.id}
                        </span>
                        <span className="font-bold text-white text-xs block">{inc.name}</span>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{inc.description}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={inc.severity} type="severity" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primaryTeal shrink-0" />
                        <span className="font-medium text-slate-200">{inc.location}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        Sector: {inc.affected_sector || 'General'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={inc.incident_status} />
                    </td>

                    <td className="px-4 py-4 font-mono">
                      {inc.assigned_responders && inc.assigned_responders.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {inc.assigned_responders.map((rId) => (
                            <span
                              key={rId}
                              className="px-2 py-0.5 rounded bg-panelNavy border border-cyan-500/30 text-cyan-300 text-[10px]"
                            >
                              {rId}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-400 font-mono text-[11px]">
                      {new Date(inc.reported_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(inc)}
                          className="p-1.5 text-slate-400 hover:text-white bg-panelNavy hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit incident"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 bg-panelNavy hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete incident"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Incident Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isCreateModalOpen ? 'Create Emergency Incident Record' : `Edit Incident: ${selectedIncident?.id}`}
      >
        <form onSubmit={isCreateModalOpen ? handleCreate : handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Name / Summary</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Chemical Tanker Overturn & Fire"
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Priority</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Status</label>
              <select
                value={formData.incident_status}
                onChange={(e) => setFormData({ ...formData, incident_status: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Active">Active</option>
                <option value="En Route">En Route</option>
                <option value="On Scene">On Scene</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Sector 9 Industrial Corridor"
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sector Zone</label>
              <input
                type="text"
                value={formData.affected_sector}
                onChange={(e) => setFormData({ ...formData, affected_sector: e.target.value })}
                placeholder="e.g. Sector 9"
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Responders</label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-darkNavy rounded-lg border border-borderNavy">
              {responders.map((resp) => {
                const isSelected = formData.assigned_responders?.includes(resp.id);
                return (
                  <button
                    type="button"
                    key={resp.id}
                    onClick={() => toggleResponderSelection(resp.id)}
                    className={`p-2 rounded border text-left text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-primaryTeal/20 border-primaryTeal text-white'
                        : 'bg-panelNavy border-borderNavy text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{resp.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{resp.id} • {resp.department}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primaryTeal" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Description & Field Notes</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Reported hazards, casualties, structural damage..."
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
              {isCreateModalOpen ? 'Create Incident' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
