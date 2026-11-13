import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { FunnelChart } from '../components/charts/FunnelChart';
import { ArrowUp, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';
import { useIncentiveStore } from '../store';

export const Scorecard: React.FC = () => {
  const calculateTotalBonus = useIncentiveStore(state => state.calculateTotalBonus);
  const projectedBonus = calculateTotalBonus();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-800">Executive Scorecard</h2>
        <p className="text-slate-500">Q3 Territory Performance & Incentives</p>
      </div>

      {/* KPI Section: Enclosure Principle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Earnings Bucket */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Incentives & Earnings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-pharma-emerald">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-slate-500">Projected Payout</p>
                   <div className="text-3xl font-bold text-pharma-emerald mt-1 animate-pulse">
                     ${projectedBonus.toLocaleString()}
                   </div>
                 </div>
                 <div className="p-2 bg-emerald-50 rounded-lg">
                   <DollarSign className="w-5 h-5 text-pharma-emerald" />
                 </div>
               </div>
               <div className="mt-4 text-xs text-emerald-600 font-medium">
                 ↑ 12% vs last month based on current pipeline
               </div>
            </Card>

            <Card>
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-slate-500">Quota Attainment</p>
                   <div className="text-3xl font-bold text-slate-800 mt-1">
                     82%
                   </div>
                 </div>
                 <div className="p-2 bg-slate-100 rounded-lg">
                   <CheckCircle2 className="w-5 h-5 text-slate-600" />
                 </div>
               </div>
               <div className="mt-4 text-xs text-slate-500">
                 18% gap to Platinum Tier
               </div>
               <div className="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                 <div className="bg-pharma-indigo h-full w-[82%]"></div>
               </div>
            </Card>
          </div>
        </div>

        {/* Right: Activity Bucket */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Activity & Quality</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card>
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-slate-500">WCS Score</p>
                   <div className="text-3xl font-bold text-slate-800 mt-1">
                     9.2
                   </div>
                 </div>
                 <div className="p-2 bg-indigo-50 rounded-lg">
                   <ArrowUp className="w-5 h-5 text-pharma-indigo" />
                 </div>
               </div>
               <div className="mt-4 text-xs text-pharma-indigo font-medium">
                 Weighted Call Score is top 10% of region
               </div>
            </Card>

            <Card className="border-l-4 border-l-pharma-amber">
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-sm text-slate-500">At-Risk Accounts</p>
                   <div className="text-3xl font-bold text-pharma-amber mt-1">
                     3
                   </div>
                 </div>
                 <div className="p-2 bg-amber-50 rounded-lg">
                   <AlertTriangle className="w-5 h-5 text-pharma-amber" />
                 </div>
               </div>
               <div className="mt-4 text-xs text-slate-500">
                 No activity &gt; 21 days for Tier 1 targets
               </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Patient Leakage Funnel" subtitle="Analysis of drop-off points from Rx to Persistency">
          <FunnelChart />
        </Card>

        {/* Action Items List */}
        <Card title="Immediate Actions" subtitle="AI Prioritized based on value">
          <div className="space-y-4 mt-2">
            {[
              { type: 'Call', text: 'Dr. Smith (Gold) - Due for clinical follow-up', urgent: true },
              { type: 'Auth', text: 'Resolve PA block for Pt. #4922 (Specialty)', urgent: true },
              { type: 'Event', text: 'Confirm attendance for Dinner Program', urgent: false },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-lg border flex items-center gap-3 ${item.urgent ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-100' : 'bg-white border-slate-100'}`}>
                <div className={`w-2 h-2 rounded-full ${item.urgent ? 'bg-pharma-rose' : 'bg-pharma-indigo'}`} />
                <span className="text-sm font-medium text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};