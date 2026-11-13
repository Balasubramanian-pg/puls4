export interface IncentiveState {
  targetCallIncrease: number;
  priorAuthSuccessRate: number;
  newHCPActivations: number;
  baseBonus: number;
  setTargetCallIncrease: (val: number) => void;
  setPriorAuthSuccessRate: (val: number) => void;
  setNewHCPActivations: (val: number) => void;
  calculateTotalBonus: () => number;
}

export interface HCP {
  id: string;
  name: string;
  specialty: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  lastCallDaysAgo: number;
  nrxTrend: number; // percentage
  conversionScore: number; // 0-100
  potential: 'High' | 'Medium' | 'Low';
  callFrequency: number; // 1-10 scale
  lastMessage: string;
}

export interface Activity {
  id: string;
  date: string; // ISO Date
  hcpName: string;
  hcpTier: 'Gold' | 'Silver' | 'Bronze';
  type: 'Detail' | 'Peer-to-Peer' | 'Sample' | 'Event';
  impact: 'High' | 'Medium' | 'Low'; // Correlates to WCS
  summary: string;
  trendData: { value: number }[]; // For sparkline
  accessRating: 'High' | 'Restricted';
  isGhost?: boolean; // For NBA suggestions
  isGrouped?: boolean; // For grouped visits
  groupedCount?: number;
  rxTriggered?: boolean; // For correlation toggle
}

export interface AuditDataPoint {
  id: string;
  wcs: number; // Effort (X)
  nrxGrowth: number; // Impact (Y)
  name: string;
  status: 'Star' | 'Over-Serviced' | 'Organic' | 'Neglected';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  image?: string; // base64
}