import React, { useState } from 'react';
import {
  Users, Search, Filter, Video, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Stethoscope, Sparkles
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import { db } from '../../db/database';
import { logAuditEvent } from '../../db/auditService';

export default function ClinicalQueue({ onSelectPatient, onStartConsultation }) {
  const {
    appointments,
    patients,
    activePatientId,
    setActivePatientId,
    refreshData,
    currentRole,
    addToast
  } = useCarePulse();

  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'Waiting' | 'In Consultation' | 'Completed'
  const [searchTerm, setSearchTerm] = useState('');

  // Merge appointment with patient data
  const queueItems = appointments.map(apt => {
    const patient = patients.find(p => p.id === apt.patientId) || {};
    return {
      ...apt,
      patient
    };
  });

  const filteredQueue = queueItems.filter(item => {
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (item.patient?.name && item.patient.name.toLowerCase().includes(q)) ||
      (item.patient?.mrn && item.patient.mrn.toLowerCase().includes(q)) ||
      (item.reason && item.reason.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await db.appointments.update(aptId, { status: newStatus });
      const apt = appointments.find(a => a.id === aptId);
      const pat = patients.find(p => p.id === apt?.patientId);
      await logAuditEvent({
        role: currentRole,
        user: 'Dr. Evelyn Vance, MD',
        patientId: apt?.patientId,
        patientName: pat?.name || 'Patient',
        action: 'STATUS_UPDATED',
        details: `Updated clinical appointment ${aptId} status to: ${newStatus}`
      });
      await refreshData();
      addToast('Status Updated', `Patient queue status changed to ${newStatus}`, 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Waiting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E9C46A]/25 text-amber-900 border border-[#E9C46A]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            Waiting
          </span>
        );
      case 'In Consultation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A9D8F]/20 text-[#2A9D8F] border border-[#2A9D8F]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" />
            In Consultation
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0F4C5C]" />
            <h2 className="text-lg font-bold text-slate-900">Live Clinical Intake Queue</h2>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              {filteredQueue.length} Active Patients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time patient arrivals, admit to telehealth video rooms, and chart encounters.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'Waiting', 'In Consultation', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === status
                  ? 'bg-white text-[#0F4C5C] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Encounters' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="my-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient queue by name, MRN, or clinical complaint..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-slate-800 placeholder:text-slate-400 transition"
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="py-3 px-3">Patient / MRN</th>
              <th className="py-3 px-3">Slot / Type</th>
              <th className="py-3 px-3">Chief Complaint</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Triage</th>
              <th className="py-3 px-3 text-right">Clinical Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQueue.map((item) => {
              const isActive = activePatientId === item.patientId;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition ${
                    isActive ? 'bg-[#0F4C5C]/5 font-medium' : ''
                  }`}
                >
                  {/* Patient Info */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.patient?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'}
                        alt={item.patient?.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {item.patient?.name || 'Unknown Patient'}
                          {isActive && (
                            <span className="text-[10px] font-semibold text-[#0F4C5C] bg-[#0F4C5C]/15 px-1.5 py-0.2 rounded">
                              Charting
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          MRN: {item.patient?.mrn} • {item.patient?.age}y {item.patient?.gender?.[0]}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Slot / Type */}
                  <td className="py-3 px-3 text-slate-700 font-mono">
                    <div>{item.timeSlot}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{item.type}</div>
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-3 max-w-xs text-slate-700">
                    <p className="truncate font-medium">{item.reason}</p>
                    {item.symptoms && item.symptoms.length > 0 && (
                      <span className="text-[10px] text-slate-500 truncate block">
                        {item.symptoms.join(', ')}
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Triage */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.triageLevel === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.triageLevel || 'Routine'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setActivePatientId(item.patientId);
                          if (onSelectPatient) onSelectPatient(item.patient);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isActive
                            ? 'bg-[#0F4C5C] text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Load patient file into split-screen charting"
                      >
                        Open Chart
                      </button>

                      {item.status !== 'Completed' && (
                        <button
                          onClick={() => {
                            setActivePatientId(item.patientId);
                            if (onStartConsultation) onStartConsultation(item);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
                          title="Launch live encrypted WebRTC consultation"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Admit Video</span>
                        </button>
                      )}

                      {item.status === 'In Consultation' && (
                        <button
                          onClick={() => handleStatusChange(item.id, 'Completed')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                          title="Mark Completed"
                        >
                          Finish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
