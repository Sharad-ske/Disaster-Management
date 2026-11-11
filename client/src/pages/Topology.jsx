import React, { useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Network,
  Radio,
  Wifi,
  Shield,
  Layers,
  Activity,
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import CustomNode from '../components/topology/CustomNode';
import StatusBadge from '../components/common/StatusBadge';
import { useNetwork } from '../context/NetworkContext';
import { getNetworkDevices, getNetworkLinks } from '../services/api';

const nodeTypes = {
  custom: CustomNode,
};

// Architecture Coordinates mapping exactly to Slide 7
const initialNodePositions = {
  'sat-gw': { x: 80, y: 80 },
  'reg-rtr': { x: 260, y: 220 },
  'eoc-core': { x: 620, y: 220 },
  'eoc-l3-sw': { x: 880, y: 220 },
  'eoc-core-dns': { x: 880, y: 80 },
  'eoc-app-srv': { x: 1120, y: 160 },
  'eoc-mon-srv': { x: 1120, y: 280 },
  // Tactical Field & Regional Distribution (Bottom)
  'mcp-van': { x: 80, y: 460 },
  'resp-net': { x: 240, y: 460 },
  'hosp-a': { x: 400, y: 460 },
  'hosp-b': { x: 560, y: 460 },
  'shelter-a': { x: 720, y: 460 },
  'shelter-b': { x: 880, y: 460 },
};

export default function Topology() {
  const { networkStatus, handleFailoverToggle, isFailoverLoading } = useNetwork();

  const [devices, setDevices] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pingResult, setPingResult] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const isFiberActive = networkStatus.primaryLinkStatus === 'Active';

  useEffect(() => {
    async function loadTopology() {
      try {
        const [devRes, linkRes] = await Promise.all([
          getNetworkDevices(),
          getNetworkLinks()
        ]);

        if (devRes.data?.success) setDevices(devRes.data.data);
        if (linkRes.data?.success) setLinks(linkRes.data.data);
      } catch (err) {
        console.error('Failed to load topology devices/links:', err);
      }
    }
    loadTopology();
  }, []);

  // Construct React Flow Nodes
  useEffect(() => {
    if (devices.length === 0) return;

    const flowNodes = devices.map((dev) => {
      const pos = initialNodePositions[dev.id] || { x: 400, y: 300 };
      return {
        id: dev.id,
        type: 'custom',
        position: pos,
        data: {
          label: dev.name,
          ...dev
        }
      };
    });

    setNodes(flowNodes);
  }, [devices, setNodes]);

  // Construct React Flow Edges with Dynamic Link Coloring
  useEffect(() => {
    const flowEdges = [
      // 1. PRIMARY FIBER LINK (reg-rtr <-> eoc-core)
      {
        id: 'link-wan-primary',
        source: 'reg-rtr',
        target: 'eoc-core',
        animated: isFiberActive,
        label: isFiberActive ? 'PRIMARY FIBER (1 Gbps - Cost 10)' : 'FIBER CUT (DOWN)',
        style: {
          stroke: isFiberActive ? '#14B8A6' : '#EF4444',
          strokeWidth: isFiberActive ? 3.5 : 2,
          strokeDasharray: isFiberActive ? undefined : '5,5'
        },
        labelStyle: { fill: isFiberActive ? '#14B8A6' : '#EF4444', fontWeight: 700, fontSize: 10 },
        labelBgStyle: { fill: '#111C2E', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isFiberActive ? '#14B8A6' : '#EF4444' }
      },

      // 2. BACKUP SATELLITE LINKS (reg-rtr -> sat-gw -> eoc-core)
      {
        id: 'link-sat-reg',
        source: 'reg-rtr',
        target: 'sat-gw',
        animated: !isFiberActive,
        label: 'UHF/RF Relay',
        style: {
          stroke: !isFiberActive ? '#F59E0B' : '#64748B',
          strokeWidth: !isFiberActive ? 3 : 1.5,
          strokeDasharray: isFiberActive ? '4,4' : undefined
        },
        labelStyle: { fill: !isFiberActive ? '#F59E0B' : '#94A3B8', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' },
        markerEnd: { type: MarkerType.ArrowClosed, color: !isFiberActive ? '#F59E0B' : '#64748B' }
      },
      {
        id: 'link-wan-backup',
        source: 'sat-gw',
        target: 'eoc-core',
        animated: !isFiberActive,
        label: !isFiberActive ? 'ACTIVE SATELLITE (5 Mbps - Cost 100)' : 'SATELLITE STANDBY (Cost 100)',
        style: {
          stroke: !isFiberActive ? '#F59E0B' : '#A855F7',
          strokeWidth: !isFiberActive ? 3.5 : 1.5,
          strokeDasharray: isFiberActive ? '4,4' : undefined
        },
        labelStyle: { fill: !isFiberActive ? '#F59E0B' : '#C084FC', fontWeight: 700, fontSize: 10 },
        labelBgStyle: { fill: '#111C2E', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: !isFiberActive ? '#F59E0B' : '#A855F7' }
      },

      // 3. EOC CORE BACKBONE
      {
        id: 'edge-core-l3',
        source: 'eoc-core',
        target: 'eoc-l3-sw',
        animated: true,
        label: '10 Gbps Trunk',
        style: { stroke: '#38BDF8', strokeWidth: 2.5 },
        labelStyle: { fill: '#38BDF8', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      },
      {
        id: 'edge-l3-dns',
        source: 'eoc-l3-sw',
        target: 'eoc-core-dns',
        style: { stroke: '#38BDF8', strokeWidth: 1.5 }
      },
      {
        id: 'edge-l3-app',
        source: 'eoc-l3-sw',
        target: 'eoc-app-srv',
        style: { stroke: '#38BDF8', strokeWidth: 1.5 }
      },
      {
        id: 'edge-l3-mon',
        source: 'eoc-l3-sw',
        target: 'eoc-mon-srv',
        style: { stroke: '#38BDF8', strokeWidth: 1.5 }
      },

      // 4. REGIONAL DISTRIBUTION TO FIELD SECTORS
      {
        id: 'edge-reg-mcp',
        source: 'reg-rtr',
        target: 'mcp-van',
        label: 'VLAN 10 (OPS)',
        style: { stroke: '#22D3EE', strokeWidth: 2 },
        labelStyle: { fill: '#22D3EE', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      },
      {
        id: 'edge-reg-resp',
        source: 'reg-rtr',
        target: 'resp-net',
        label: 'VLAN 10 (OPS)',
        style: { stroke: '#22D3EE', strokeWidth: 2 },
        labelStyle: { fill: '#22D3EE', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      },
      {
        id: 'edge-reg-hosp-a',
        source: 'reg-rtr',
        target: 'hosp-a',
        label: 'VLAN 20 (ADMIN)',
        style: { stroke: '#14B8A6', strokeWidth: 2 },
        labelStyle: { fill: '#14B8A6', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      },
      {
        id: 'edge-reg-hosp-b',
        source: 'reg-rtr',
        target: 'hosp-b',
        label: 'VLAN 20 (ADMIN)',
        style: { stroke: '#14B8A6', strokeWidth: 2 },
        labelStyle: { fill: '#14B8A6', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      },
      {
        id: 'edge-reg-shelter-a',
        source: 'reg-rtr',
        target: 'shelter-a',
        label: 'VLAN 30 (PUBLIC)',
        style: { stroke: '#C084FC', strokeWidth: 2 },
        labelStyle: { fill: '#C084FC', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      },
      {
        id: 'edge-reg-shelter-b',
        source: 'reg-rtr',
        target: 'shelter-b',
        label: 'VLAN 30 (PUBLIC)',
        style: { stroke: '#C084FC', strokeWidth: 2 },
        labelStyle: { fill: '#C084FC', fontSize: 9 },
        labelBgStyle: { fill: '#111C2E' }
      }
    ];

    setEdges(flowEdges);
  }, [isFiberActive, setEdges]);

  // Handle node selection
  const handleNodeClick = (_, node) => {
    setSelectedNode(node.data);
    setPingResult(null);
  };

  // Simulate Node Ping
  const handlePingNode = () => {
    if (!selectedNode) return;
    setIsPinging(true);
    setPingResult(null);

    setTimeout(() => {
      setIsPinging(false);
      const isRemote = selectedNode.vlan?.includes('OPS') || selectedNode.vlan?.includes('ADMIN') || selectedNode.vlan?.includes('PUBLIC');
      const baseRtt = !isFiberActive && isRemote ? 354.2 : (isRemote ? 4.8 : 0.8);
      const jitter = (Math.random() * 0.4).toFixed(1);

      setPingResult({
        success: true,
        packetsTransmitted: 4,
        packetsReceived: 4,
        packetLoss: '0%',
        rttMin: (baseRtt - 0.2).toFixed(1),
        rttAvg: baseRtt.toFixed(1),
        rttMax: (baseRtt + 0.4).toFixed(1),
        path: isRemote
          ? (!isFiberActive ? 'EOC Core -> Satellite GW -> Regional Router -> Target' : 'EOC Core -> Primary Fiber -> Regional Router -> Target')
          : 'EOC Core Switch -> Target Node'
      });
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Top Topology Controls Bar */}
      <div className="bg-cardNavy border border-borderNavy rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-primaryTeal" />
            Interactive Network Topology Visualizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any network node to inspect its Layer-2 VLAN, Layer-3 CIDR, and routing status.
          </p>
        </div>

        {/* Dynamic Failover Simulation Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block text-xs">
            <span className="text-slate-400 block">Current WAN Path:</span>
            <span className="font-bold text-white font-mono text-[11px]">
              {isFiberActive ? 'Primary Fiber (OSPF 10)' : 'Satellite / Radio (OSPF 100)'}
            </span>
          </div>

          <button
            onClick={() => handleFailoverToggle(isFiberActive ? 'cut' : 'restore')}
            disabled={isFailoverLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all ${
              isFiberActive
                ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-500/30'
            }`}
          >
            {isFiberActive ? (
              <>
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>Simulate Fiber Cut (Failover)</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Restore Primary Fiber Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Flow Canvas with Side Inspector Drawer */}
      <div className="relative h-[680px] bg-darkNavy border border-borderNavy rounded-xl overflow-hidden shadow-2xl flex">
        {/* React Flow Graph */}
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#1e2f4d" gap={20} size={1} />
            <Controls />
          </ReactFlow>

          {/* Canvas Legend */}
          <div className="absolute bottom-4 left-4 bg-cardNavy/90 backdrop-blur border border-borderNavy rounded-lg p-3 text-[11px] shadow-lg pointer-events-none space-y-1.5 font-mono">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 font-sans">
              Topology Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-primaryTeal rounded" />
              <span className="text-slate-300">Primary Fiber Path (Cost 10)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-amber-400 rounded" />
              <span className="text-slate-300">Backup Satellite Path (Cost 100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-400 rounded" />
              <span className="text-slate-300">VLAN 10: OPS (Responders/MCP)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-teal-400 rounded" />
              <span className="text-slate-300">VLAN 20: ADMIN (Hospitals)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-purple-400 rounded" />
              <span className="text-slate-300">VLAN 30: PUBLIC (Shelters)</span>
            </div>
          </div>
        </div>

        {/* Selected Node Details Side Drawer */}
        {selectedNode && (
          <div className="w-96 bg-cardNavy border-l border-borderNavy h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl z-10 animate-slideLeft">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-borderNavy">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-primaryTeal" />
                  <span className="font-bold text-white text-sm">Device Inspector</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-panelNavy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Node Overview */}
              <div>
                <h3 className="text-base font-bold text-white">{selectedNode.name || selectedNode.label}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedNode.status || 'Online'} />
                  <StatusBadge status={selectedNode.vlan} type="vlan" />
                </div>
              </div>

              {/* Specification Specs Table */}
              <div className="space-y-2 text-xs bg-panelNavy rounded-xl p-3.5 border border-borderNavy/80 font-mono">
                <div className="flex justify-between py-1 border-b border-borderNavy/40">
                  <span className="text-slate-400">Device Type:</span>
                  <span className="text-white font-semibold">{selectedNode.device_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-borderNavy/40">
                  <span className="text-slate-400">IP Address:</span>
                  <span className="text-primaryTeal font-bold">{selectedNode.ip_address}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-borderNavy/40">
                  <span className="text-slate-400">Subnet Mask:</span>
                  <span className="text-slate-200">{selectedNode.subnet || '255.255.255.0'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-borderNavy/40">
                  <span className="text-slate-400">MAC Address:</span>
                  <span className="text-slate-300">{selectedNode.mac_address || '00:1A:2B:3C:4D:XX'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-300 text-right">{selectedNode.location}</span>
                </div>
              </div>

              {/* Architectural Role Description */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  Role in Disaster Network:
                </span>
                <p className="text-slate-200 bg-panelNavy/60 p-2.5 rounded-lg border border-borderNavy text-[11px] leading-relaxed">
                  {selectedNode.role || 'Performs critical command-and-control communication forwarding.'}
                </p>
              </div>

              {/* Ping Diagnostic Section */}
              <div className="pt-2 border-t border-borderNavy">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">ICMP Diagnostic Test</span>
                  <button
                    onClick={handlePingNode}
                    disabled={isPinging}
                    className="flex items-center gap-1 px-3 py-1 bg-panelNavy hover:bg-teal-600/20 text-primaryTeal border border-teal-500/30 rounded-md text-xs font-mono transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    {isPinging ? 'Pinging...' : 'Send Ping'}
                  </button>
                </div>

                {pingResult && (
                  <div className="bg-darkNavy p-3 rounded-lg border border-borderNavy text-[11px] font-mono space-y-1 text-slate-300">
                    <div className="flex justify-between text-emerald-400">
                      <span>Loss: {pingResult.packetLoss}</span>
                      <span>RTT Avg: {pingResult.rttAvg} ms</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Path: {pingResult.path}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-borderNavy text-[11px] text-slate-500 font-mono text-center">
              Active Layer: 802.1Q / OSPF Area 0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
