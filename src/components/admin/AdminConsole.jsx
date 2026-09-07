import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BarChart2, Settings, Lock } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import AuditLogTable from './AuditLogTable';
import PracticeAnalytics from './PracticeAnalytics';

export default function AdminConsole() {
  const { auditLogs, patients, appointments } = useCarePulse();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'audit'

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C5C] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Practice overview</h1>
            <p className="mt-1 text-sm text-slate-500">Secure operations and compliance</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure storage active</span>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 gap-5">
        {[
          { label: 'Patient records', value: patients.length, color: 'text-[#0F4C5C]' },
          { label: 'Upcoming appointments', value: appointments.filter(p => p.status !== 'Completed').length, color: 'text-[#2A9D8F]' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="mt-1 text-sm font-semibold text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'text-[#0F4C5C] border-b-2 border-[#0F4C5C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'audit'
              ? 'text-[#0F4C5C] border-b-2 border-[#0F4C5C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Audit activity
          {auditLogs.length > 0 && (
            <span className="text-[10px] bg-[#0F4C5C] text-white rounded-full px-1.5 py-0.5 font-bold">
              {auditLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PracticeAnalytics />
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AuditLogTable />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
