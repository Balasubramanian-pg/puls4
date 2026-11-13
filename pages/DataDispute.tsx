import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Search, UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, MapPin, Calendar, DollarSign, X } from 'lucide-react';

interface HCP {
  id: string;
  name: string;
  specialty: string;
  systemRx: number;
}

const mockHCPs: HCP[] = [
  { id: '1', name: 'Dr. Sarah Lin', specialty: 'Oncology', systemRx: 12 },
  { id: '2', name: 'Dr. James Wilson', specialty: 'Hematology', systemRx: 8 },
  { id: '3', name: 'Dr. Elena Rossi', specialty: 'Oncology', systemRx: 15 },
  { id: '4', name: 'Dr. Mark Chen', specialty: 'Internal Med', systemRx: 3 },
];

export const DataDispute: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedHCP, setSelectedHCP] = useState<HCP | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [claimedRx, setClaimedRx] = useState<number>(0);
  const [fileAttached, setFileAttached] = useState<File | null>(null);
  const [isPHICompliant, setIsPHICompliant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredHCPs = mockHCPs.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const potentialPayout = selectedHCP && claimedRx > selectedHCP.systemRx 
    ? (claimedRx - selectedHCP.systemRx) * 150 // $150 per NRx
    : 0;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto pt-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center border border-pharma-emerald/20"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-pharma-emerald" />
          </div>
          <h2 className="text-3xl font-display font-bold text-pharma-navy mb-2">Dispute Submitted</h2>
          <p className="text-slate-500 mb-8">Tracking ID: <span className="font-mono font-bold text-slate-800">REQ-2023-8921</span></p>
          
          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left max-w-sm mx-auto border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-sm text-slate-500">Est. Resolution</span>
              <span className="font-semibold text-pharma-navy">5 Business Days</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-sm text-slate-500">Potential Adjustment</span>
               <span className="font-bold text-pharma-emerald">+${potentialPayout.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-pharma-navy text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Data Sync & Dispute Portal</h2>
          <p className="text-slate-500">Reconcile missing NRx and field activity</p>
        </div>
      </div>

      {/* Lifecycle Tracker */}
      <div className="mb-8">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Dispute Status</h3>
         <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <FileText className="w-6 h-6 text-pharma-amber" />
              </div>
              <div>
                <p className="font-semibold text-pharma-navy">Case #8842 - Dr. Rossi</p>
                <p className="text-xs text-slate-500">Submitted 2 days ago • Missing Oct Activity</p>
              </div>
            </div>
            {/* Stepper */}
            <div className="flex items-center gap-2">
               <div className="flex flex-col items-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-pharma-emerald"></div>
                 <span className="text-[10px] text-slate-500 font-medium">Submitted</span>
               </div>
               <div className="w-12 h-0.5 bg-pharma-emerald"></div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-pharma-amber animate-pulse"></div>
                 <span className="text-[10px] text-pharma-navy font-bold">In Review</span>
               </div>
               <div className="w-12 h-0.5 bg-slate-200"></div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                 <span className="text-[10px] text-slate-400">Validation</span>
               </div>
               <div className="w-12 h-0.5 bg-slate-200"></div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                 <span className="text-[10px] text-slate-400">Adjusted</span>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Steps */}
        <div className="bg-slate-50 border-r border-slate-100 p-6 md:w-64 flex-none">
          <div className="space-y-8">
            {[
              { num: 1, label: 'Identify HCP', icon: Search },
              { num: 2, label: 'Discrepancy', icon: AlertCircle },
              { num: 3, label: 'Upload Proof', icon: UploadCloud },
              { num: 4, label: 'Review', icon: ShieldCheck },
            ].map((s) => (
              <div key={s.num} className={`flex items-center gap-3 ${step === s.num ? 'text-pharma-indigo' : step > s.num ? 'text-pharma-emerald' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                  step === s.num ? 'border-pharma-indigo bg-indigo-50' : 
                  step > s.num ? 'border-pharma-emerald bg-emerald-50' : 
                  'border-slate-300 bg-white'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`font-medium text-sm ${step === s.num ? 'text-pharma-navy' : ''}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Payout Forecast Mini Card */}
          <AnimatePresence>
            {potentialPayout > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 bg-pharma-navy p-4 rounded-xl text-white relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-16 h-16 bg-pharma-emerald opacity-20 blur-xl rounded-full translate-x-4 -translate-y-4"></div>
                 <p className="text-xs text-slate-400 mb-1">Potential Increase</p>
                 <div className="text-2xl font-bold text-pharma-emerald flex items-center gap-1 shadow-glow">
                   <DollarSign className="w-5 h-5" />
                   {potentialPayout.toLocaleString()}
                 </div>
                 <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                   Based on ${150}/Rx incentive rate. Subject to validation.
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 p-8 relative">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: HCP Picker */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-pharma-navy mb-2">Select Healthcare Professional</h3>
                <p className="text-slate-500 text-sm mb-6">Search for the provider in your territory associated with the missing data.</p>
                
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, NPI, or Specialty..." 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-pharma-indigo outline-none transition-all"
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredHCPs.map(hcp => (
                    <div 
                      key={hcp.id}
                      onClick={() => setSelectedHCP(hcp)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-slate-50 flex justify-between items-center ${selectedHCP?.id === hcp.id ? 'border-pharma-indigo bg-indigo-50/50 ring-1 ring-pharma-indigo' : 'border-slate-200'}`}
                    >
                      <div>
                        <p className="font-bold text-slate-800">{hcp.name}</p>
                        <p className="text-xs text-slate-500">{hcp.specialty} • Current System Rx: {hcp.systemRx}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center">
                         {selectedHCP?.id === hcp.id && <div className="w-3 h-3 bg-pharma-indigo rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                   <button 
                     onClick={() => setStep(2)} 
                     disabled={!selectedHCP}
                     className="px-6 py-3 bg-pharma-indigo text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     Next Step <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Discrepancy */}
            {step === 2 && selectedHCP && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-pharma-navy mb-2">Identify Data Gap</h3>
                <p className="text-slate-500 text-sm mb-6">Comparison for <span className="font-semibold text-slate-800">{selectedHCP.name}</span></p>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                  <div className="grid grid-cols-2 gap-8 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
                    
                    <div className="text-center">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current System Data</p>
                       <p className="text-3xl font-display font-bold text-slate-600">{selectedHCP.systemRx} <span className="text-sm font-sans text-slate-400 font-normal">NRx</span></p>
                       <p className="text-xs text-slate-400 mt-1">Last Updated: Today</p>
                    </div>

                    <div className="text-center">
                       <p className="text-xs font-bold text-pharma-indigo uppercase tracking-wider mb-2">Your Claim</p>
                       <div className="flex items-center justify-center gap-2">
                         <input 
                           type="number" 
                           min={selectedHCP.systemRx}
                           value={claimedRx || ''}
                           onChange={(e) => setClaimedRx(Number(e.target.value))}
                           placeholder="0"
                           className="w-20 text-center text-3xl font-display font-bold text-pharma-navy border-b-2 border-pharma-indigo bg-transparent focus:outline-none"
                         />
                         <span className="text-sm text-slate-500 font-normal mt-2">NRx</span>
                       </div>
                       <p className="text-xs text-pharma-indigo mt-1 font-medium">Enter actual volume</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                   <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-medium">Back</button>
                   <button 
                     onClick={() => setStep(3)} 
                     disabled={claimedRx <= selectedHCP.systemRx}
                     className="px-6 py-3 bg-pharma-indigo text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     Upload Proof <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Evidence Upload */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h3 className="text-xl font-bold text-pharma-navy mb-2">Provide Evidence</h3>
                 <p className="text-slate-500 text-sm mb-6">Upload redacted portal screenshots or pharmacy receipts.</p>

                 <div className={`
                    border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group mb-6
                    ${fileAttached ? 'border-pharma-emerald bg-emerald-50/50' : 'border-slate-300 hover:border-pharma-indigo hover:bg-slate-50'}
                 `}>
                    {!fileAttached ? (
                      <>
                        <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-pharma-indigo mb-4 transition-colors" />
                        <p className="text-sm text-slate-600 font-medium">Click to upload or drag proof here</p>
                        <span className="text-xs text-slate-400 mt-2">PDF, PNG, JPG (Max 10MB)</span>
                        <input type="file" className="hidden" onChange={(e) => setFileAttached(e.target.files?.[0] || null)} />
                      </>
                    ) : (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                         <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                           <FileText className="w-6 h-6 text-pharma-emerald" />
                         </div>
                         <p className="text-sm font-bold text-slate-800">{fileAttached.name}</p>
                         <button onClick={() => setFileAttached(null)} className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
                      </div>
                    )}
                 </div>

                 {/* Redaction Check */}
                 <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        id="phi-check" 
                        checked={isPHICompliant}
                        onChange={(e) => setIsPHICompliant(e.target.checked)}
                        className="w-4 h-4 text-pharma-indigo rounded border-gray-300 focus:ring-pharma-indigo" 
                      />
                    </div>
                    <label htmlFor="phi-check" className="text-sm text-amber-900 cursor-pointer select-none">
                       <span className="font-bold">Legal Requirement:</span> I certify that all Patient Protected Health Information (PHI) such as names, DOBs, and MRNs have been redacted from this upload.
                    </label>
                 </div>

                 <div className="mt-8 flex justify-between">
                   <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-medium">Back</button>
                   <button 
                     onClick={() => setStep(4)} 
                     disabled={!fileAttached || !isPHICompliant}
                     className="px-6 py-3 bg-pharma-indigo text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     Review & Submit <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Review */}
            {step === 4 && selectedHCP && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h3 className="text-xl font-bold text-pharma-navy mb-2">Final Review</h3>
                 <p className="text-slate-500 text-sm mb-6">Confirm details before submission.</p>

                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm text-slate-500">HCP</span>
                      <span className="text-sm font-bold text-slate-800">{selectedHCP.name}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm text-slate-500">Claimed Volume</span>
                      <span className="text-sm font-bold text-pharma-indigo">{claimedRx} NRx <span className="text-xs text-slate-400 font-normal">(vs {selectedHCP.systemRx})</span></span>
                    </div>
                    <div className="flex justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm text-slate-500">Evidence</span>
                      <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> {fileAttached?.name}
                      </span>
                    </div>
                    
                    {/* Metadata Attachment */}
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                       <MapPin className="w-4 h-4" />
                       <span>Attaching Metadata: <span className="font-mono text-slate-600">Lat 40.7128, Long -74.0060</span> (Clinic Location Verification)</span>
                    </div>
                 </div>

                 <div className="mt-8 flex justify-between">
                   <button onClick={() => setStep(3)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-medium">Back</button>
                   <button 
                     onClick={handleSubmit} 
                     disabled={isSubmitting}
                     className="px-8 py-3 bg-pharma-navy text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                   >
                     {isSubmitting ? 'Submitting...' : 'Confirm Dispute'}
                   </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};