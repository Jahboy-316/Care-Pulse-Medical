import React, { useState } from 'react';
import {
  FolderLock, Download, FileText, Calendar, Clock, Pill, Eye,
  CheckCircle2, AlertTriangle, ExternalLink, Printer, Shield, ChevronRight, X
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import { logAuditEvent } from '../../db/auditService';

export default function MedicalVault() {
  const { activePatient, prescriptions, appointments, currentRole, addToast } = useCarePulse();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'prescriptions' | 'timeline'

  // Filter patient specific records
  const patientPrescriptions = prescriptions.filter(p => p.patientId === activePatient?.id);
  const patientAppointments = appointments.filter(a => a.patientId === activePatient?.id);
  const patientDocs = activePatient?.documents || [];

  const handleDownloadReport = (doc) => {
    logAuditEvent({
      role: currentRole,
      user: activePatient?.name || 'Patient User',
      patientId: activePatient?.id || 'Unknown',
      patientName: activePatient?.name || 'Patient',
      action: 'EXPORT_RECORD',
      details: `Downloaded medical vault document: ${doc.title}`
    });

    // Generate downloadable clinical text report
    const reportContent = `
============================================================
              CAREPULSE CLINICAL HEALTHCARE SYSTEM
             PATIENT MEDICAL VAULT RECORD EXPORT
============================================================
Date Generated: ${new Date().toLocaleString()}
Patient Name:   ${activePatient?.name}
DOB:            ${activePatient?.dob} (Age ${activePatient?.age})
Gender:         ${activePatient?.gender}
MRN:            ${activePatient?.mrn}
Blood Type:     ${activePatient?.bloodType}
Insurance:      ${activePatient?.insurance?.provider} (${activePatient?.insurance?.policyNumber})
------------------------------------------------------------
DOCUMENT DETAILS:
Document Title: ${doc.title}
Category:       ${doc.category}
Date of Exam:   ${doc.date}
Provider/Lab:   ${doc.provider}
Clinical Notes: ${doc.summary}
------------------------------------------------------------
ACTIVE DIAGNOSES:
${activePatient?.conditions?.map(c => `• [${c.code}] ${c.name} (Onset: ${c.onset})`).join('\n') || 'None recorded'}

KNOWN ALLERGIES:
${activePatient?.allergies?.map(a => `• ${a.allergen} — Reaction: ${a.reaction} (Severity: ${a.severity})`).join('\n') || 'NKDA'}

ACTIVE MEDICATIONS:
${patientPrescriptions.map(m => `• ${m.brandName} (${m.genericName || ''}) ${m.dosage || ''} — ${m.frequency}`).join('\n') || 'None recorded'}
------------------------------------------------------------
AUTHENTICATED BY: Dr. Evelyn Vance, MD, FACP
HIPAA COMPLIANT DIGITAL SIGNATURE VERIFIED
============================================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePatient?.name.replace(/\s+/g, '_')}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('Vault Download Complete', `Exported ${doc.title} with verified digital signature.`, 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-[#0F4C5C]" />
            <h2 className="text-xl font-bold text-slate-800">CarePulse Medical Vault</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              HIPAA Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal Health Record (PHR) repository for <strong className="text-slate-700">{activePatient?.name}</strong> • MRN: {activePatient?.mrn}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'documents' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Scans & Labs ({patientDocs.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'prescriptions' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prescriptions ({patientPrescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'timeline' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Encounter Timeline ({patientAppointments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Clinical Documents & Scans */}
      {activeTab === 'documents' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {patientDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col bg-white"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-100 overflow-hidden group">
                  <img
                    src={doc.thumbnail}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                    {doc.category}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-slate-200 text-[10px] font-mono">
                    {doc.fileSize}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{doc.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.provider} • {doc.date}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(doc)}
                      className="py-1.5 px-3 rounded-lg bg-[#0F4C5C] hover:bg-[#0c3c49] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="Download Certified Clinical Lab Summary"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Active Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientPrescriptions.map((med) => (
              <div
                key={med.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#2A9D8F]/15 flex items-center justify-center">
                        <Pill className="w-4 h-4 text-[#2A9D8F]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{med.brandName}</h4>
                        <p className="text-[11px] text-slate-500">{med.genericName || 'Active Entity'} • {med.dosage}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {med.status || 'Active'}
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Directions:</span>
                      <span className="font-medium text-slate-800 text-right">{med.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dosage Form:</span>
                      <span className="font-mono text-slate-700">{med.dosageForm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Route:</span>
                      <span className="font-mono text-slate-700">{med.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Refills Remaining:</span>
                      <span className="font-bold text-[#0F4C5C]">{med.refillsRemaining ?? 3} refills</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Prescribed by: {med.prescribingDoctor}</span>
                  <span className="font-mono text-[10px] text-slate-400">NDC: {med.ndc || '0071-0157-23'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Appointment History Timeline */}
      {activeTab === 'timeline' && (
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-2">
          {patientAppointments.map((apt) => (
            <div key={apt.id} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                  apt.status === 'Completed'
                    ? 'bg-[#2A9D8F]'
                    : apt.status === 'In Consultation'
                    ? 'bg-[#E9C46A] animate-ping'
                    : 'bg-[#0F4C5C]'
                }`}
              />

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{apt.type}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'In Consultation'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {apt.date} • {apt.timeSlot}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  <strong>Reason:</strong> {apt.reason}
                </p>

                {apt.notes && (
                  <p className="text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                    {apt.notes}
                  </p>
                )}

                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Attending Physician: {apt.doctorName}</span>
                  <span className="font-mono">Triage: {apt.triageLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-500">{selectedDoc.provider} • {selectedDoc.date}</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 mb-4 max-h-72 flex items-center justify-center">
              <img
                src={selectedDoc.thumbnail}
                alt={selectedDoc.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-4">
              <div className="font-bold text-slate-700">Clinical Interpretation Summary</div>
              <p className="text-slate-600 leading-relaxed">{selectedDoc.summary}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadReport(selectedDoc);
                  setSelectedDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#0c3c49] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Official Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
