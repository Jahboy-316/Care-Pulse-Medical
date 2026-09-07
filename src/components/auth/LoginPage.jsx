import { useState } from 'react';
import { ArrowLeft, BadgeCheck, LockKeyhole, UserRound } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';

export default function LoginPage({ onBack }) {
  const { signIn } = useCarePulse();
  const [accessType, setAccessType] = useState('patient');
  const [identifier, setIdentifier] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const submit = event => { event.preventDefault(); const result = signIn({ accessType, identifier, dateOfBirth }); if (!result.ok) setError(result.message); };
  const changeType = type => { setAccessType(type); setIdentifier(''); setDateOfBirth(''); setError(''); };
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-md items-center px-5 py-12">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0F4C5C] hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Back to CarePulse</button>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F4C5C] text-[#2A9D8F]"><LockKeyhole className="h-5 w-5" /></div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Secure sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Choose the access that applies to you.</p>
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button onClick={() => changeType('patient')} className={`rounded-lg px-3 py-2 text-xs font-bold ${accessType === 'patient' ? 'bg-white text-[#0F4C5C] shadow-sm' : 'text-slate-500'}`}>Patient</button>
          <button onClick={() => changeType('staff')} className={`rounded-lg px-3 py-2 text-xs font-bold ${accessType === 'staff' ? 'bg-white text-[#0F4C5C] shadow-sm' : 'text-slate-500'}`}>Hospital staff</button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-slate-700">{accessType === 'patient' ? 'Patient ID (MRN)' : 'Hospital staff ID'}<input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder={accessType === 'patient' ? 'e.g. CP-84920' : 'e.g. CP-MD-1042'} required className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20" /></label>
          {accessType === 'patient' ? <label className="block text-xs font-bold text-slate-700">Date of birth<input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20" /></label> : <p className="rounded-xl bg-[#E9C46A]/15 p-3 text-xs leading-5 text-[#0F4C5C]"><BadgeCheck className="mr-1 inline h-3.5 w-3.5" /> Hospital-issued IDs determine your authorised workspace. Demo IDs: CP-MD-1042 and CP-ADM-7001.</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <button className="w-full rounded-xl bg-[#0F4C5C] py-3 text-sm font-bold text-white transition hover:bg-[#0b3d4a]">{accessType === 'patient' ? 'Open my care portal' : 'Verify staff access'}</button>
        </form>
        {accessType === 'patient' && <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2A9D8F]" /> Use the patient ID supplied by your hospital. Contact your care team if you need help accessing your portal.</p>}
      </div>
    </div>
  );
}
