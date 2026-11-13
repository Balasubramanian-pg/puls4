import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { HCP } from '../types';
import { Search, Filter, Phone, TrendingUp, TrendingDown, X, ChevronUp, ChevronDown, Info } from 'lucide-react';

const mockHCPs: HCP[] = [
  { id: '1', name: 'Dr. Sarah Lin', specialty: 'Oncology', tier: 'Gold', lastCallDaysAgo: 2, nrxTrend: 15, conversionScore: 92, potential: 'High', callFrequency: 9, lastMessage: 'Efficacy Data: Phase 3 Trial vs Standard of Care' },
  { id: '2', name: 'Dr. James Wilson', specialty: 'Hematology', tier: 'Silver', lastCallDaysAgo: 18, nrxTrend: -5, conversionScore: 64, potential: 'Medium', callFrequency: 4, lastMessage: 'Patient Assistance Program Updates' },
  { id: '3', name: 'Dr. Elena Rossi', specialty: 'Oncology', tier: 'Gold', lastCallDaysAgo: 5, nrxTrend: 8, conversionScore: 88, potential: 'High', callFrequency: 8, lastMessage: 'New Dosing Guidelines for Elderly Patients' },
  { id: '4', name: 'Dr. Mark Chen', specialty: 'Internal Med', tier: 'Bronze', lastCallDaysAgo: 30, nrxTrend: -12, conversionScore: 45, potential: 'Low', callFrequency: 1, lastMessage: 'Introductory Meeting Request (Unopened)' },
  { id: '5', name: 'Dr. Emily Foster', specialty: 'Hematology', tier: 'Silver', lastCallDaysAgo: 1, nrxTrend: 22, conversionScore: 78, potential: 'High', callFrequency: 7, lastMessage: 'Peer-to-Peer Dinner Invitation' },
  { id: '6', name: 'Dr. Alan Grant', specialty: 'Oncology', tier: 'Silver', lastCallDaysAgo: 12, nrxTrend: 3, conversionScore: 71, potential: 'Medium', callFrequency: 5, lastMessage: 'Reimbursement Pathway Clarification' },
  { id: '7', name: 'Dr. Lisa Wu', specialty: 'Internal Med', tier: 'Bronze', lastCallDaysAgo: 45, nrxTrend: -2, conversionScore: 30, potential: 'Low', callFrequency: 2, lastMessage: 'Q2 Newsletter' },
];

type SortKey = 'lastCallDaysAgo' | 'nrxTrend' | 'conversionScore';

export const HCPInsights: React.FC = () => {
  const [selectedHCP, setSelectedHCP] = useState<HCP | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  // Simulate data fetching for skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedHCPs = useMemo(() => {
    let sortableItems = [...mockHCPs];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig?.key !== key) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30"><ChevronUp className="w-4 h-4" /></div>;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-pharma-indigo" /> : <ChevronDown className="w-4 h-4 text-pharma-indigo" />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Territory Insights</h2>
          <p className="text-slate-500">Manage relationships and prescribing behaviors</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search HCP..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-pharma-indigo/20 outline-none w-64" 
            />
          </div>
        </div>
      </div>

      {/* Call Quality Heatmap */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Call Quality Heatmap</h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-pharma-indigo"></div> High Freq</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Low Freq</div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full border border-slate-300"></div> Size = Potential</div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-12 h-12 bg-slate-200 rounded-full opacity-50"></div>)}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 items-center">
            {mockHCPs.map((hcp) => {
              // Size logic
              const sizeClass = hcp.potential === 'High' ? 'w-10 h-10' : hcp.potential === 'Medium' ? 'w-8 h-8' : 'w-5 h-5';
              // Color logic (Frequency)
              const bgClass = hcp.callFrequency >= 7 ? 'bg-pharma-indigo' : hcp.callFrequency >= 4 ? 'bg-indigo-400' : 'bg-slate-400';
              // Opacity logic for better blending
              const opacity = hcp.callFrequency / 10;
              
              return (
                <div key={hcp.id} className="relative group cursor-pointer" onClick={() => setSelectedHCP(hcp)}>
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className={`rounded-full shadow-sm ${bgClass} ${sizeClass} flex items-center justify-center`}
                    style={{ opacity: 0.3 + (opacity * 0.7) }}
                  >
                    <span className="sr-only">{hcp.name}</span>
                  </motion.div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-pharma-navy text-white text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <p className="font-bold mb-1">{hcp.name}</p>
                    <p className="text-slate-300">Last Msg: {hcp.lastMessage}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-pharma-navy"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase w-1/4">HCP Name</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tier</th>
              <th 
                className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 group transition-colors select-none"
                onClick={() => handleSort('lastCallDaysAgo')}
              >
                <div className="flex items-center gap-1">Last Call {renderSortIcon('lastCallDaysAgo')}</div>
              </th>
              <th 
                className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 group transition-colors select-none"
                onClick={() => handleSort('nrxTrend')}
              >
                 <div className="flex items-center gap-1">NRx Trend {renderSortIcon('nrxTrend')}</div>
              </th>
              <th 
                className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 group transition-colors select-none text-right"
                onClick={() => handleSort('conversionScore')}
              >
                 <div className="flex items-center justify-end gap-1">Score {renderSortIcon('conversionScore')}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton Loader Rows
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div><div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div></td>
                  <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div></td>
                  <td className="p-4"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div></td>
                  <td className="p-4"><div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div></td>
                  <td className="p-4 text-right"><div className="h-6 w-8 bg-slate-200 rounded animate-pulse ml-auto"></div></td>
                </tr>
              ))
            ) : (
              sortedHCPs.map((hcp) => (
                <tr 
                  key={hcp.id} 
                  onClick={() => setSelectedHCP(hcp)}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-pharma-navy group-hover:text-pharma-indigo transition-colors">{hcp.name}</div>
                      
                      {/* Visual Potential Badge */}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        hcp.potential === 'High' ? 'bg-green-50 text-green-700 border-green-200' :
                        hcp.potential === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {hcp.potential}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{hcp.specialty}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      hcp.tier === 'Gold' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      hcp.tier === 'Silver' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                      'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                      {hcp.tier}
                    </span>
                  </td>
                  <td className={`p-4 text-sm font-medium ${hcp.lastCallDaysAgo > 14 ? 'bg-amber-50 text-amber-600' : 'text-slate-600'}`}>
                    {hcp.lastCallDaysAgo} days ago
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {hcp.nrxTrend > 0 ? <TrendingUp className="w-4 h-4 text-pharma-emerald" /> : <TrendingDown className="w-4 h-4 text-pharma-rose" />}
                      <span className={`text-sm font-bold ${hcp.nrxTrend > 0 ? 'text-pharma-emerald' : 'text-pharma-rose'}`}>
                        {hcp.nrxTrend}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-lg font-bold text-slate-700">{hcp.conversionScore}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {selectedHCP && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHCP(null)}
              className="fixed inset-0 bg-slate-900 z-40 ml-64"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-display font-bold text-pharma-navy">{selectedHCP.name}</h3>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        selectedHCP.potential === 'High' ? 'bg-green-50 text-green-700 border-green-200' :
                        selectedHCP.potential === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                      {selectedHCP.potential} Potential
                    </span>
                  </div>
                  <p className="text-pharma-indigo font-medium">{selectedHCP.specialty}</p>
                </div>
                <button onClick={() => setSelectedHCP(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Next Best Action</h4>
                   <p className="text-sm text-slate-700 font-medium leading-relaxed">
                     Discuss recent clinical trial results for Product X regarding efficacy in elderly patients. Last interaction indicated hesitation.
                   </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                   <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Last Interaction</h4>
                   <div className="flex items-start gap-2">
                     <Info className="w-4 h-4 text-indigo-500 mt-0.5" />
                     <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                       {selectedHCP.lastMessage}
                     </p>
                   </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Prescriptions</h4>
                   <div className="space-y-2">
                     {[1, 2, 3].map((i) => (
                       <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pharma-emerald/10 text-pharma-emerald rounded-full flex items-center justify-center font-bold text-xs">Rx</div>
                            <div>
                              <p className="text-sm font-semibold">Patient #{4000 + i}</p>
                              <p className="text-xs text-slate-500">Initiated: Oct {10 + i}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Fulfilled</span>
                       </div>
                     ))}
                   </div>
                </div>

                <button className="w-full py-3 bg-pharma-indigo text-white rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Log Call Interaction
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};