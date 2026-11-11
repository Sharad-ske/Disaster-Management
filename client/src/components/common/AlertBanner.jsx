import React from 'react';
import { AlertTriangle, Radio, CheckCircle, RefreshCw } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export default function AlertBanner() {
  const { networkStatus, isFailoverLoading, handleFailoverToggle } = useNetwork();

  const isFiberCut = networkStatus.primaryLinkStatus === 'Failed';

  if (!isFiberCut) return null;

  return (
    <div className="bg-red-950/90 border-b border-red-500/50 text-red-100 px-6 py-3 shadow-lg backdrop-blur animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/30 border border-red-500 rounded-lg text-red-400">
            <Radio className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider uppercase text-red-200">
                CRITICAL NETWORK FAILOVER ENGAGED
              </span>
              <span className="text-xs bg-red-600/40 text-red-200 px-2 py-0.5 rounded font-mono">
                OSPF Cost: 100
              </span>
            </div>
            <p className="text-xs text-red-300 mt-0.5">
              Primary Terrestrial Fiber backhaul severed. Traffic dynamically rerouted through Satellite/Radio Gateway (10.0.2.0/30). Latency: ~350ms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleFailoverToggle('restore')}
            disabled={isFailoverLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow transition-colors disabled:opacity-50"
          >
            {isFailoverLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
            Restore Primary Fiber Link
          </button>
        </div>
      </div>
    </div>
  );
}
