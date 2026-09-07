import React, { useMemo } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  BarChart2, TrendingUp, Users, Pill, Activity,
  Calendar, Video, HeartPulse, ShieldCheck
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';

const COLORS = ['#0F4C5C', '#2A9D8F', '#E9C46A', '#F4A261', '#64748B', '#94a3b8'];

export default function PracticeAnalytics() {
  const { appointments, patients, prescriptions, auditLogs } = useCarePulse();

  const dailyThroughput = useMemo(() => {
    const byDate = {};
    appointments.forEach(a => {
      if (!byDate[a.date]) byDate[a.date] = { date: a.date, total: 0, completed: 0, telehealth: 0 };
      byDate[a.date].total++;
      if (a.status === 'Completed') byDate[a.date].completed++;
      if (a.type === 'Telehealth Consultation') byDate[a.date].telehealth++;
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [appointments]);

  const statusDistribution = useMemo(() => {
    const counts = {};
    appointments.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const topMedications = useMemo(() => {
    const drugCounts = {};
    prescriptions.forEach(rx => {
      const key = rx.brandName;
      drugCounts[key] = (drugCounts[key] || 0) + 1;
    });
    return Object.entries(drugCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [prescriptions]);

  const auditActivity = useMemo(() => {
    const actionCounts = {};
    auditLogs.forEach(l => {
      const action = (l.action || 'OTHER').replace(/_/g, ' ');
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    });
    return Object.entries(actionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([action, count]) => ({ action, count }));
  }, [auditLogs]);

  const avgAge = patients.length > 0
    ? Math.round(patients.reduce((s, p) => s + (p.age || 0), 0) / patients.length)
    : 0;

  const kpis = [
    { Icon: Users, label: 'Total Patients', value: patients.length, sub: 'IndexedDB records', color: 'text-[#0F4C5C]', bg: 'bg-[#0F4C5C]/10' },
    { Icon: Calendar, label: 'Total Appointments', value: appointments.length, sub: `${appointments.filter(a => a.status === 'Completed').length} completed`, color: 'text-[#2A9D8F]', bg: 'bg-[#2A9D8F]/10' },
    { Icon: Video, label: 'Telehealth Sessions', value: appointments.filter(a => a.type === 'Telehealth Consultation').length, sub: 'WebRTC encrypted', color: 'text-amber-600', bg: 'bg-amber-50' },
    { Icon: Pill, label: 'Active Rx Orders', value: prescriptions.filter(p => p.status === 'Active').length, sub: `${prescriptions.length} total`, color: 'text-[#F4A261]', bg: 'bg-[#F4A261]/10' },
    { Icon: ShieldCheck, label: 'Audit Events', value: auditLogs.length, sub: 'HIPAA entries logged', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { Icon: HeartPulse, label: 'Avg. Patient Age', value: avgAge, sub: 'Years across panel', color: 'text-slate-700', bg: 'bg-slate-100' }
  ];

  return (
    <div className="space-y-6">

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(({ Icon, label, value, sub, color, bg }, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-[11px] font-bold text-slate-700 leading-tight">{label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Patient Throughput */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-[#0F4C5C]" />
            <h3 className="text-sm font-bold text-slate-800">Daily Patient Throughput</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyThroughput} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Total" fill="#0F4C5C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="telehealth" name="Telehealth" fill="#E9C46A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status Pie */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#2A9D8F]" />
            <h3 className="text-sm font-bold text-slate-800">Appointment Status Breakdown</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="45%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={true}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Medications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-4 h-4 text-[#F4A261]" />
            <h3 className="text-sm font-bold text-slate-800">Top Prescribed Medications</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMedications} layout="vertical" margin={{ top: 5, right: 10, left: 65, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }} />
                <Bar dataKey="count" name="Patients on Rx" fill="#F4A261" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Event Frequency */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#0F4C5C]" />
            <h3 className="text-sm font-bold text-slate-800">HIPAA Audit Event Frequency</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditActivity} layout="vertical" margin={{ top: 5, right: 10, left: 105, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" allowDecimals={false} />
                <YAxis type="category" dataKey="action" tick={{ fontSize: 9 }} stroke="#94a3b8" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }} />
                <Bar dataKey="count" name="Events" fill="#2A9D8F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
