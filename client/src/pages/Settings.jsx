import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Network,
  Radio,
  Sliders,
  CheckCircle,
  GraduationCap,
  Save
} from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

export default function Settings() {
  const { networkStatus } = useNetwork();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [settings, setSettings] = useState({
    ospfArea: '0.0.0.0 (Area 0)',
    primaryCost: 10,
    backupCost: 100,
    helloTimer: 1,
    deadTimer: 4,
    bfdEnabled: true,
    audioAlerts: true,
    telemetryPollInterval: 3
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primaryTeal" />
            System & Network Routing Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure OSPF routing metrics, telemetry ingestion sockets, and emergency broadcast parameters.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg flex items-center gap-1 font-mono animate-fadeIn">
            <CheckCircle className="w-3.5 h-3.5" /> Settings Saved Locally
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dynamic OSPF Routing Controls */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-borderNavy">
            <Network className="w-5 h-5 text-secondaryCyan" />
            <div>
              <h3 className="text-sm font-bold text-white">FRRouting OSPFv2 Routing Parameters</h3>
              <p className="text-xs text-slate-400">Controls dynamic link weight and failover detection interval</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">OSPF Backbone Area</label>
              <input
                type="text"
                disabled
                value={settings.ospfArea}
                className="w-full px-3 py-2 bg-darkNavy/60 border border-borderNavy rounded-lg text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Fiber Link Metric (OSPF Cost)</label>
              <input
                type="number"
                value={settings.primaryCost}
                onChange={(e) => setSettings({ ...settings, primaryCost: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-white font-mono focus:outline-none focus:border-primaryTeal"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Backup Satellite Metric (OSPF Cost)</label>
              <input
                type="number"
                value={settings.backupCost}
                onChange={(e) => setSettings({ ...settings, backupCost: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-white font-mono focus:outline-none focus:border-primaryTeal"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">OSPF Dead Interval (seconds)</label>
              <input
                type="number"
                value={settings.deadTimer}
                onChange={(e) => setSettings({ ...settings, deadTimer: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-darkNavy border border-borderNavy rounded-lg text-white font-mono focus:outline-none focus:border-primaryTeal"
              />
            </div>
          </div>
        </div>

        {/* VLAN Segmentation Hierarchy Reference */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-borderNavy">
            <Server className="w-5 h-5 text-primaryTeal" />
            <h3 className="text-sm font-bold text-white">802.1Q VLAN Segmentation Subnet Table</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-panelNavy text-slate-400 border-b border-borderNavy">
                <tr>
                  <th className="px-3 py-2">VLAN ID</th>
                  <th className="px-3 py-2">Segment Purpose</th>
                  <th className="px-3 py-2">Network Subnet</th>
                  <th className="px-3 py-2">Gateway IP</th>
                  <th className="px-3 py-2">QoS Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNavy text-slate-300">
                <tr>
                  <td className="px-3 py-2 text-cyan-300 font-bold">VLAN 10</td>
                  <td className="px-3 py-2 font-sans">OPS: Responders, MCP, Critical Dispatch</td>
                  <td className="px-3 py-2">10.10.10.0/24</td>
                  <td className="px-3 py-2">10.10.10.1</td>
                  <td className="px-3 py-2 text-emerald-400">High / Expedited</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-teal-300 font-bold">VLAN 20</td>
                  <td className="px-3 py-2 font-sans">ADMIN: Hospitals, ICU Telemetry, Supplies</td>
                  <td className="px-3 py-2">10.10.20.0/24</td>
                  <td className="px-3 py-2">10.10.20.1</td>
                  <td className="px-3 py-2 text-emerald-400">Medium / Assured</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-purple-300 font-bold">VLAN 30</td>
                  <td className="px-3 py-2 font-sans">PUBLIC: Evacuee Registration, Public Wi-Fi</td>
                  <td className="px-3 py-2">10.10.30.0/24</td>
                  <td className="px-3 py-2">10.10.30.1</td>
                  <td className="px-3 py-2 text-slate-400">Best Effort / Rate-Limited</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-blue-300 font-bold">WAN-1</td>
                  <td className="px-3 py-2 font-sans">Primary Terrestrial Fiber Backbone</td>
                  <td className="px-3 py-2">10.0.1.0/30</td>
                  <td className="px-3 py-2">10.0.1.1</td>
                  <td className="px-3 py-2 text-emerald-400">1 Gbps Full Duplex</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-amber-300 font-bold">WAN-2</td>
                  <td className="px-3 py-2 font-sans">Backup Satellite / Radio Fallback</td>
                  <td className="px-3 py-2">10.0.2.0/30</td>
                  <td className="px-3 py-2">10.0.2.1</td>
                  <td className="px-3 py-2 text-amber-300">5 Mbps Constrained</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Authors & University Details */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-borderNavy">
            <GraduationCap className="w-5 h-5 text-primaryTeal" />
            <h3 className="text-sm font-bold text-white">Project Metadata & Review Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-panelNavy rounded-lg border border-borderNavy">
              <span className="text-slate-400 block text-[11px]">Presented By</span>
              <span className="text-white font-bold block mt-1">SHARAD PRATAP SINGH</span>
              <span className="text-primaryTeal font-mono text-[11px] block">RA2411026010036</span>
            </div>

            <div className="p-3 bg-panelNavy rounded-lg border border-borderNavy">
              <span className="text-slate-400 block text-[11px]">Co-Presenter</span>
              <span className="text-white font-bold block mt-1">Shubhankar Pratap Singh</span>
              <span className="text-primaryTeal font-mono text-[11px] block">RA2411026010024</span>
            </div>

            <div className="p-3 bg-panelNavy rounded-lg border border-borderNavy">
              <span className="text-slate-400 block text-[11px]">Co-Presenter</span>
              <span className="text-white font-bold block mt-1">Aaditya Jain</span>
              <span className="text-primaryTeal font-mono text-[11px] block">RA2411026010039</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}
