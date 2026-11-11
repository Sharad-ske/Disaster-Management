import React, { useState, useEffect } from 'react';
import {
  Server,
  Building2,
  Tent,
  Flame,
  Users,
  Activity,
  Wifi,
  Radio,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { useNetwork } from '../context/NetworkContext';
import {
  getHospitals,
  getShelters,
  getIncidents,
  getResponders,
  getAlerts
} from '../services/api';

export default function Overview() {
  const { networkStatus, handleFailoverToggle, isFailoverLoading } = useNetwork();

  const [hospitals, setHospitals] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [hRes, sRes, iRes, rRes, aRes] = await Promise.all([
          getHospitals(),
          getShelters(),
          getIncidents(),
          getResponders(),
          getAlerts()
        ]);

        if (hRes.data?.success) setHospitals(hRes.data.data);
        if (sRes.data?.success) setShelters(sRes.data.data);
        if (iRes.data?.success) setIncidents(iRes.data.data);
        if (rRes.data?.success) setResponders(rRes.data.data);
        if (aRes.data?.success) setAlerts(aRes.data.data);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute calculated metrics
  const totalShelterCapacity = shelters.reduce((acc, s) => acc + s.total_capacity, 0);
  const currentShelterOccupancy = shelters.reduce((acc, s) => acc + s.current_occupancy, 0);
  const availableShelterCapacity = Math.max(0, totalShelterCapacity - currentShelterOccupancy);

  const activeIncidents = incidents.filter(i => i.incident_status !== 'Resolved' && i.incident_status !== 'Closed');
  const availableResponders = responders.filter(r => r.availability_status === 'Available');

  const incidentsBySeverity = {
    Critical: incidents.filter(i => i.severity === 'Critical').length,
    High: incidents.filter(i => i.severity === 'High').length,
    Medium: incidents.filter(i => i.severity === 'Medium').length,
    Low: incidents.filter(i => i.severity === 'Low').length
  };

  const isFiberActive = networkStatus.primaryLinkStatus === 'Active';

  return (
    <div className="space-y-6">
      {/* Page Title & Emergency Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-primaryTeal" />
            EOC Emergency Operations Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time synchronization between incident command, medical infrastructure, and network links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Simulation Status:</span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono">
            {networkStatus.isSimulated ? 'DEVELOPMENT SAMPLE DATA' : 'LIVE NETWORK TELEMETRY'}
          </span>
        </div>
      </div>

      {/* 1. KEY STATISTICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Devices"
          value={networkStatus.totalDevices || 12}
          subtext="VLAN 10/20/30 Nodes"
          icon={Server}
          color="cyan"
        />
        <StatCard
          title="Connected"
          value={networkStatus.connectedDevices || 12}
          subtext="100% Reachable"
          icon={ShieldCheck}
          color="green"
        />
        <StatCard
          title="Active Hospitals"
          value={hospitals.length}
          subtext={`${hospitals.reduce((acc, h) => acc + h.available_beds, 0)} Beds Free`}
          icon={Building2}
          color="teal"
        />
        <StatCard
          title="Shelter Space"
          value={availableShelterCapacity}
          subtext={`of ${totalShelterCapacity} Max`}
          icon={Tent}
          color="blue"
        />
        <StatCard
          title="Active Incidents"
          value={activeIncidents.length}
          subtext={`${incidentsBySeverity.Critical} Critical priority`}
          icon={Flame}
          color="red"
        />
        <StatCard
          title="Available Units"
          value={availableResponders.length}
          subtext={`of ${responders.length} Field staff`}
          icon={Users}
          color="orange"
        />
      </div>

      {/* 2. MAIN SECTIONS GRID: NETWORK CONNECTIVITY & HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Connectivity & Link Failover Card */}
        <div className="lg:col-span-2 bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-secondaryCyan" />
              <h3 className="text-base font-semibold text-white">WAN Backbone Connectivity</h3>
            </div>
            <Link
              to="/topology"
              className="text-xs text-secondaryCyan hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              Interactive Topology <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Primary Fiber Link */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                isFiberActive
                  ? 'bg-panelNavy border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : 'bg-panelNavy/60 border-red-500/40 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Primary Path (Fiber Backbone)
                </span>
                <StatusBadge status={isFiberActive ? 'Active' : 'Failed'} />
              </div>
              <div className="mt-3 space-y-1 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subnet:</span>
                  <span>10.0.1.0/30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OSPF Metric:</span>
                  <span>Cost 10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bandwidth / RTT:</span>
                  <span>{isFiberActive ? `${networkStatus.bandwidthMbps} Mbps / ${networkStatus.latencyMs}ms` : '0 Mbps / Link Down'}</span>
                </div>
              </div>
            </div>

            {/* Backup Satellite Link */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                !isFiberActive
                  ? 'bg-panelNavy border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-panelNavy/60 border-borderNavy'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Backup Path (Satellite / Radio)
                </span>
                <StatusBadge status={!isFiberActive ? 'Active' : 'Standby'} />
              </div>
              <div className="mt-3 space-y-1 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subnet:</span>
                  <span>10.0.2.0/30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OSPF Metric:</span>
                  <span>Cost 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bandwidth / RTT:</span>
                  <span>{!isFiberActive ? `${networkStatus.bandwidthMbps} Mbps / ${networkStatus.latencyMs}ms` : '5 Mbps / 350ms (Standby)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulation Trigger Bar */}
          <div className="mt-4 p-3 bg-panelNavy/80 rounded-lg border border-borderNavy flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-300">
              Active Path: <strong className="text-white font-mono">{networkStatus.activePath}</strong>
            </span>
            <button
              onClick={() => handleFailoverToggle(isFiberActive ? 'cut' : 'restore')}
              disabled={isFailoverLoading}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shadow ${
                isFiberActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isFiberActive ? 'Simulate Physical Fiber Cut' : 'Restore Primary Fiber Link'}
            </button>
          </div>
        </div>

        {/* Network Health & Availability Gauge */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="pb-3 border-b border-borderNavy">
            <h3 className="text-base font-semibold text-white">Network Availability</h3>
            <p className="text-xs text-slate-400 mt-0.5">Calculated across redundant interfaces</p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-panelNavy stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${isFiberActive ? 'text-primaryTeal' : 'text-warningOrange'} stroke-current transition-all duration-700`}
                  strokeWidth="10"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (networkStatus.networkHealthPct || 98.6)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white font-mono tracking-tighter">
                  {networkStatus.networkHealthPct || 98.6}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  {isFiberActive ? 'OPTIMAL' : 'DEGRADED'}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center text-xs">
              <div className="p-2 bg-panelNavy rounded-lg border border-borderNavy">
                <span className="text-slate-400 block">Packet Loss</span>
                <span className="font-mono font-bold text-white mt-0.5 block">{networkStatus.packetLossPct}%</span>
              </div>
              <div className="p-2 bg-panelNavy rounded-lg border border-borderNavy">
                <span className="text-slate-400 block">RTT Latency</span>
                <span className="font-mono font-bold text-white mt-0.5 block">{networkStatus.latencyMs} ms</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-borderNavy">
            <span>OSPF Area 0 Dynamic Routing</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* 3. EMERGENCY ALERTS & INCIDENT SEVERITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts List */}
        <div className="lg:col-span-2 bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warningOrange" />
              <h3 className="text-base font-semibold text-white">Broadcast Emergency Bulletins</h3>
            </div>
            <Link
              to="/alerts"
              className="text-xs text-primaryTeal hover:text-teal-300 flex items-center gap-1 font-medium"
            >
              View All Alerts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-borderNavy mt-2">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alert.severity} type="severity" />
                    <span className="text-xs font-bold text-white">{alert.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{alert.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>{alert.location}</span>
                    <span>Channel: {alert.broadcast_channel}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                  {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Incidents by Severity */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <h3 className="text-base font-semibold text-white">Incidents by Priority</h3>
            <Link to="/incidents" className="text-xs text-primaryTeal hover:text-teal-300 font-medium">
              Manage
            </Link>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-semibold">Critical Priority</span>
                <span className="text-white font-mono">{incidentsBySeverity.Critical}</span>
              </div>
              <div className="w-full bg-panelNavy h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(incidentsBySeverity.Critical / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-orange-400 font-semibold">High Priority</span>
                <span className="text-white font-mono">{incidentsBySeverity.High}</span>
              </div>
              <div className="w-full bg-panelNavy h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(incidentsBySeverity.High / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-300 font-semibold">Medium Priority</span>
                <span className="text-white font-mono">{incidentsBySeverity.Medium}</span>
              </div>
              <div className="w-full bg-panelNavy h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(incidentsBySeverity.Medium / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-teal-300 font-semibold">Low Priority</span>
                <span className="text-white font-mono">{incidentsBySeverity.Low}</span>
              </div>
              <div className="w-full bg-panelNavy h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(incidentsBySeverity.Low / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HOSPITAL CAPACITY & RECENT ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Availability */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primaryTeal" />
              <h3 className="text-base font-semibold text-white">Hospital Capacity & Triage</h3>
            </div>
            <Link to="/hospitals" className="text-xs text-primaryTeal hover:text-teal-300 font-medium">
              Details
            </Link>
          </div>

          <div className="space-y-4 mt-4">
            {hospitals.map((hosp) => {
              const bedPct = Math.round(((hosp.total_beds - hosp.available_beds) / hosp.total_beds) * 100);
              return (
                <div key={hosp.id} className="p-3.5 bg-panelNavy rounded-lg border border-borderNavy/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-400">{hosp.location}</p>
                    </div>
                    <StatusBadge status={hosp.emergency_capacity} />
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Bed Occupancy: {hosp.total_beds - hosp.available_beds} / {hosp.total_beds}</span>
                      <span className="font-mono">{bedPct}%</span>
                    </div>
                    <div className="w-full bg-darkNavy h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bedPct > 85 ? 'bg-red-500' : 'bg-primaryTeal'}`}
                        style={{ width: `${bedPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>ICU Free: {hosp.icu_available} / {hosp.icu_total}</span>
                    <span>Ambulances: {hosp.ambulances_available} free</span>
                    <span>IP: {hosp.ip_address}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Timeline of Activity */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondaryCyan" />
              <h3 className="text-base font-semibold text-white">Event Log Timeline</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="text-xs">
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Regional Router (reg-rtr)</span> synchronized OSPF Area 0 routing table.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Just now</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <div className="text-xs">
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Mobile Command Post (MCP-1)</span> authenticated on VLAN 10 (OPS).
                </p>
                <span className="text-[10px] text-slate-500 font-mono">2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div className="text-xs">
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Shelter B</span> reported auxiliary diesel generator fuel at 65%.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">8 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
              <div className="text-xs">
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Structural Collapse INC-2026-001</span> dispatched units RESP-101 and RESP-102.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">15 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
              <div className="text-xs">
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Core DNS/DHCP (10.100.0.5)</span> issued 4 new leases to field responders.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">24 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
