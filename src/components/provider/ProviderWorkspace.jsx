import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, SplitSquareHorizontal, Video } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import ClinicalQueue from './ClinicalQueue';
import PatientChartLeftPanel from './PatientChartLeftPanel';
import SoapNoteRightPanel from './SoapNoteRightPanel';
import VideoConsultationSuite from '../patient/VideoConsultationSuite';

export default function ProviderWorkspace() {
  const {
    activePatient,
    appointments,
    activeTelehealthApt,
    startTelehealthSession,
    endTelehealthSession
  } = useCarePulse();

  const [inVideoCall, setInVideoCall] = useState(false);
  const [callAppointment, setCallAppointment] = useState(null);
  const [view, setView] = useState('queue'); // 'queue' | 'split-chart'

  const handleStartConsultation = (apt) => {
    setCallAppointment(apt);
    startTelehealthSession(apt);
    setInVideoCall(true);
  };

  const handleEndCall = () => {
    endTelehealthSession(callAppointment);
    setInVideoCall(false);
    setCallAppointment(null);
  };

  const handleSelectPatient = (patient) => {
    setView('split-chart');
  };

  // Find active appointment for the currently selected patient
  const activeAppointment = appointments.find(
    a => a.patientId === activePatient?.id && (a.status === 'Waiting' || a.status === 'In Consultation')
  ) || appointments.find(a => a.patientId === activePatient?.id);

  if (inVideoCall) {
    return (
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <VideoConsultationSuite
          appointment={callAppointment || activeTelehealthApt}
          onEndCall={handleEndCall}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F4C5C] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Provider EHR Workspace</h1>
              <p className="text-xs text-slate-500">
                Dr. Evelyn Vance, MD — Internal Medicine & Telehealth Lead
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-xs gap-1">
          <button
            onClick={() => setView('queue')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              view === 'queue'
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Live Queue & Telehealth
          </button>
          <button
            onClick={() => setView('split-chart')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              view === 'split-chart'
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            Split-Screen Charting
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'queue' && (
          <motion.div
            key="queue-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <ClinicalQueue
              onSelectPatient={handleSelectPatient}
              onStartConsultation={handleStartConsultation}
            />
          </motion.div>
        )}

        {view === 'split-chart' && (
          <motion.div
            key="split-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-5"
            style={{ minHeight: '80vh' }}
          >
            {/* Left Panel: Comprehensive Patient File & Vitals */}
            <div className="xl:max-h-[calc(100vh-200px)] xl:overflow-y-auto">
              <PatientChartLeftPanel patient={activePatient} />
            </div>

            {/* Right Panel: SOAP Note + OpenFDA Prescriber */}
            <div className="xl:max-h-[calc(100vh-200px)] xl:overflow-y-auto">
              <SoapNoteRightPanel
                patient={activePatient}
                activeAppointment={activeAppointment}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
