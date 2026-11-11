import React, { useState, useEffect } from 'react';
import {
  Activity,
  Wifi,
  Radio,
  Server,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowDownUp,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { useNetwork } from '../context/NetworkContext';

export default function Monitoring() {
  const {
    networkStatus,
    telemetryHistory,
    handleFailoverToggle,
    isFailoverLoading
  } = useNetwork();

  const isFiberActive = networkStatus.primaryLinkStatus === 'Active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primaryTeal" />
            Network Performance & WAN Telemetry Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time interface state tracking, round-trip latency, and OSPF link failover telemetry.
          </p>
        </div>

        {/* Development Telemetry Disclaimer Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-panelNavy border border-teal-500/30 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primaryTeal animate-ping" />
            <span className="text-slate-300">
              Source: <strong className="text-primaryTeal font-mono">{networkStatus.telemetrySource}</strong>
            </span>
          </div>

          <button
            onClick={() => handleFailoverToggle(isFiberActive ? 'cut' : 'restore')}
            disabled={isFailoverLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
              isFiberActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isFiberActive ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Fiber Cut</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Primary Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Round-Trip Latency"
          value={`${networkStatus.latencyMs} ms`}
          subtext={isFiberActive ? 'Sub-5ms Target (Fiber)' : 'High Latency Orbit (Satellite)'}
          icon={Activity}
          color={isFiberActive ? 'teal' : 'orange'}
        />
        <StatCard
          title="Packet Loss"
          value={`${networkStatus.packetLossPct}%`}
          subtext={isFiberActive ? '0.00% Zero-Loss' : '2.4% RF Jitter Enforced'}
          icon={ArrowDownUp}
          color={networkStatus.packetLossPct > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Available Bandwidth"
          value={`${networkStatus.bandwidthMbps} Mbps`}
          subtext={isFiberActive ? '1 Gbps Full Duplex' : '5 Mbps Throttled Carrier'}
          icon={Wifi}
          color="cyan"
        />
        <StatCard
          title="Network Health Score"
          value={`${networkStatus.networkHealthPct}%`}
          subtext={isFiberActive ? 'All Tier-1 Paths Up' : 'Graceful Degradation Mode'}
          icon={Cpu}
          color={isFiberActive ? 'green' : 'orange'}
        />
      </div>

      {/* Real-Time Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency History Chart */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primaryTeal" />
              <h3 className="text-sm font-bold text-white">Live RTT Latency Waveform (ms)</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Sample interval: 3s</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isFiberActive ? '#14B8A6' : '#F59E0B'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={isFiberActive ? '#14B8A6' : '#F59E0B'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} fontStyle="italic" />
                <YAxis stroke="#64748B" fontSize={10} domain={[0, isFiberActive ? 10 : 400]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1E2F4D', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="latency"
                  name="Latency (ms)"
                  stroke={isFiberActive ? '#14B8A6' : '#F59E0B'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#latencyGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bandwidth & Loss Chart */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
            <div className="flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-secondaryCyan" />
              <h3 className="text-sm font-bold text-white">Bandwidth Throughput & Loss (%)</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Real-time Telemetry</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1E2F4D', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="bandwidth"
                  name="Throughput (Mbps)"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="packetLoss"
                  name="Packet Loss (%)"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Network Routers & Interfaces Status Grid */}
      <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-borderNavy mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primaryTeal" />
            <h3 className="text-base font-semibold text-white">Router & Gateway Physical Interfaces</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">FRRouting v10.x / Linux NetNS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-panelNavy text-slate-400 uppercase tracking-wider border-b border-borderNavy">
              <tr>
                <th className="px-4 py-3">Device Name</th>
                <th className="px-4 py-3">Interface</th>
                <th className="px-4 py-3">IP Assignment</th>
                <th className="px-4 py-3">OSPF Cost</th>
                <th className="px-4 py-3">Physical State</th>
                <th className="px-4 py-3">Link Physics Simulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderNavy text-slate-300">
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">EOC Core Router (eoc-core)</td>
                <td className="px-4 py-3">eth1 (Primary WAN)</td>
                <td className="px-4 py-3 text-primaryTeal">10.0.1.1/30</td>
                <td className="px-4 py-3">10</td>
                <td className="px-4 py-3">
                  <StatusBadge status={isFiberActive ? 'Online' : 'Failed'} />
                </td>
                <td className="px-4 py-3 text-slate-400">1 Gbps Full Duplex Fiber (2ms delay)</td>
              </tr>
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">EOC Core Router (eoc-core)</td>
                <td className="px-4 py-3">eth2 (Backup WAN)</td>
                <td className="px-4 py-3 text-cyan-300">10.0.2.1/30</td>
                <td className="px-4 py-3">100</td>
                <td className="px-4 py-3">
                  <StatusBadge status={!isFiberActive ? 'Online' : 'Standby'} />
                </td>
                <td className="px-4 py-3 text-slate-400">tc netem: 350ms RTT, 2% loss, 5Mbit rate</td>
              </tr>
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">Regional Router (reg-rtr)</td>
                <td className="px-4 py-3">eth1 (Fiber Uplink)</td>
                <td className="px-4 py-3 text-primaryTeal">10.0.1.2/30</td>
                <td className="px-4 py-3">10</td>
                <td className="px-4 py-3">
                  <StatusBadge status={isFiberActive ? 'Online' : 'Failed'} />
                </td>
                <td className="px-4 py-3 text-slate-400">Subterranean Conduit Link</td>
              </tr>
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">Satellite / Radio Gateway</td>
                <td className="px-4 py-3">sat0 (LEO Uplink)</td>
                <td className="px-4 py-3 text-purple-300">10.0.2.2/30</td>
                <td className="px-4 py-3">100</td>
                <td className="px-4 py-3">
                  <StatusBadge status={!isFiberActive ? 'Online' : 'Standby'} />
                </td>
                <td className="px-4 py-3 text-slate-400">Ku-Band High Latency Satellite Dish</td>
              </tr>
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">Regional Router (reg-rtr)</td>
                <td className="px-4 py-3">eth0.10 (802.1Q Subif)</td>
                <td className="px-4 py-3 text-cyan-300">10.10.10.1/24</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3"><StatusBadge status="Online" /></td>
                <td className="px-4 py-3 text-slate-400">VLAN 10: OPS Tactical Network</td>
              </tr>
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">Regional Router (reg-rtr)</td>
                <td className="px-4 py-3">eth0.20 (802.1Q Subif)</td>
                <td className="px-4 py-3 text-teal-300">10.10.20.1/24</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3"><StatusBadge status="Online" /></td>
                <td className="px-4 py-3 text-slate-400">VLAN 20: ADMIN Hospitals & Clinics</td>
              </tr>
              <tr className="hover:bg-panelNavy/40">
                <td className="px-4 py-3 font-bold text-white">Regional Router (reg-rtr)</td>
                <td className="px-4 py-3">eth0.30 (802.1Q Subif)</td>
                <td className="px-4 py-3 text-purple-300">10.10.30.1/24</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3"><StatusBadge status="Online" /></td>
                <td className="px-4 py-3 text-slate-400">VLAN 30: PUBLIC Shelters & Victims</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
