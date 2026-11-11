import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  AlertTriangle,
  Flame,
  Building2,
  Tent,
  Users,
  Activity,
  FileText,
  Settings,
  Radio,
  ChevronRight
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

const navigationItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Network Topology', path: '/topology', icon: Network },
  { name: 'Emergency Alerts', path: '/alerts', icon: AlertTriangle, hasBadge: 'alerts' },
  { name: 'Incident Management', path: '/incidents', icon: Flame },
  { name: 'Hospitals', path: '/hospitals', icon: Building2 },
  { name: 'Disaster Shelters', path: '/shelters', icon: Tent },
  { name: 'Responders', path: '/responders', icon: Users },
  { name: 'Network Monitoring', path: '/monitoring', icon: Activity },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { networkStatus, activeAlerts } = useNetwork();
  const isFiberActive = networkStatus.primaryLinkStatus === 'Active';

  return (
    <aside className="w-64 bg-cardNavy border-r border-borderNavy flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-borderNavy gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-primaryTeal shadow-sm">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-white text-sm tracking-wider uppercase">
            EOC NETWORKS
          </span>
          <span className="text-[10px] text-primaryTeal font-mono tracking-tight">
            DISASTER COMMS V2.0
          </span>
        </div>
      </div>

      {/* Network Status Quick Indicator */}
      <div className="px-4 py-3 bg-panelNavy/60 border-b border-borderNavy/80">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">WAN Backbone</span>
          <span
            className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
              isFiberActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
            }`}
          >
            {isFiberActive ? 'FIBER PRIMARY' : 'SATELLITE BACKUP'}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>RTT: {networkStatus.latencyMs}ms</span>
          <span>Loss: {networkStatus.packetLossPct}%</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-primaryTeal/15 text-primaryTeal border border-primaryTeal/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-panelNavy/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-primaryTeal' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.hasBadge === 'alerts' && activeAlerts.length > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                        {activeAlerts.length}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-primaryTeal" />}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-borderNavy bg-panelNavy/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 font-mono">
            EOC
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Sharad P. Singh</span>
            <span className="text-[10px] text-slate-400 truncate">EOC Network Commander</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
