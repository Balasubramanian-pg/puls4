import React from 'react';
import { ResponsiveContainer, FunnelChart as RechartsFunnel, Funnel, Tooltip, LabelList } from 'recharts';

const data = [
  { value: 100, name: 'Scripts Written', fill: '#4F46E5' },
  { value: 80, name: 'PA Approved', fill: '#6366F1' },
  { value: 65, name: 'First Fill', fill: '#818CF8' },
  { value: 50, name: 'Persistent', fill: '#10B981' },
];

export const FunnelChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnel>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: any, name: any, props: any) => {
               // Calculate drop off roughly
               return [`${value} Patients`, name];
            }}
          />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
          </Funnel>
        </RechartsFunnel>
      </ResponsiveContainer>
    </div>
  );
};