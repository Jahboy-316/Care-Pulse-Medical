import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCarePulse } from './context/CarePulseContext';
import Navbar from './components/common/Navbar';
import ToastNotification from './components/common/ToastNotification';
import PatientPortal from './components/patient/PatientPortal';
import ProviderWorkspace from './components/provider/ProviderWorkspace';
import AdminConsole from './components/admin/AdminConsole';
import LandingPage from './components/auth/LandingPage';
import LoginPage from './components/auth/LoginPage';
import Footer from './components/common/Footer';

// Loading skeleton for first IndexedDB seed
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2A9D8F] to-[#E9C46A] p-0.5 shadow-lg">
          <div className="w-full h-full bg-[#0F4C5C] rounded-[14px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2A9D8F] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F4C5C]">CarePulse EHR</h1>
          <p className="text-xs text-slate-500 mt-1">Initializing Clinical Database &amp; Seeding Patient Records...</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0F4C5C] to-[#2A9D8F] rounded-full animate-pulse w-2/3" />
        </div>

        <p className="text-[11px] text-slate-400 font-mono">Seeding 5 patient EHR records to IndexedDB...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { isDbReady, currentRole, session } = useCarePulse();
  const [screen, setScreen] = React.useState('landing');

  if (!isDbReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Navbar onSignOut={() => setScreen('landing')} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!session && screen === 'landing' && <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LandingPage onLogin={() => setScreen('login')} /></motion.div>}
          {!session && screen === 'login' && <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><LoginPage onBack={() => setScreen('landing')} /></motion.div>}
          {currentRole === 'Patient Portal' && (
            <motion.div
              key="patient"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <PatientPortal />
            </motion.div>
          )}

          {currentRole === 'Provider Workspace (Doctor)' && (
            <motion.div
              key="provider"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <ProviderWorkspace />
            </motion.div>
          )}

          {currentRole === 'Admin / Compliance Console' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <AdminConsole />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <ToastNotification />
    </div>
  );
}
