import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend
} from 'recharts';
import { Activity, Heart, Droplets, Wind, Scale } from 'lucide-react';

export default function VitalsGraph({ vitalsHistory = [] }) {
  const [metric, setMetric] = useState('bp'); // 'bp' | 'hr' | 'glucose' | 'spo2'

  if (!vitalsHistory || vitalsHistory.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
        No historical vitals records logged.
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4">
      
      {/* Metric Switcher Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Activity className="w-4 h-4 text-[#0F4C5C]" />
          <span>Longitudinal Vitals Trends</span>
        </div>

        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setMetric('bp')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              metric === 'bp' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BP (mmHg)
          </button>
          <button
            type="button"
            onClick={() => setMetric('hr')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              metric === 'hr' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HR (bpm)
          </button>
          <button
            type="button"
            onClick={() => setMetric('glucose')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              metric === 'glucose' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Glucose
          </button>
          <button
            type="button"
            onClick={() => setMetric('spo2')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              metric === 'spo2' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SpO2 (%)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-52 w-full text-xs">
        {metric === 'bp' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 160]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <ReferenceLine y={130} stroke="#F4A261" strokeDasharray="3 3" label={{ value: 'Stage 1 HTN (130)', position: 'insideTopRight', fill: '#F4A261', fontSize: 9 }} />
              <ReferenceLine y={80} stroke="#2A9D8F" strokeDasharray="3 3" label={{ value: 'Goal Diastolic (80)', position: 'insideBottomRight', fill: '#2A9D8F', fontSize: 9 }} />
              <Line type="monotone" dataKey="systolic" stroke="#0F4C5C" strokeWidth={2.5} dot={{ r: 4, fill: '#0F4C5C' }} name="Systolic BP" />
              <Line type="monotone" dataKey="diastolic" stroke="#2A9D8F" strokeWidth={2.5} dot={{ r: 4, fill: '#2A9D8F' }} name="Diastolic BP" />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {metric === 'hr' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 110]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
              />
              <ReferenceLine y={100} stroke="#F4A261" strokeDasharray="3 3" label={{ value: 'Tachycardia (100)', fill: '#F4A261', fontSize: 9 }} />
              <ReferenceLine y={60} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Bradycardia (60)', fill: '#64748b', fontSize: 9 }} />
              <Area type="monotone" dataKey="heartRate" stroke="#2A9D8F" strokeWidth={2.5} fillOpacity={1} fill="url(#hrGrad)" name="Heart Rate (BPM)" />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {metric === 'glucose' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[70, 160]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
              />
              <ReferenceLine y={130} stroke="#F4A261" strokeDasharray="3 3" label={{ value: 'ADA Pre-Meal Cap (130)', fill: '#F4A261', fontSize: 9 }} />
              <Line type="monotone" dataKey="glucose" stroke="#E9C46A" strokeWidth={3} dot={{ r: 4, fill: '#E9C46A' }} name="Fasting Glucose (mg/dL)" />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {metric === 'spo2' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C5C" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0F4C5C" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[92, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F4C5C', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
              />
              <ReferenceLine y={95} stroke="#F4A261" strokeDasharray="3 3" label={{ value: 'Hypoxemia Cutoff (<95%)', fill: '#F4A261', fontSize: 9 }} />
              <Area type="monotone" dataKey="spO2" stroke="#0F4C5C" strokeWidth={2.5} fillOpacity={1} fill="url(#spo2Grad)" name="SpO2 Saturation (%)" />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Latest Vitals Metric Summary Strip */}
      {vitalsHistory.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-center">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200">
            <div className="text-[10px] text-slate-400">Latest BP</div>
            <div className="text-xs font-bold text-slate-800">
              {vitalsHistory.slice(-1)[0].systolic}/{vitalsHistory.slice(-1)[0].diastolic}
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-slate-200">
            <div className="text-[10px] text-slate-400">Heart Rate</div>
            <div className="text-xs font-bold text-[#2A9D8F]">
              {vitalsHistory.slice(-1)[0].heartRate} bpm
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-slate-200">
            <div className="text-[10px] text-slate-400">Glucose</div>
            <div className="text-xs font-bold text-slate-800">
              {vitalsHistory.slice(-1)[0].glucose} mg/dL
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-slate-200">
            <div className="text-[10px] text-slate-400">SpO2</div>
            <div className="text-xs font-bold text-[#0F4C5C]">
              {vitalsHistory.slice(-1)[0].spO2}%
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
