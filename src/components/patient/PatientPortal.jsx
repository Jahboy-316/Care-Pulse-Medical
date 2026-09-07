import React, { useState } from 'react';
import {
  Calendar, Video, FolderLock, User, HeartPulse, Clock, Sparkles,
  CheckCircle2, AlertCircle, PhoneCall
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import AppointmentBooking from './AppointmentBooking';
import TelehealthWaitingRoom from './TelehealthWaitingRoom';
import VideoConsultationSuite from './VideoConsultationSuite';
import MedicalVault from './MedicalVault';

export default function PatientPortal() {
  const {
    activePatient,
    appointments,
    activeTelehealthApt,
    startTelehealthSession,
    endTelehealthSession
  } = useCarePulse();

  const [activeTab, setActiveTab] = useState('waiting-room'); // 'waiting-room' | 'booking' | 'vault'
  const [inCall, setInCall] = useState(false);

  // Find most recent or pending appointment for this patient
  const patientAppointments = appointments.filter(a => a.patientId === activePatient?.id);
  const currentAppointment = patientAppointments.find(a => a.status === 'Waiting' || a.status === 'In Consultation') || patientAppointments[0];

  const handleJoinCall = (apt) => {
    startTelehealthSession(apt || currentAppointment);
    setInCall(true);
  };

  const handleEndCall = () => {
    endTelehealthSession(currentAppointment);
    setInCall(false);
  };

  if (inCall || activeTelehealthApt) {
    return (
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <VideoConsultationSuite
          appointment={activeTelehealthApt || currentAppointment}
          onEndCall={handleEndCall}
        />
      </div>
    );
  }

  return (
    <div className="py-7 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={activePatient?.avatar}
              alt={activePatient?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2A9D8F] shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2A9D8F] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hello, {activePatient?.name?.split(' ')[0]}</h1>
            <p className="text-sm text-slate-500 mt-1">Here is what you need for your care today.</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Your care information is secure
              </span>
            </div>
          </div>
        </div>

        {/* Quick Encounter Action Pill */}
        {currentAppointment && (
          <div className="bg-[#0F4C5C]/5 border border-[#0F4C5C]/15 p-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#0F4C5C] tracking-wider">
                Next Appointment
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                {currentAppointment.date} at {currentAppointment.timeSlot}
              </div>
              <div className="text-[11px] text-slate-500">With {currentAppointment.doctorName}</div>
            </div>
            <button
              onClick={() => {
                setActiveTab('waiting-room');
              }}
              className="px-4 py-2 rounded-xl bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Enter Suite</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('waiting-room')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer relative ${
            activeTab === 'waiting-room'
              ? 'text-[#0F4C5C] border-b-2 border-[#0F4C5C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>My visit</span>
          {currentAppointment?.status === 'Waiting' && (
            <span className="w-2 h-2 rounded-full bg-[#E9C46A] animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer relative ${
            activeTab === 'booking'
              ? 'text-[#0F4C5C] border-b-2 border-[#0F4C5C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Book a visit</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer relative ${
            activeTab === 'vault'
              ? 'text-[#0F4C5C] border-b-2 border-[#0F4C5C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>My health records</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'waiting-room' && (
        <TelehealthWaitingRoom
          appointment={currentAppointment}
          onJoinCall={handleJoinCall}
        />
      )}

      {activeTab === 'booking' && (
        <AppointmentBooking
          onBookingComplete={(apt) => {
            setActiveTab('waiting-room');
          }}
        />
      )}

      {activeTab === 'vault' && (
        <MedicalVault />
      )}

    </div>
  );
}
