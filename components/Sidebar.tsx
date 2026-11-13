import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calculator, Activity, FileBarChart, PlusCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIncentiveStore } from '../store';

const navItems = [
  { icon: LayoutDashboard, label: 'Scorecard', path: '/' },
  { icon: Users, label: 'HCP Insights', path: '/insights' },
  { icon: Calculator, label: 'Incentives', path: '/calculator' },
  { icon: Activity, label: 'Activity Log', path: '/activity' },
  { icon: RefreshCw, label: 'Data Sync & Dispute', path: '/disputes' },
  { icon: FileBarChart, label: 'Manager Audit', path: '/audit' },
];

export const Sidebar: React.FC = () => {
  // Subscribe to store updates to render real-time bonus
  const { 
    calculateTotalBonus 
  } = useIncentiveStore();

  const currentBonus = calculateTotalBonus();

  return (
    <aside className="w-64 fixed h-full bg-pharma-navy text-white z-20 shadow-xl flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-pharma-indigo rounded-lg flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          PharmaPulse
        </h1>
        <p className="text-slate-400 text-xs mt-2 font-mono">CLINICAL DASHBOARD v2.1</p>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                isActive 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pharma-indigo rounded-r-full"
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-pharma-indigo' : 'group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mini-Preview of Estimated Bonus */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-xl p-4 border border-indigo-500/20 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3 h-3" />
            <span>Bonus Preview</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-emerald-400 font-bold">$</span>
            <span className="text-2xl font-display font-bold text-white tracking-tight">
              {currentBonus.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Live estimate based on simulator
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pharma-indigo to-purple-500 flex items-center justify-center font-bold text-sm">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-slate-400">Territory Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};