import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Download, Loader2, AlertTriangle, CheckCircle, FileText, Table as TableIcon } from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';

const scatterData = [
  { x: 90, y: 85, z: 100, name: 'Dr. Lin (Star)', status: 'Star' },
  { x: 85, y: 20, z: 200, name: 'Dr. Chen (Over-Serviced)', status: 'Over-Serviced' },
  { x: 20, y: 75, z: 150, name: 'Dr. Rossi (Organic)', status: 'Organic' },
  { x: 30, y: 15, z: 50, name: 'Dr. Wu (Neglected)', status: 'Neglected' },
  { x: 60, y: 60, z: 120, name: 'Dr. Smith', status: 'Star' },
  { x: 75, y: 30, z: 180, name: 'Dr. Foster', status: 'Over-Serviced' },
];

const radarData = [
  { subject: 'Coverage', A: 120, B: 110, fullMark: 150 },
  { subject: 'Frequency', A: 98, B: 130, fullMark: 150 },
  { subject: 'Recall', A: 86, B: 130, fullMark: 150 },
  { subject: 'Access', A: 99, B: 100, fullMark: 150 },
  { subject: 'Conversion', A: 85, B: 90, fullMark: 150 },
  { subject: 'Compliance', A: 65, B: 85, fullMark: 150 },
];

const leakageData = [
    { name: 'Dr. Chen', calls: 12, scripts: 4, unfilled: 45 },
    { name: 'Dr. Wu', calls: 3, scripts: 15, unfilled: 12 },
    { name: 'Dr. Foster', calls: 8, scripts: 2, unfilled: 60 },
];

export const AuditExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'PDF' | 'CSV' | null>(null);

  const handleExport = (type: 'PDF' | 'CSV') => {
    setExportType(type);
    setIsExporting(true);
    // Simulate generation delay
    setTimeout(() => {
        setIsExporting(false);
        setExportType(null);
        alert(`${type} Report Generated Successfully!`);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-12 print:p-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
           <h2 className="text-3xl font-display font-bold text-slate-800">Manager Review Pack</h2>
           <p className="text-slate-500">Audit-ready performance reconciliation</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => handleExport('CSV')}
             disabled={isExporting}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
           >
             {isExporting && exportType === 'CSV' ? <Loader2 className="w-4 h-4 animate-spin" /> : <TableIcon className="w-4 h-4" />}
             Export Data (CSV)
           </button>
           <button 
             onClick={() => handleExport('PDF')}
             disabled={isExporting}
             className="relative overflow-hidden flex items-center gap-2 px-6 py-2 bg-pharma-navy text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50"
           >
             {isExporting && exportType === 'PDF' && (
                 <div className="absolute inset-0 bg-white/20 animate-pulse" />
             )}
             {isExporting && exportType === 'PDF' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
             Generate Report (PDF)
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-8">
          
          {/* Visual 1: Effort vs Impact */}
          <Card title="Effort (WCS) vs. Impact (NRx)" subtitle="Scatter correlation to identify over-serviced accounts">
              <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="x" name="Effort (WCS)" unit=" pts" />
                          <YAxis type="number" dataKey="y" name="Impact (NRx)" unit=" Rx" />
                          <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          {/* Quadrant Lines */}
                          <ReferenceLine x={50} stroke="#cbd5e1" strokeDasharray="3 3" label="Avg Effort" />
                          <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" label="Avg Growth" />
                          
                          <Scatter name="HCPs" data={scatterData} fill="#8884d8">
                            {scatterData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={
                                  entry.status === 'Star' ? '#10B981' : 
                                  entry.status === 'Over-Serviced' ? '#F59E0B' : 
                                  entry.status === 'Organic' ? '#4F46E5' : '#94a3b8'
                              } />
                            ))}
                          </Scatter>
                      </ScatterChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center mt-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pharma-emerald"></div> Star</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pharma-amber"></div> Over-Serviced</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pharma-indigo"></div> Organic</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Low Priority</span>
              </div>
          </Card>

          {/* Visual 2: Call Quality Radar */}
          <Card title="Rep Proficiency vs. Regional Avg" subtitle="Audit of field capability metrics">
              <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} />
                          <Radar name="Regional Avg" dataKey="B" stroke="#94a3b8" strokeDasharray="4 4" fill="#94a3b8" fillOpacity={0.1} />
                          <Radar name="Rep Score" dataKey="A" stroke="#4F46E5" strokeWidth={3} fill="#4F46E5" fillOpacity={0.5} />
                      </RadarChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          {/* Visual 3: Compliance Gauge */}
          <Card title="Compliance & Logging Latency" className="flex flex-col items-center justify-center">
             <div className="relative w-64 h-32 overflow-hidden mt-6">
                 <div className="absolute top-0 left-0 w-full h-full bg-slate-100 rounded-t-full"></div>
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-t-full" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)', transform: 'rotate(-45deg)', transformOrigin: 'bottom center' }}></div>
                 {/* Needle */}
                 <div className="absolute bottom-0 left-1/2 w-1 h-28 bg-slate-800 origin-bottom transform -translate-x-1/2 rotate-12 transition-transform duration-1000"></div>
                 <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-800 rounded-full -translate-x-1/2 translate-y-1/2"></div>
             </div>
             <div className="text-center mt-6">
                 <h3 className="text-4xl font-display font-bold text-slate-800">48<span className="text-lg text-slate-400 ml-1">hrs</span></h3>
                 <p className="text-sm text-pharma-amber font-medium flex items-center gap-1 justify-center mt-1">
                     <AlertTriangle className="w-4 h-4" /> Delay Risk Detected
                 </p>
                 <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">Calls logged {'>'} 24hrs after event trigger a 0.9x multiplier on quality score.</p>
             </div>
          </Card>

          {/* Visual 4: Leakage Table */}
          <Card title="Leakage Analysis" subtitle="HCPs with high detail-volume but low fill rates">
              <table className="w-full mt-4">
                  <thead>
                      <tr className="text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                          <th className="pb-3">HCP Name</th>
                          <th className="pb-3">Calls YTD</th>
                          <th className="pb-3 text-right">% Unfilled</th>
                      </tr>
                  </thead>
                  <tbody className="text-sm">
                      {leakageData.map((row, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-0">
                              <td className="py-3 font-medium text-slate-700">{row.name}</td>
                              <td className="py-3 text-slate-500">{row.calls}</td>
                              <td className="py-3">
                                  <div className="flex items-center gap-2 justify-end">
                                      <span className={`font-bold ${row.unfilled > 30 ? 'text-pharma-rose' : 'text-slate-600'}`}>{row.unfilled}%</span>
                                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${row.unfilled > 30 ? 'bg-pharma-rose' : 'bg-pharma-emerald'}`} 
                                            style={{ width: `${row.unfilled}%` }}
                                          ></div>
                                      </div>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </Card>

      </div>
    </motion.div>
  );
};