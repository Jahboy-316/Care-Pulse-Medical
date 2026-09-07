import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, initializeDatabase } from '../db/database';
import { logAuditEvent } from '../db/auditService';

export const CarePulseContext = createContext(null);

export function CarePulseProvider({ children }) {
  const [isDbReady, setIsDbReady] = useState(false);
  const [currentRole, setCurrentRoleState] = useState(null);
  const [session, setSession] = useState(null);
  const [activePatientId, setActivePatientIdState] = useState('pt-001');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTelehealthApt, setActiveTelehealthApt] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Add toast notification
  const addToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch all state from Dexie IndexedDB
  const refreshData = useCallback(async () => {
    try {
      const allPatients = await db.patients.toArray();
      const allAppointments = await db.appointments.toArray();
      const allPrescriptions = await db.prescriptions.toArray();
      const allAuditLogs = await db.audit_logs.toArray();
      allAuditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setPatients(allPatients);
      setAppointments(allAppointments);
      setPrescriptions(allPrescriptions);
      setAuditLogs(allAuditLogs);
    } catch (err) {
      console.error('Failed to refresh data from IndexedDB:', err);
    }
  }, []);

  // Initialize DB on mount
  useEffect(() => {
    let mounted = true;
    async function setup() {
      await initializeDatabase();
      if (mounted) {
        await refreshData();
        setIsDbReady(true);
      }
    }
    setup();
    return () => { mounted = false; };
  }, [refreshData]);

  // An authenticated session is required before a workspace can be selected.
  // These demo staff IDs represent credentials provisioned by the hospital.
  const signIn = useCallback(({ accessType, identifier, dateOfBirth }) => {
    const cleanedIdentifier = identifier.trim().toUpperCase();
    if (accessType === 'patient') {
      const patient = patients.find(p => p.mrn.toUpperCase() === cleanedIdentifier && p.dob === dateOfBirth);
      if (!patient) return { ok: false, message: 'We could not verify that patient ID and date of birth.' };
      setActivePatientIdState(patient.id);
      setCurrentRoleState('Patient Portal');
      setSession({ type: 'patient', name: patient.name, patientId: patient.id });
      addToast('Welcome to CarePulse', 'Your care details are ready when you are.', 'success');
      return { ok: true };
    }

    const staff = {
      'CP-MD-1042': { role: 'Provider Workspace (Doctor)', name: 'Dr. Evelyn Vance, MD', type: 'doctor' },
      'CP-ADM-7001': { role: 'Admin / Compliance Console', name: 'CarePulse Compliance', type: 'admin' }
    }[cleanedIdentifier];
    if (!staff) return { ok: false, message: 'That hospital staff ID is not authorised for CarePulse.' };
    setCurrentRoleState(staff.role);
    setSession(staff);
    addToast('Secure sign-in complete', `Welcome, ${staff.name}.`, 'success');
    return { ok: true };
  }, [patients, addToast]);

  const signOut = useCallback(() => {
    setSession(null);
    setCurrentRoleState(null);
    setActiveTelehealthApt(null);
    addToast('Signed out', 'You have been securely signed out.', 'info');
  }, [addToast]);

  // Kept as a guarded helper for internal workspace navigation.
  const setCurrentRole = useCallback((newRole) => {
    if (!session || session.role !== newRole) return;
    setCurrentRoleState(newRole);
    logAuditEvent({
      role: newRole,
      user: newRole === 'Patient Portal' ? 'Patient User' : (newRole === 'Admin / Compliance Console' ? 'Chief Compliance Officer' : 'Dr. Evelyn Vance, MD'),
      patientId: activePatientId,
      patientName: patients.find(p => p.id === activePatientId)?.name || 'General Access',
      action: 'ROLE_SWITCH',
      details: `Switched operational context to: ${newRole}`
    }).then(refreshData);

    addToast('Role Switched', `Context updated to ${newRole}`, 'info');
  }, [activePatientId, patients, refreshData, addToast, session]);

  // Handle Active Patient selection
  const setActivePatientId = useCallback((id) => {
    setActivePatientIdState(id);
    const p = patients.find(pat => pat.id === id);
    if (p) {
      logAuditEvent({
        role: currentRole,
        user: currentRole === 'Patient Portal' ? p.name : 'Dr. Evelyn Vance, MD',
        patientId: p.id,
        patientName: p.name,
        action: 'VIEW_RECORD',
        details: `Active patient chart loaded: ${p.name} (MRN: ${p.mrn})`
      }).then(refreshData);
    }
  }, [currentRole, patients, refreshData]);

  // Start Telehealth Consultation
  const startTelehealthSession = useCallback(async (apt) => {
    setActiveTelehealthApt(apt);
    if (apt) {
      // Update appointment status to 'In Consultation'
      await db.appointments.update(apt.id, { status: 'In Consultation' });
      const pat = patients.find(p => p.id === apt.patientId);
      await logAuditEvent({
        role: currentRole,
        user: currentRole === 'Patient Portal' ? (pat?.name || 'Patient') : 'Dr. Evelyn Vance, MD',
        patientId: apt.patientId,
        patientName: pat?.name || 'Unknown Patient',
        action: 'CONSULTATION_STARTED',
        details: `Encrypted WebRTC Telehealth session initiated in room ${apt.roomPeerId || apt.id}`
      });
      await refreshData();
      addToast('Telehealth Activated', `Live encrypted consultation room started`, 'success');
    }
  }, [currentRole, patients, refreshData, addToast]);

  // End Telehealth Consultation
  const endTelehealthSession = useCallback(async (apt) => {
    if (apt) {
      await db.appointments.update(apt.id, { status: 'Completed' });
      const pat = patients.find(p => p.id === apt.patientId);
      await logAuditEvent({
        role: currentRole,
        user: currentRole === 'Patient Portal' ? (pat?.name || 'Patient') : 'Dr. Evelyn Vance, MD',
        patientId: apt.patientId,
        patientName: pat?.name || 'Unknown Patient',
        action: 'CONSULTATION_ENDED',
        details: `Telehealth consultation concluded for room ${apt.roomPeerId || apt.id}`
      });
      await refreshData();
    }
    setActiveTelehealthApt(null);
    addToast('Call Concluded', 'Telehealth consultation ended. Notes logged.', 'info');
  }, [currentRole, patients, refreshData, addToast]);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0] || null;

  return (
    <CarePulseContext.Provider
      value={{
        isDbReady,
        currentRole,
        setCurrentRole,
        session,
        signIn,
        signOut,
        activePatientId,
        setActivePatientId,
        activePatient,
        patients,
        appointments,
        prescriptions,
        auditLogs,
        activeTelehealthApt,
        startTelehealthSession,
        endTelehealthSession,
        refreshData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </CarePulseContext.Provider>
  );
}

export function useCarePulse() {
  const context = useContext(CarePulseContext);
  if (!context) {
    throw new Error('useCarePulse must be used within a CarePulseProvider');
  }
  return context;
}
