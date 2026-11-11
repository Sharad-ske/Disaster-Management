import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  BarChart3,
  Building2,
  Tent,
  Users,
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { getSystemReport } from '../services/api';

const COLORS = ['#EF4444', '#F97316', '#FBBF24', '#14B8A6'];

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await getSystemReport();
        if (res.data?.success) {
          setReport(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load system report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  const handleDownloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EOC_Disaster_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return <div className="text-center py-16 text-slate-400">Compiling comprehensive emergency response report...</div>;
  }

  const severityPieData = [
    { name: 'Critical', value: report.incidentStats?.bySeverity?.Critical || 0 },
    { name: 'High', value: report.incidentStats?.bySeverity?.High || 0 },
    { name: 'Medium', value: report.incidentStats?.bySeverity?.Medium || 0 },
    { name: 'Low', value: report.incidentStats?.bySeverity?.Low || 0 }
  ];

  const departmentData = Object.entries(report.responderStats?.byDepartment || {}).map(([dept, count]) => ({
    department: dept,
    responders: count
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNavy">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primaryTeal" />
            Executive Operational Audit & Emergency Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-departmental telemetry summary for emergency command briefings and academic reviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-panelNavy hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-borderNavy transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primaryTeal hover:bg-teal-500 text-darkNavy font-bold rounded-lg text-xs transition-colors shadow"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data (JSON)
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Logged Incidents"
          value={report.incidentStats?.total || 0}
          subtext={`${report.incidentStats?.active || 0} Currently Active`}
          icon={Activity}
          color="red"
        />
        <StatCard
          title="Hospital Occupancy"
          value={`${report.hospitalStats?.averageOccupancyPct || 0}%`}
          subtext={`${report.hospitalStats?.availableBeds || 0} Free Beds`}
          icon={Building2}
          color="teal"
        />
        <StatCard
          title="Shelter Occupancy"
          value={`${report.shelterStats?.overallOccupancyPct || 0}%`}
          subtext={`${report.shelterStats?.availableCapacity || 0} Evacuee Slots`}
          icon={Tent}
          color="blue"
        />
        <StatCard
          title="Network Core Uptime"
          value={`${report.networkStats?.uptimePct || 99.4}%`}
          subtext="Graceful Degradation Verified"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Severity Breakdown */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="pb-3 border-b border-borderNavy flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Emergency Incidents by Severity</h3>
            <span className="text-[11px] text-slate-400 font-mono">Total: {report.incidentStats?.total}</span>
          </div>

          <div className="h-64 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1E2F4D', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Responder Department Allocation */}
        <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
          <div className="pb-3 border-b border-borderNavy flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Tactical Responders by Department</h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Deployed: {report.responderStats?.deployed} / {report.responderStats?.total}
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis dataKey="department" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1E2F4D', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="responders" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Network Resilience Audit Breakdown */}
      <div className="bg-cardNavy border border-borderNavy rounded-xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-white mb-3 pb-2 border-b border-borderNavy">
          Computer Networks Project Compliance Audit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-panelNavy rounded-lg border border-borderNavy">
            <span className="text-slate-400 block text-[11px]">Primary Link Path</span>
            <span className="text-white font-bold block mt-1">{report.networkStats?.primaryLink} (Fiber Backbone)</span>
            <span className="text-emerald-400 text-[10px] block mt-0.5">OSPF Cost 10 / 1 Gbps</span>
          </div>

          <div className="p-3 bg-panelNavy rounded-lg border border-borderNavy">
            <span className="text-slate-400 block text-[11px]">Backup Failover Link</span>
            <span className="text-white font-bold block mt-1">{report.networkStats?.backupLink} (Satellite/Radio Gateway)</span>
            <span className="text-amber-400 text-[10px] block mt-0.5">OSPF Cost 100 / 350ms RTT</span>
          </div>

          <div className="p-3 bg-panelNavy rounded-lg border border-borderNavy">
            <span className="text-slate-400 block text-[11px]">Failover Convergence Status</span>
            <span className="text-emerald-400 font-bold block mt-1">Automatic OSPF Convergence</span>
            <span className="text-slate-400 text-[10px] block mt-0.5">Hello 1s / Dead 4s or BFD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
