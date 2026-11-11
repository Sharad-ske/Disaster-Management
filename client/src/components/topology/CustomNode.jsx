import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Server,
  Radio,
  Building2,
  Tent,
  Users,
  Car,
  Layers,
  Network
} from 'lucide-react';

const iconMap = {
  'Gateway': Radio,
  'Core Router': Network,
  'Regional Router': Network,
  'Layer 3 Switch': Layers,
  'Application Server': Server,
  'Monitoring Server': Server,
  'Emergency Operations Centre': Building2,
  'Hospital': Building2,
  'Disaster Shelter': Tent,
  'Responder Network': Users,
  'Mobile Command Post': Car
};

function CustomNode({ data, selected }) {
  const Icon = iconMap[data.device_type] || Server;
  const isOnline = data.status === 'Online';

  // VLAN color accents
  let badgeColor = 'bg-slate-700/60 text-slate-300 border-slate-600';
  if (data.vlan?.includes('10') || data.vlan?.includes('OPS')) {
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  } else if (data.vlan?.includes('20') || data.vlan?.includes('ADMIN')) {
    badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
  } else if (data.vlan?.includes('30') || data.vlan?.includes('PUBLIC')) {
    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  } else if (data.vlan?.includes('Backbone') || data.vlan?.includes('OSPF')) {
    badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  }

  return (
    <div
      className={`px-3 py-2.5 rounded-xl bg-cardNavy border-2 transition-all duration-200 shadow-xl min-w-[190px] select-none ${
        selected
          ? 'border-primaryTeal ring-2 ring-primaryTeal/30 shadow-primaryTeal/10'
          : 'border-borderNavy hover:border-slate-500'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primaryTeal" />
      <Handle type="source" position={Position.Bottom} className="!bg-primaryTeal" />
      <Handle type="target" position={Position.Left} className="!bg-secondaryCyan" />
      <Handle type="source" position={Position.Right} className="!bg-secondaryCyan" />

      <div className="flex items-center gap-2.5">
        <div
          className={`p-2 rounded-lg border ${
            isOnline
              ? 'bg-teal-500/10 border-teal-500/30 text-primaryTeal'
              : 'bg-red-500/10 border-red-500/30 text-dangerRed'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-white truncate">{data.label}</span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isOnline ? 'bg-emerald-400' : 'bg-red-500 animate-ping'
              }`}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{data.ip_address}</span>
        </div>
      </div>

      <div className="mt-2 pt-1.5 border-t border-borderNavy/80 flex items-center justify-between text-[9px] font-mono">
        <span className={`px-1.5 py-0.5 rounded border ${badgeColor}`}>
          {data.vlan || 'VLAN'}
        </span>
        <span className="text-slate-400">{data.status}</span>
      </div>
    </div>
  );
}

export default memo(CustomNode);
