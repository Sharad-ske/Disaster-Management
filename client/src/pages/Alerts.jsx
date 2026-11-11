import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Plus,
  Radio,
  Filter,
  CheckCircle,
  Bell,
  Clock,
  MapPin,
  Send,
  Search
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useNetwork } from '../context/NetworkContext';
import { getAlerts, createAlert, dismissAlert } from '../services/api';

export default function Alerts() {
  const { activeAlerts } = useNetwork();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    severity: 'High',
    location: '',
    affected_locations: '',
    description: '',
    broadcast_channel: 'ALL NETWORKS (VLAN 10/20/30)'
  });

  const loadAlerts = async () => {
    try {
      const res = await getAlerts();
      if (res.data?.success) {
        setAlerts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleDismiss = async (id) => {
    try {
      await dismissAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: 0 } : a));
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createAlert(formData);
      if (res.data?.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          severity: 'High',
          location: '',
          affected_locations: '',
          description: '',
          broadcast_channel: 'ALL NETWORKS (VLAN 10/20/30)'
        });
        loadAlerts();
      }
    } catch (err) {
      console.error('Failed to broadcast alert:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = selectedSeverity === 'ALL' || a.severity.toUpperCase() === selectedSeverity;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warningOrange" />
            Emergency Alerts & Public Warning System
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast authoritative disaster bulletins across OPS, ADMIN, and PUBLIC VLANs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4" />
          Broadcast New Alert
        </button>
      </div>

      {/* Broadcast Simulator Banner */}
      <div className="bg-panelNavy/60 border border-borderNavy rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/20 text-primaryTeal">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-white block">Common Alerting Protocol (CAP v1.2) Active</span>
            <span className="text-slate-400">
              Alerts propagate instantly via WebSockets and multicast across tactical repeaters and shelter portals.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Broadcast Channels: 3 (VLAN 10, 20, 30)</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-cardNavy p-3.5 rounded-xl border border-borderNavy">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-medium">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedSeverity === sev
                  ? 'bg-primaryTeal text-darkNavy font-bold shadow'
                  : 'bg-panelNavy text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-panelNavy border border-borderNavy rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primaryTeal"
          />
        </div>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading emergency alerts...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-8 text-center text-slate-400">
          No emergency alerts matching the criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-cardNavy border rounded-xl p-5 shadow-lg transition-all ${
                alert.active
                  ? alert.severity === 'Critical'
                    ? 'border-red-500/50 bg-red-950/10'
                    : 'border-borderNavy'
                  : 'border-borderNavy/50 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <StatusBadge status={alert.severity} type="severity" />
                    <h3 className="text-base font-bold text-white">{alert.title}</h3>
                    {!alert.active && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        ARCHIVED / DISMISSED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primaryTeal" />
                      Primary Zone: {alert.location}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span>Affected Sectors: {alert.affected_locations}</span>
                    <span className="text-slate-500">|</span>
                    <span>Channel: {alert.broadcast_channel}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                  {alert.active ? (
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="px-3 py-1 bg-panelNavy hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-borderNavy transition-colors"
                    >
                      Acknowledge / Dismiss
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Alert Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Emergency Warning Bulletin"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Headline / Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. FLASH FLOOD WARNING: Sector 4 Embankment Breach"
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              >
                <option value="Critical">Critical (Immediate Danger)</option>
                <option value="High">High (Severe Impact)</option>
                <option value="Medium">Medium (Advisory)</option>
                <option value="Low">Low (Informational)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Location / Hub</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Sector 4 West Highway"
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Affected Locations / Perimeters</label>
            <input
              type="text"
              required
              value={formData.affected_locations}
              onChange={(e) => setFormData({ ...formData, affected_locations: e.target.value })}
              placeholder="e.g. North Medical Corridor, Shelter B Evacuation Access"
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Broadcast Channels</label>
            <select
              value={formData.broadcast_channel}
              onChange={(e) => setFormData({ ...formData, broadcast_channel: e.target.value })}
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal font-mono"
            >
              <option value="ALL NETWORKS (VLAN 10/20/30)">ALL NETWORKS (VLAN 10/20/30 & PUBLIC CAP)</option>
              <option value="OPS & COMMAND ONLY (VLAN 10)">OPS & COMMAND ONLY (VLAN 10)</option>
              <option value="HOSPITALS & ADMIN (VLAN 20)">HOSPITALS & ADMIN (VLAN 20)</option>
              <option value="SHELTER & PUBLIC WIFI (VLAN 30)">SHELTER & PUBLIC WIFI (VLAN 30)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Description & Instructions</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed instructions for responders, triage teams, and public..."
              className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-xs text-white focus:outline-none focus:border-primaryTeal"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-borderNavy">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-panelNavy hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Broadcasting...' : 'Broadcast Bulletin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
