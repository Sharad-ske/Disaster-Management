import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Wifi,
  Radio,
  Clock,
  ShieldAlert,
  X,
  ExternalLink
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export default function Topbar() {
  const {
    networkStatus,
    systemNotifications,
    dismissNotification,
    handleFailoverToggle,
    isFailoverLoading
  } = useNetwork();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isFiberActive = networkStatus.primaryLinkStatus === 'Active';

  return (
    <header className="h-16 bg-cardNavy/90 backdrop-blur border-b border-borderNavy px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Project Branding & Link Status Pill */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold text-white tracking-wide hidden lg:block">
          DISASTER MANAGEMENT & EMERGENCY COMMS NETWORK
        </h1>

        {/* Dynamic Link Status Pill with interactive toggle */}
        <button
          onClick={() => handleFailoverToggle(isFiberActive ? 'cut' : 'restore')}
          disabled={isFailoverLoading}
          title={isFiberActive ? 'Click to simulate fiber cut failover' : 'Click to restore primary link'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isFiberActive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-red-500/20 border-red-500/40 text-red-200 hover:bg-red-500/30 animate-pulse'
          }`}
        >
          {isFiberActive ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRIMARY FIBER (ACTIVE)</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-red-400 animate-spin" />
              <span>SATELLITE BACKUP (FAILOVER)</span>
            </>
          )}
          <span className="text-[10px] opacity-75 font-mono ml-1">
            [{isFiberActive ? 'Cost: 10' : 'Cost: 100'}]
          </span>
        </button>
      </div>

      {/* Right: Search, Clock, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources, IP, VLAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 pl-9 pr-3 py-1.5 bg-panelNavy border border-borderNavy rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primaryTeal focus:ring-1 focus:ring-primaryTeal transition-all"
          />
        </div>

        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-panelNavy border border-borderNavy rounded-lg text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-primaryTeal" />
          <span>{currentTime.toLocaleTimeString([], { hour12: false })}</span>
          <span className="text-[10px] text-slate-400">
            {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-300 hover:text-white bg-panelNavy border border-borderNavy hover:border-slate-600 rounded-lg relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {systemNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono">
                {systemNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-panelNavy border border-borderNavy rounded-xl shadow-2xl p-4 z-50 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-borderNavy">
                <span className="font-semibold text-white">Live Event Log</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {systemNotifications.length} alerts
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {systemNotifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No recent network events.</p>
                ) : (
                  systemNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-lg bg-cardNavy border border-borderNavy/80 flex items-start justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-slate-100">{notif.title}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{notif.message}</p>
                        <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        className="text-slate-500 hover:text-slate-300 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-borderNavy">
          <div className="w-8 h-8 rounded-full bg-primaryTeal/20 border border-primaryTeal/40 flex items-center justify-center text-primaryTeal font-bold text-xs font-mono">
            EOC
          </div>
        </div>
      </div>
    </header>
  );
}
