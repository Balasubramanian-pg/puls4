import { create } from 'zustand';
import { IncentiveState } from './types';

export const useIncentiveStore = create<IncentiveState>((set, get) => ({
  targetCallIncrease: 0,
  priorAuthSuccessRate: 65,
  newHCPActivations: 2,
  baseBonus: 15000,

  setTargetCallIncrease: (val) => set({ targetCallIncrease: val }),
  setPriorAuthSuccessRate: (val) => set({ priorAuthSuccessRate: val }),
  setNewHCPActivations: (val) => set({ newHCPActivations: val }),

  calculateTotalBonus: () => {
    const state = get();
    // Simplified logic for demo purposes
    const callBonus = state.targetCallIncrease * 250;
    const paBonus = (state.priorAuthSuccessRate - 60) * 500; // Bonus for every % above 60
    const activationBonus = state.newHCPActivations * 1200;
    
    let total = state.baseBonus + callBonus + (paBonus > 0 ? paBonus : 0) + activationBonus;
    return Math.max(state.baseBonus, total); // Ensure base bonus is minimum
  },
}));