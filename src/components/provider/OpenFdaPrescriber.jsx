import React, { useState, useEffect, useRef } from 'react';
import { Pill, Search, Check, AlertCircle, Sparkles, Plus, Loader2, ShieldCheck } from 'lucide-react';
import { searchOpenFdaMedications } from '../../api/openFda';
import { useCarePulse } from '../../context/CarePulseContext';
import { db } from '../../db/database';
import { logAuditEvent } from '../../db/auditService';

export default function OpenFdaPrescriber({ patient, onPrescriptionAdded }) {
  const { currentRole, refreshData, addToast } = useCarePulse();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily in the morning');
  const [refills, setRefills] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Debounced OpenFDA NDC live search on keypress
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setDropdownOpen(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const hits = await searchOpenFdaMedications(query);
        setResults(hits);
        setDropdownOpen(hits.length > 0);
      } catch (e) {
        console.warn('OpenFDA search error:', e);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query]);

  const handleSelectDrug = (drug) => {
    setSelectedDrug(drug);
    setQuery(drug.brandName);
    // Set default strength from active ingredients if available
    const defaultStrength = drug.activeIngredients?.[0]?.strength || '';
    setDosage(defaultStrength);
    setDropdownOpen(false);
  };

  const handlePrescribe = async (e) => {
    e.preventDefault();
    if (!selectedDrug && !query.trim()) {
      addToast('Input Required', 'Please search for and select an FDA drug.', 'warning');
      return;
    }

    const drugToPrescribe = selectedDrug || {
      brandName: query.trim(),
      genericName: query.trim(),
      dosageForm: 'TABLET',
      route: 'ORAL',
      activeIngredients: [{ name: query.trim(), strength: dosage || 'Standard' }],
      productNdc: 'FDA-REG-001'
    };

    const newPrescription = {
      id: `rx-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      mrn: patient.mrn,
      brandName: drugToPrescribe.brandName,
      genericName: drugToPrescribe.genericName,
      dosage: dosage || drugToPrescribe.activeIngredients?.[0]?.strength || 'Standard Dosage',
      dosageForm: drugToPrescribe.dosageForm,
      route: drugToPrescribe.route,
      frequency,
      refillsRemaining: Number(refills),
      prescribingDoctor: 'Dr. Evelyn Vance, MD',
      datePrescribed: new Date().toISOString().split('T')[0],
      status: 'Active',
      ndc: drugToPrescribe.productNdc || '0000-0000-00'
    };

    try {
      await db.prescriptions.add(newPrescription);

      await logAuditEvent({
        role: currentRole,
        user: 'Dr. Evelyn Vance, MD',
        patientId: patient.id,
        patientName: patient.name,
        action: 'PRESCRIBE_MEDICATION',
        details: `Prescribed ${newPrescription.brandName} (${newPrescription.dosageForm}, ${newPrescription.route}) — ${newPrescription.frequency}. NDC: ${newPrescription.ndc}`
      });

      await refreshData();
      addToast('Medication Prescribed', `Order signed for ${newPrescription.brandName} ${newPrescription.dosage}`, 'success');

      // Reset form
      setQuery('');
      setSelectedDrug(null);
      setDosage('');
      if (onPrescriptionAdded) onPrescriptionAdded(newPrescription);
    } catch (err) {
      console.error('Error saving prescription:', err);
      addToast('Prescription Error', 'Unable to write prescription to local database.', 'error');
    }
  };

  return (
    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Pill className="w-4 h-4 text-[#0F4C5C]" />
          <span>Real-Time OpenFDA Clinical Prescriber</span>
        </div>
        <span className="text-[10px] font-mono text-[#0F4C5C] bg-[#0F4C5C]/10 px-2 py-0.5 rounded flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#2A9D8F]" />
          api.fda.gov/drug/ndc
        </span>
      </div>

      {/* Drug Search Input with Auto-complete */}
      <div className="relative mb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedDrug && e.target.value !== selectedDrug.brandName) {
                setSelectedDrug(null);
              }
            }}
            onFocus={() => {
              if (results.length > 0) setDropdownOpen(true);
            }}
            placeholder="Type drug brand or generic name (e.g., Amoxicillin, Metformin, Lipitor)..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-slate-800"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 text-[#0F4C5C] animate-spin absolute right-2.5 top-2.5" />
          )}
        </div>

        {/* Dropdown Results */}
        {dropdownOpen && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
            {results.map((drug, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelectDrug(drug)}
                className="w-full text-left p-3 hover:bg-slate-50 transition cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{drug.brandName}</span>
                  <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                    NDC {drug.productNdc}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Generic: <strong className="text-slate-800">{drug.genericName}</strong>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                  <span><strong>Form:</strong> {drug.dosageForm}</span>
                  <span>•</span>
                  <span><strong>Route:</strong> {drug.route}</span>
                </div>
                {drug.activeIngredients && drug.activeIngredients.length > 0 && (
                  <div className="text-[10px] text-[#0F4C5C] font-medium">
                    Active: {drug.activeIngredients.map(i => `${i.name} ${i.strength || ''}`).join(', ')}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Drug Details Badge */}
      {selectedDrug && (
        <div className="p-3 bg-white border border-[#2A9D8F]/40 rounded-xl text-xs mb-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0F4C5C]">{selectedDrug.brandName}</span>
            <span className="text-[10px] font-semibold text-[#2A9D8F] bg-[#2A9D8F]/15 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> FDA Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Form: {selectedDrug.dosageForm} • Route: {selectedDrug.route}
          </p>
        </div>
      )}

      {/* Dosage & Frequency Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
            Exact Strength / Dose
          </label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 500 mg, 10 mL"
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C5C]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
            Clinical Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C5C]"
          >
            <option>Once daily in the morning</option>
            <option>Once daily at bedtime</option>
            <option>Twice daily with meals (BID)</option>
            <option>Three times daily (TID)</option>
            <option>Four times daily (QID)</option>
            <option>Every 4 to 6 hours as needed (PRN)</option>
            <option>Once weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
            Authorized Refills
          </label>
          <input
            type="number"
            min={0}
            max={12}
            value={refills}
            onChange={(e) => setRefills(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4C5C]"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handlePrescribe}
        className="w-full py-2 px-3 rounded-xl bg-[#0F4C5C] hover:bg-[#0c3c49] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Digitally Sign & Prescribe Medication</span>
      </button>
    </div>
  );
}
