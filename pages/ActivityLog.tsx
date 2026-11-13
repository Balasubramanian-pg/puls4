import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Activity } from '../types';
import { Filter, Calendar, Zap, AlertCircle, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const mockActivities: Activity[] = [
  // Today's grouped activity
  {
    id: '101', date: '2023-10-24', hcpName: 'Mercy Medical Oncology Group', hcpTier: 'Gold', type: 'Detail', impact: 'High',
    summary: 'Grouped Visit: Dr. Lin, Dr. Rossi, and NP Smith. Delivered new efficacy data vs standard of care.',
    trendData: [{ value: 40 }, { value: 45 }, { value: 60 }, { value: 65 }],
    accessRating: 'High', isGrouped: true, groupedCount: 3
  },
  // Individual High Impact
  {
    id: '1', date: '2023-10-23', hcpName: 'Dr. James Wilson', hcpTier: 'Silver', type: 'Detail', impact: 'High',
    summary: 'Deep dive into safety profile. Addressed concerns regarding elderly patients.',
    trendData: [{ value: 30 }, { value: 25 }, { value: 35 }, { value: 42 }],
    accessRating: 'High', rxTriggered: true
  },
  // NBA Ghost Card (Future)
  {
    id: 'ghost-1', date: 'Suggested', hcpName: 'Dr. Alan Grant', hcpTier: 'Gold', type: 'Detail', impact: 'High',
    summary: 'NBA Alert: No contact > 12 days. Follow up on PA denial discussed on Oct 10.',
    trendData: [], accessRating: 'Restricted', isGhost: true
  },
  // Standard Sample Drop
  {
    id: '2', date: '2023-10-21', hcpName: 'Dr. Emily Foster', hcpTier: 'Silver', type: 'Sample', impact: 'Low',
    summary: 'Dropped off new starter kits. Gatekeeper indicated she is in-service only this week.',
    trendData: [{ value: 10 }, { value: 12 }, { value: 10 }, { value: 11 }],
    accessRating: 'Restricted'
  },
  // Peer to Peer
  {
    id: '3', date: '2023-10-18', hcpName: 'Dr. Mark Chen', hcpTier: 'Bronze', type: 'Peer-to-Peer', impact: 'Medium',
    summary: 'Attended regional dinner program. Engaged with KOL speaker.',
    trendData: [{ value: 5 }, { value: 5 }, { value: 8 }, { value: 6 }],
    accessRating: 'High'
  },
];

const HeatmapCell: React.FC<{ intensity: number }> = ({ intensity }) => {
  const bg = intensity === 0 ? 'bg-slate-100' : 
             intensity < 3 ? 'bg-emerald-100' :
             intensity < 6 ? 'bg-emerald-400' : 'bg-emerald-700';
  return <div className={`w-3 h-3 rounded-sm ${bg}`} title={`${intensity} activities`} />;
};

export const ActivityLog: React.FC = () => {
  const [showRxCorrelation, setShowRxCorrelation] = useState(false);
  const [filterType, setFilterType] = useState<'All' | 'High Impact'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredActivities = filterType === 'All' 
    ? mockActivities 
    : mockActivities.filter(a => a.impact === 'High' || a.isGhost);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20">
      
      {/* Header & Sticky Filter */}
      <div className="sticky top-0 z-10 bg-pharma-surface/90 backdrop-blur-md pb-6 pt-2">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-800">Strategic Timeline</h2>
            <p className="text-slate-500">Account momentum & field intelligence</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setShowRxCorrelation(!showRxCorrelation)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showRxCorrelation ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               <Zap className={`w-4 h-4 ${showRxCorrelation ? 'fill-emerald-700' : ''}`} />
               Rx Correlation
             </button>
          </div>
        </div>

        {/* Activity Intensity Heatmap */}
        <Card className="mb-6 p-4">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">30-Day Intensity</span>
             <span className="text-xs text-slate-400">Higher Opacity = High WCS</span>
           </div>
           <div className="flex gap-1 justify-between">
             {Array.from({ length: 30 }).map((_, i) => (
               <HeatmapCell key={i} intensity={Math.floor(Math.random() * 8)} />
             ))}
           </div>
        </Card>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2">
           {['All', 'High Impact', 'Peer-to-Peer', 'Access Issues'].map(f => (
             <button 
               key={f}
               onClick={() => setFilterType(f as any)}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === f ? 'bg-pharma-navy text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="space-y-0 relative pl-4">
        {/* Continuous Line */}
        <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>

        <AnimatePresence>
          {loading ? (
             // Shimmer Skeleton
             [1, 2, 3].map(i => (
               <div key={i} className="flex gap-6 pb-8 relative animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-slate-200 z-10 flex-none" />
                  <div className="flex-1 h-32 bg-slate-200 rounded-xl" />
               </div>
             ))
          ) : (
            filteredActivities.map((activity, idx) => (
              <motion.div 
                key={activity.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="group relative flex gap-6 pb-8"
              >
                {/* Timeline Node */}
                <div className="relative z-10 flex-none mt-1">
                  {activity.isGhost ? (
                     <div className="w-6 h-6 rounded-full border-2 border-dashed border-pharma-indigo bg-white flex items-center justify-center">
                       <Clock className="w-3 h-3 text-pharma-indigo" />
                     </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full ring-4 ring-white flex items-center justify-center shadow-sm ${activity.impact === 'High' ? 'bg-pharma-indigo' : 'bg-slate-300'}`}>
                      {activity.rxTriggered && showRxCorrelation && (
                        <div className="absolute -right-2 -top-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border border-white" title="Rx Triggered">
                           <Zap className="w-2 h-2 text-white fill-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 relative ${activity.isGhost ? 'opacity-70' : ''}`}>
                   {/* Date Label */}
                   <span className="absolute -left-28 top-1.5 text-xs font-mono text-slate-400 w-20 text-right">
                     {activity.date === 'Suggested' ? 'SUGGESTED' : activity.date}
                   </span>

                   <div className={`
                      rounded-xl bg-white p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 relative overflow-hidden
                      ${activity.isGhost ? 'border-2 border-dashed border-slate-300' : 'border border-slate-200 shadow-sm'}
                      ${activity.impact === 'High' ? 'border-l-[6px] border-l-pharma-indigo' : 'border-l-[2px] border-l-slate-300'}
                   `}>
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-pharma-navy text-lg">{activity.hcpName}</h3>
                              {/* Access Badge */}
                              <div className={`w-2.5 h-2.5 rounded-full border border-white shadow-sm ${activity.accessRating === 'High' ? 'bg-emerald-500' : 'bg-pharma-rose'}`} title={`Access: ${activity.accessRating}`} />
                              {activity.isGrouped && (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Users size={10} /> +{activity.groupedCount} Others
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${activity.hcpTier === 'Gold' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                {activity.hcpTier}
                              </span>
                              <span className="text-xs text-slate-400">• {activity.type}</span>
                            </div>
                         </div>
                         
                         {/* Visual 4: Prescriber Journey Sparkline */}
                         {!activity.isGhost && (
                           <div className="w-24 h-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activity.trendData}>
                                  <Line type="monotone" dataKey="value" stroke={activity.impact === 'High' ? '#4F46E5' : '#94a3b8'} strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                           </div>
                         )}
                         {activity.isGhost && (
                           <button className="bg-pharma-indigo text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                             Schedule
                           </button>
                         )}
                      </div>

                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                        {activity.summary}
                      </p>

                      {activity.isGhost && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-pharma-indigo font-medium bg-indigo-50 p-2 rounded">
                          <AlertCircle className="w-3 h-3" />
                          AI Reason: High probability of script decay if not seen by Friday.
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        <div className="flex justify-center pt-8">
           <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
             End of Record
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// Simple Icon component for Grouped
const Users = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);