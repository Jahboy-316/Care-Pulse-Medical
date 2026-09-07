import React from 'react';
import {
  User, ShieldAlert, AlertTriangle, HeartPulse, Activity,
  FileCheck, Download, ExternalLink, Calendar, Phone, Mail, MapPin, Droplets
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import VitalsGraph from './VitalsGraph';
import { generateFhirR4Bundle } from '../../utils/fhirExport';
import { logAuditEvent } from '../../db/auditService';

export default function PatientChartLeftPanel({ patient }) {
  const { prescriptions, currentRole, addToast } = useCarePulse();

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        No patient file selected. Select a patient from the Live Intake Queue.
      </div>
    );
  }

  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);

  const handleExportFhir = () => {
    try {
      const bundle = generateFhirR4Bundle(patient, patient.vitalsHistory, patientPrescriptions);
      const jsonStr = JSON.stringify(bundle, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/fhir+json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FHIR_R4_${patient.name.replace(/\s+/g, '_')}_${patient.mrn}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logAuditEvent({
        role: currentRole,
        user: 'Dr. Evelyn Vance, MD',
        patientId: patient.id,
        patientName: patient.name,
        action: 'EXPORT_RECORD',
        details: `Exported HL7 FHIR R4 JSON Bundle (${bundle.entry.length} clinical resources)`
      });

      addToast('HL7 FHIR Exported', `Generated FHIR R4 Document Bundle with ${bundle.entry.length} resources`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Export Error', 'Failed to generate FHIR bundle', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5 h-full overflow-y-auto">
      
      {/* Patient Demographic Card */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{patient.name}</h2>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {patient.mrn}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.age}y {patient.gender} • DOB: {patient.dob} • Blood: <strong className="text-slate-700">{patient.bloodType}</strong>
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{patient.address}</span>
            </p>
          </div>
        </div>

        {/* FHIR Export Button */}
        <button
          onClick={handleExportFhir}
          className="px-2.5 py-1.5 rounded-xl border border-[#0F4C5C]/30 bg-[#0F4C5C]/5 hover:bg-[#0F4C5C]/10 text-[#0F4C5C] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
          title="Export HL7 FHIR Standard R4 JSON Bundle"
        >
          <Download className="w-3.5 h-3.5 text-[#0F4C5C]" />
          <span>FHIR R4</span>
        </button>
      </div>

      {/* ALLERGY ALERTS BANNER (High Visibility Priority) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Clinical Allergy Alerts</span>
        </div>
        <div className="space-y-1.5">
          {patient.allergies && patient.allergies.length > 0 ? (
            patient.allergies.map((allergy, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 text-xs ${
                  allergy.severity === 'High'
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${allergy.severity === 'High' ? 'text-rose-600' : 'text-amber-600'}`} />
                  <div>
                    <span className="font-bold">{allergy.allergen}</span>
                    <p className="text-[11px] opacity-90 mt-0.5">Reaction: {allergy.reaction}</p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  allergy.severity === 'High' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  {allergy.severity} Severity
                </span>
              </div>
            ))
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No Known Drug Allergies (NKDA)
            </div>
          )}
        </div>
      </div>

      {/* Active Diagnoses / Problem List */}
      <div>
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Active Problem List (ICD-10)
        </div>
        <div className="space-y-1.5">
          {patient.conditions && patient.conditions.map((cond, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-semibold text-slate-800">{cond.name}</span>
                <span className="text-[10px] text-slate-500 block">Onset: {cond.onset}</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#0F4C5C] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                {cond.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals Graphing Section */}
      <VitalsGraph vitalsHistory={patient.vitalsHistory} />

      {/* Historical Diagnostic Lab Panel */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          <span>Recent Diagnostic Lab Values</span>
          <span className="text-[10px] text-slate-400 font-normal">Labcorp / Quest Sync</span>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase">
              <tr>
                <th className="py-2 px-2.5">Test Name</th>
                <th className="py-2 px-2.5">Result</th>
                <th className="py-2 px-2.5">Ref Range</th>
                <th className="py-2 px-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patient.historicalLabs && patient.historicalLabs.map((lab, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-2 px-2.5 font-medium text-slate-800">{lab.testName}</td>
                  <td className="py-2 px-2.5 font-mono font-bold text-slate-900">
                    {lab.value} <span className="text-[10px] font-normal text-slate-500">{lab.unit}</span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-500 text-[11px] font-mono">{lab.referenceRange}</td>
                  <td className="py-2 px-2.5 text-right">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      lab.status === 'Elevated'
                        ? 'bg-amber-100 text-amber-800'
                        : lab.status === 'Low'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {lab.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Contact & Insurance Footer */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
        <div>
          <strong>Healthcare Proxy:</strong> {patient.emergencyContact?.name} ({patient.emergencyContact?.phone})
        </div>
        <div>
          <strong>Primary Payer:</strong> {patient.insurance?.provider} • Policy #{patient.insurance?.policyNumber}
        </div>
      </div>

    </div>
  );
}
