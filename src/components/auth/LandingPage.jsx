import { Activity, CalendarCheck, LockKeyhole, Video } from 'lucide-react';

export default function LandingPage({ onLogin }) {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.15fr_.85fr] md:items-center md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2A9D8F]/10 px-3 py-1 text-xs font-bold text-[#0F4C5C]"><Activity className="h-3.5 w-3.5" /> CARE THAT FEELS CLEAR</span>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#0F4C5C] sm:text-5xl">Your health care, in one calm place.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">CarePulse helps you prepare for visits, join a telehealth appointment, and find important health information without making you sort through a complicated medical system.</p>
          <button onClick={onLogin} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b3d4a]">Log in securely <span aria-hidden="true">→</span></button>
          <p className="mt-3 text-xs text-slate-500">Patients, doctors, and authorised hospital staff use separate secure access.</p>
        </div>
        <div className="rounded-3xl border border-[#0F4C5C]/10 bg-white p-6 shadow-xl shadow-[#0F4C5C]/10 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800">What you can do</h2>
          <div className="mt-6 space-y-5">
            <Feature icon={CalendarCheck} title="Keep appointments simple" text="See your next visit and book a time that works for you." />
            <Feature icon={Video} title="Meet your care team online" text="Enter a secure virtual waiting room when it is time for your visit." />
            <Feature icon={LockKeyhole} title="Your information stays protected" text="Your portal is private and only available after you sign in." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A9D8F]/10 text-[#2A9D8F]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-bold text-slate-800">{title}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{text}</p></div></div>;
}
