import Dexie from 'dexie';
import { initialPatients, initialAppointments, initialEncounters, initialAuditLogs } from './seedData';

export const db = new Dexie('CarePulseEHR');

db.version(1).stores({
  patients: 'id, mrn, name, gender, bloodType',
  appointments: 'id, patientId, date, timeSlot, status, type',
  encounters: 'id, appointmentId, patientId, doctorName, date, isSigned',
  audit_logs: '++id, timestamp, role, patientId, action, complianceStatus',
  prescriptions: 'id, patientId, brandName, genericName, status, prescribingDoctor'
});

export async function initializeDatabase() {
  try {
    const patientCount = await db.patients.count();
    if (patientCount === 0) {
      console.log('Seeding initial CarePulse EHR clinical database...');
      await db.patients.bulkAdd(initialPatients);
      await db.appointments.bulkAdd(initialAppointments);
      await db.encounters.bulkAdd(initialEncounters);
      await db.audit_logs.bulkAdd(initialAuditLogs);

      // Seed prescriptions from initial patient active medications
      const prescriptions = [];
      initialPatients.forEach(p => {
        if (p.activeMedications) {
          p.activeMedications.forEach(m => {
            prescriptions.push({
              ...m,
              patientId: p.id,
              patientName: p.name,
              mrn: p.mrn
            });
          });
        }
      });
      if (prescriptions.length > 0) {
        await db.prescriptions.bulkAdd(prescriptions);
      }
      console.log('CarePulse database seeded successfully.');
    }
  } catch (err) {
    console.error('Error initializing CarePulse database:', err);
  }
}
