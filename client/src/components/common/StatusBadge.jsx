import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  if (!status) return null;

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  const normalized = String(status).toLowerCase();

  if (type === 'severity') {
    switch (normalized) {
      case 'critical':
        colorClasses = 'bg-red-500/20 text-red-400 border-red-500/40 ring-1 ring-red-500/20';
        break;
      case 'high':
        colorClasses = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
        break;
      case 'medium':
        colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        break;
      case 'low':
        colorClasses = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
        break;
      default:
        colorClasses = 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  } else if (type === 'vlan') {
    if (normalized.includes('10') || normalized.includes('ops')) {
      colorClasses = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    } else if (normalized.includes('20') || normalized.includes('admin')) {
      colorClasses = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    } else if (normalized.includes('30') || normalized.includes('public')) {
      colorClasses = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    } else {
      colorClasses = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  } else {
    // General status
    switch (normalized) {
      case 'online':
      case 'active':
      case 'fully operational':
      case 'available':
      case 'accepting evacuees':
      case 'resolved':
      case 'normal':
        colorClasses = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
        break;
      case 'standby':
      case 'en route':
      case 'on scene':
      case 'surging':
      case 'deployed':
        colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        break;
      case 'failed':
      case 'offline':
      case 'at capacity':
      case 'emergency divert':
      case 'closed':
      case 'off duty':
        colorClasses = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
        break;
      default:
        colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 animate-pulse" />
      {status}
    </span>
  );
}
