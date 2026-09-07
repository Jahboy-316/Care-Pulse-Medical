import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';

export default function ToastNotification() {
  const { toasts, removeToast } = useCarePulse();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let Icon = Info;
          let borderClass = 'border-l-4 border-[#0F4C5C] bg-white';
          let iconColor = 'text-[#0F4C5C]';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-l-4 border-[#2A9D8F] bg-white';
            iconColor = 'text-[#2A9D8F]';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-l-4 border-[#E9C46A] bg-white';
            iconColor = 'text-[#E9C46A]';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-l-4 border-[#F4A261] bg-white';
            iconColor = 'text-[#F4A261]';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg ${borderClass} border border-slate-200`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
