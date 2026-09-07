import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Filter, Download, RefreshCw,
  CheckCircle2, Clock, AlertTriangle, Eye, FileText,
  User, Stethoscope, Settings, ChevronDown
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import { getAuditLogs } from '../../db/auditService';

const ACTION_LABELS = {
  VIEW_RECORD: { label: 'View Record', color: 'bg-blue-100 text-blue-800' },
  APPOINTMENT_SCHEDULED: { label: 'Appointment Booked', color: 'bg-teal-100 text-teal-800' },
  CONSULTATION_STARTED: { label: 'Consultation Started', color: 'bg-[#2A9D8F]/15 text-[#0F4C5C]' },
  CONSULTATION_ENDED: { label: 'Consultation Ended', color: 'bg-slate-100 text-slate-700' },
  SOAP_DICTATION_SAVED: { label: 'SOAP Note Signed', color: 'bg-emerald-100 text-emerald-800' },
  EXPORT_RECORD: { label: 'Record Exported', color: 'bg-violet-100 text-violet-800' },
  PRESCRIBE_MEDICATION: { label: 'Rx Prescribed', color: 'bg-amber-100 text-amber-800' },
  STATUS_UPDATED: { label: 'Status Updated', color: 'bg-slate-100 text-slate-700' },
  ROLE_SWITCH: { label: 'Role Switch', color: 'bg-orange-100 text-orange-800' },
  DEFAULT: { label: 'Action', color: 'bg-slate-100 text-slate-600' }
};

export default function AuditLogTable() {
  const { refreshData } = useCarePulse();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const result = await getAuditLogs({
        role: filterRole,
        action: filterAction,
        search: searchTerm
      });
      setLogs(result);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filterRole, filterAction, searchTerm]);

  // Export full audit log as HIPAA-compliant CSV
  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Role', 'User', 'Patient ID', 'Patient Name', 'Action', 'Details', 'IP Address', 'Compliance'];
    const rows = logs.map(l => [
      l.timestamp,
      l.role,
      l.user,
      l.patientId,
      l.patientName,
      l.action,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.ipAddress || 'N/A',
      l.complianceStatus || 'VERIFIED'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarePulse_HIPAA_AuditLog_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action) => {
    const meta = ACTION_LABELS[action] || ACTION_LABELS.DEFAULT;
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
        {meta.label}
      </span>
    );
  };

  const getRoleIcon = (role) => {
    if (role === 'Patient Portal') return <User className="w-3.5 h-3.5 text-[#2A9D8F]" />;
    if (role === 'Provider Workspace (Doctor)') return <Stethoscope className="w-3.5 h-3.5 text-[#0F4C5C]" />;
    return <Settings className="w-3.5 h-3.5 text-[#E9C46A]" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F4C5C]" />
            <h2 className="text-lg font-bold text-slate-900">HIPAA Compliance Audit Logger</h2>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              {logs.length} Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable access log of all clinical actions, record access events, and PHI interactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLogs}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#0c3c49] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export HIPAA CSV
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, ID, user, or event details..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-slate-700 font-medium cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="Patient Portal">Patient Portal</option>
          <option value="Provider Workspace (Doctor)">Provider (Doctor)</option>
          <option value="Admin / Compliance Console">Admin / Compliance</option>
        </select>

        {/* Action Filter */}
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-slate-700 font-medium cursor-pointer"
        >
          <option value="ALL">All Actions</option>
          <option value="VIEW_RECORD">View Record</option>
          <option value="APPOINTMENT_SCHEDULED">Appointment Booked</option>
          <option value="CONSULTATION_STARTED">Consultation Started</option>
          <option value="SOAP_DICTATION_SAVED">SOAP Note Signed</option>
          <option value="EXPORT_RECORD">Record Exported</option>
          <option value="PRESCRIBE_MEDICATION">Rx Prescribed</option>
          <option value="ROLE_SWITCH">Role Switch</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3">Timestamp (UTC)</th>
              <th className="py-3 px-3">Role / User</th>
              <th className="py-3 px-3">Patient</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Details</th>
              <th className="py-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-300" />
                  Loading HIPAA audit records from IndexedDB...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No audit events match current filters.
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr
                  key={log.id || i}
                  className="hover:bg-slate-50/60 transition"
                >
                  {/* Timestamp */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>

                  {/* Role / User */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {getRoleIcon(log.role)}
                      <div>
                        <div className="font-semibold text-slate-800 truncate max-w-[140px]">{log.user}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{log.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Patient */}
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800">{log.patientName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{log.patientId}</div>
                  </td>

                  {/* Action Badge */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>

                  {/* Details */}
                  <td className="py-2.5 px-3 max-w-xs text-slate-600">
                    <p className="truncate text-[11px] leading-relaxed" title={log.details}>
                      {log.details}
                    </p>
                    {log.ipAddress && (
                      <span className="text-[10px] font-mono text-slate-400">IP: {log.ipAddress}</span>
                    )}
                  </td>

                  {/* Compliance Status */}
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.complianceStatus || 'VERIFIED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
