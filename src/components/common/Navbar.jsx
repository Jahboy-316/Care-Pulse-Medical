import { Activity, Lock, LogOut } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';

export default function Navbar({ onSignOut }) {
  const { session, currentRole, activePatient, signOut } = useCarePulse();
  const label = currentRole === 'Patient Portal' ? 'My Care Portal' : currentRole === 'Provider Workspace (Doctor)' ? 'Doctor Workspace' : 'Compliance Console';
  return (
    <header className="sticky top-0 z-40 border-b border-[#0F4C5C]/80 bg-[#0F4C5C] text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2A9D8F]/30 bg-[#0F4C5C] text-[#2A9D8F]"><Activity className="h-5 w-5" /></div><div><p className="text-xl font-bold tracking-tight">CarePulse</p><p className="hidden text-[10px] text-slate-300 sm:block">EHR & Telehealth</p></div></div>
        {session && <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-semibold">{session.name || activePatient?.name}</p><p className="flex items-center justify-end gap-1 text-[10px] text-emerald-200"><Lock className="h-2.5 w-2.5" /> {label}</p></div><button onClick={() => { signOut(); onSignOut?.(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-bold transition hover:bg-white/10"><LogOut className="h-3.5 w-3.5" /> Sign out</button></div>}
      </div>
    </header>
  );
}
