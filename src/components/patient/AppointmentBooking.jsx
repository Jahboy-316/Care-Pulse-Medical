import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle2, ShieldAlert, Sparkles, Video } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import { db } from '../../db/database';
import { logAuditEvent } from '../../db/auditService';

const AVAILABLE_DOCTORS = [
  {
    name: 'Dr. Evelyn Vance, MD',
    specialty: 'Internal Medicine & Virtual Telehealth Director',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    experience: '16+ yrs exp • Harvard Medical School',
    rating: '4.98 (380 reviews)'
  },
  {
    name: 'Dr. Julian Sterling, MD',
    specialty: 'Cardiovascular Medicine & Tele-Cardiology',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    experience: '12+ yrs exp • Johns Hopkins Medicine',
    rating: '4.95 (290 reviews)'
  },
  {
    name: 'Dr. Maya Lin, MD',
    specialty: 'Pulmonology, Allergy & Asthma Care',
    avatar: 'https://images.unsplash.com/photo-1594824813590-48924b2b62d8?w=400&auto=format&fit=crop&q=80',
    experience: '14+ yrs exp • Columbia University Irving Medical',
    rating: '4.97 (315 reviews)'
  }
];

const TIME_SLOTS = [
  '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
  '01:15 PM', '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
];

const COMMON_SYMPTOMS = [
  'Medication Refill', 'Hypertension Review', 'Blood Glucose Check',
  'Asthma / Wheezing', 'Migraine / Headache', 'Fatigue / Malaise',
  'Lab Results Review', 'Seasonal Allergies', 'Routine Wellness Follow-Up'
];

export default function AppointmentBooking({ onBookingComplete }) {
  const { activePatient, refreshData, addToast, currentRole } = useCarePulse();

  const [selectedDoctor, setSelectedDoctor] = useState(AVAILABLE_DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  const [reason, setReason] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Medication Refill']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      addToast('Reason Required', 'Please enter a brief clinical reason for the appointment.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newApt = {
        id: `apt-${Date.now()}`,
        patientId: activePatient?.id || 'pt-001',
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorAvatar: selectedDoctor.avatar,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: 'Telehealth Consultation',
        status: 'Waiting', // Put in waiting queue so patient can immediately enter waiting room!
        reason: reason.trim(),
        symptoms: selectedSymptoms,
        triageLevel: selectedSymptoms.includes('Asthma / Wheezing') ? 'Urgent' : 'Routine',
        estimatedWaitMins: 6,
        roomPeerId: `carepulse-room-${activePatient?.id || 'pt001'}-${Math.floor(Math.random()*1000)}`,
        notes: `Booked via Patient Portal. Primary complaint: ${reason.trim()}`
      };

      await db.appointments.add(newApt);

      await logAuditEvent({
        role: currentRole,
        user: activePatient?.name || 'Patient User',
        patientId: activePatient?.id || 'pt-001',
        patientName: activePatient?.name || 'Eleanor Vance',
        action: 'APPOINTMENT_SCHEDULED',
        details: `Scheduled ${newApt.type} with ${newApt.doctorName} on ${newApt.date} at ${newApt.timeSlot}. Symptoms: ${selectedSymptoms.join(', ')}`
      });

      await refreshData();
      setBookingSuccess(newApt);
      addToast('Slot Confirmed', `Appointment booked with ${selectedDoctor.name} at ${selectedSlot}`, 'success');

      if (onBookingComplete) {
        onBookingComplete(newApt);
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      addToast('Booking Failed', 'Unable to record appointment in local EHR database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-[#2A9D8F]/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-[#2A9D8F]" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Telehealth Slot Confirmed</h3>
        <p className="text-sm text-slate-500 mt-1">
          Your virtual appointment has been recorded in the local EHR and scheduled.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Provider:</span>
            <span className="font-semibold text-slate-800">{bookingSuccess.doctorName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Date & Slot:</span>
            <span className="font-semibold text-slate-800">{bookingSuccess.date} • {bookingSuccess.timeSlot}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Consultation Type:</span>
            <span className="font-semibold text-[#0F4C5C] bg-[#0F4C5C]/10 px-2 py-0.5 rounded">
              {bookingSuccess.type}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Encrypted Room ID:</span>
            <span className="font-mono text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded">
              {bookingSuccess.roomPeerId}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setBookingSuccess(null)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBookAppointment} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0F4C5C]" />
            Appointment Booking Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your clinical provider, real-time telehealth slot, and clinical symptoms.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Instant Slot Reservation
        </span>
      </div>

      {/* 1. Select Clinical Provider */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          1. Select Clinical Provider
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {AVAILABLE_DOCTORS.map((doc) => {
            const isSelected = selectedDoctor.name === doc.name;
            return (
              <div
                key={doc.name}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 ring-2 ring-[#0F4C5C]/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-snug">{doc.name}</div>
                  <div className="text-[11px] text-[#0F4C5C] font-medium leading-tight mt-0.5">{doc.specialty}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{doc.rating}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Date & Time Slot Picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            2. Appointment Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] focus:border-[#0F4C5C] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            3. Dynamic Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-[#0F4C5C] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Reason & Symptoms */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          4. Reason for Consultation
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe your current symptoms, medication questions, or goals for this telehealth encounter..."
          className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] focus:border-[#0F4C5C] transition"
        />
      </div>

      {/* 4. Common Symptoms Tag Cloud */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Relevant Clinical Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((sym) => {
            const active = selectedSymptoms.includes(sym);
            return (
              <button
                type="button"
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  active
                    ? 'bg-[#2A9D8F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          Booking as <strong className="text-slate-700">{activePatient?.name}</strong> • MRN: {activePatient?.mrn}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#0c3c49] text-white text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Securing Slot...</span>
          ) : (
            <>
              <Video className="w-4 h-4 text-[#2A9D8F]" />
              Confirm & Book Telehealth Slot
            </>
          )}
        </button>
      </div>
    </form>
  );
}
