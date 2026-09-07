import { useState } from 'react';
import { Calendar, ChevronLeft, FileText } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import AppointmentBooking from './AppointmentBooking';
import TelehealthWaitingRoom from './TelehealthWaitingRoom';
import VideoConsultationSuite from './VideoConsultationSuite';
import MedicalVault from './MedicalVault';

export default function PatientPortal() {
  const { activePatient, appointments, activeTelehealthApt, startTelehealthSession, endTelehealthSession } = useCarePulse();
  const [section, setSection] = useState('home');
  const [inCall, setInCall] = useState(false);
  const patientAppointments = appointments.filter(a => a.patientId === activePatient?.id);
  const nextAppointment = patientAppointments.find(a => a.status === 'Waiting' || a.status === 'In Consultation') || patientAppointments[0];
  const joinCall = apt => { startTelehealthSession(apt || nextAppointment); setInCall(true); };
  const endCall = () => { endTelehealthSession(nextAppointment); setInCall(false); };

  if (inCall || activeTelehealthApt) return <div className="mx-auto max-w-6xl px-4 py-6"><VideoConsultationSuite appointment={activeTelehealthApt || nextAppointment} onEndCall={endCall} /></div>;

  const content = {
    visit: <TelehealthWaitingRoom appointment={nextAppointment} onJoinCall={joinCall} />,
    book: <AppointmentBooking onBookingComplete={() => setSection('home')} />,
    records: <MedicalVault />
  };
  if (section !== 'home') return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><button onClick={() => setSection('home')} className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0F4C5C] hover:underline"><ChevronLeft className="h-4 w-4" /> Back to my care</button>{content[section]}</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-[#2A9D8F]">My Care</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Hello, {activePatient?.name?.split(' ')[0]}.</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">Everything important for your care is right here. Choose what you would like to do.</p>
      </section>

      <section className="mt-10 rounded-3xl border border-[#0F4C5C]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Your next appointment</p>
        {nextAppointment ? <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-bold text-[#0F4C5C]">{nextAppointment.date} at {nextAppointment.timeSlot}</h2><p className="mt-1 text-sm text-slate-600">{nextAppointment.reason || 'Care appointment'} · {nextAppointment.doctorName || 'Your care team'}</p></div><button onClick={() => setSection('visit')} className="rounded-xl bg-[#2A9D8F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#238276]">Prepare for my visit</button></div> : <div className="mt-3"><p className="text-sm text-slate-600">You do not have an upcoming appointment.</p><button onClick={() => setSection('book')} className="mt-4 rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-bold text-white">Book a visit</button></div>}
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <ActionCard icon={Calendar} title="Book an appointment" text="Choose a time to meet with your care team." action="Book a visit" onClick={() => setSection('book')} />
        <ActionCard icon={FileText} title="View my health records" text="Review your documents, medications, and visit history." action="Open records" onClick={() => setSection('records')} />
      </section>
    </div>
  );
}

function ActionCard({ icon: Icon, title, text, action, onClick }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F4C5C]/8 text-[#0F4C5C]"><Icon className="h-5 w-5" /></span><h2 className="mt-5 text-lg font-bold text-slate-800">{title}</h2><p className="mt-2 min-h-10 text-sm leading-6 text-slate-600">{text}</p><button onClick={onClick} className="mt-5 text-sm font-bold text-[#0F4C5C] hover:underline">{action} →</button></div>;
}
