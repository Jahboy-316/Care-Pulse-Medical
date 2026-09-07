import { db } from './database';

export async function logAuditEvent({
  role = 'Provider Workspace (Doctor)',
  user = 'Dr. Evelyn Vance, MD',
  patientId = 'Unknown',
  patientName = 'Unknown Patient',
  action = 'VIEW_RECORD',
  details = ''
}) {
  try {
    const entry = {
      timestamp: new Date().toISOString(),
      role,
      user,
      patientId,
      patientName,
      action,
      details,
      ipAddress: '192.168.1.104',
      complianceStatus: 'VERIFIED'
    };
    const id = await db.audit_logs.add(entry);
    return { ...entry, id };
  } catch (error) {
    console.error('Failed to append HIPAA audit log entry:', error);
  }
}

export async function getAuditLogs(filter = {}) {
  try {
    let logs = await db.audit_logs.toArray();
    // Sort descending by timestamp
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (filter.role && filter.role !== 'ALL') {
      logs = logs.filter(l => l.role === filter.role);
    }
    if (filter.action && filter.action !== 'ALL') {
      logs = logs.filter(l => l.action === filter.action);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      logs = logs.filter(l =>
        (l.patientName && l.patientName.toLowerCase().includes(q)) ||
        (l.patientId && l.patientId.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q)) ||
        (l.user && l.user.toLowerCase().includes(q))
      );
    }
    return logs;
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return [];
  }
}
