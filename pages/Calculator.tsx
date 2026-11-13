import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useIncentiveStore } from '../store';
import { Card } from '../components/ui/Card';
import confetti from 'canvas-confetti';
import { RefreshCcw, TrendingUp } from 'lucide-react';

export const Calculator: React.FC = () => {
  const { 
    targetCallIncrease, setTargetCallIncrease,
    priorAuthSuccessRate, setPriorAuthSuccessRate,
    newHCPActivations, setNewHCPActivations,
    calculateTotalBonus, baseBonus
  } = useIncentiveStore();

  const totalBonus = calculateTotalBonus();
  const controls = useAnimation();
  const prevBonusRef = useRef(totalBonus);

  useEffect(() => {
    // Trigger confetti if bonus exceeds 25k (Platinum Target)
    if (totalBonus > 25000 && prevBonusRef.current <= 25000) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B']
      });
    }
    prevBonusRef.current = totalBonus;
  }, [totalBonus]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
       <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">Incentive Simulator</h2>
        <p className="text-slate-500">Adjust variables to forecast Q4 payouts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Pane */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-8">
              
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-pharma-navy">Target Call Volume Increase</label>
                  <span className="text-sm font-mono text-pharma-indigo font-bold">{targetCallIncrease > 0 ? '+' : ''}{targetCallIncrease} calls</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="1"
                  value={targetCallIncrease}
                  onChange={(e) => setTargetCallIncrease(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pharma-indigo"
                />
                <p className="text-xs text-slate-400 mt-1">Impact: +$250 per extra call over baseline</p>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-pharma-navy">PA Success Rate</label>
                  <span className={`text-sm font-mono font-bold ${priorAuthSuccessRate > 80 ? 'text-pharma-emerald' : 'text-pharma-amber'}`}>
                    {priorAuthSuccessRate}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  step="1"
                  value={priorAuthSuccessRate}
                  onChange={(e) => setPriorAuthSuccessRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pharma-indigo"
                />
                 <p className="text-xs text-slate-400 mt-1">Impact: +$500 per % over 60% threshold</p>
              </div>

               {/* Slider 3 */}
               <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-pharma-navy">New HCP Activations</label>
                  <span className="text-sm font-mono text-pharma-indigo font-bold">{newHCPActivations} Docs</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={newHCPActivations}
                  onChange={(e) => setNewHCPActivations(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pharma-indigo"
                />
                 <p className="text-xs text-slate-400 mt-1">Impact: +$1,200 per new writer</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-1">
          <Card className="bg-pharma-navy text-white h-full relative overflow-hidden border-none">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pharma-indigo opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
             
             <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                 <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest">Total Estimated Bonus</h3>
                 <div className="flex items-baseline gap-1 mt-4">
                   <span className="text-4xl font-display font-bold text-pharma-emerald">$</span>
                   <motion.span 
                    key={totalBonus}
                    initial={{ opacity: 0.5, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-6xl font-display font-bold ${totalBonus > 25000 ? 'text-pharma-emerald animate-pulse-slow' : 'text-white'}`}
                   >
                     {totalBonus.toLocaleString()}
                   </motion.span>
                 </div>
                 <div className="mt-2 text-sm text-slate-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-pharma-emerald" />
                    <span>{((totalBonus - baseBonus) / baseBonus * 100).toFixed(1)}% above base</span>
                 </div>
               </div>

               <div className="mt-8 space-y-3">
                 <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                   <span className="text-slate-400">Base Bonus</span>
                   <span>${baseBonus.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                   <span className="text-slate-400">Performance Adder</span>
                   <span className="text-pharma-emerald font-bold">+${(totalBonus - baseBonus).toLocaleString()}</span>
                 </div>
               </div>

               <button 
                onClick={() => {
                  setTargetCallIncrease(0);
                  setPriorAuthSuccessRate(65);
                  setNewHCPActivations(2);
                }}
                className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
               >
                 <RefreshCcw className="w-4 h-4" /> Reset Scenarios
               </button>
             </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};