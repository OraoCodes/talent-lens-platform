import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { MousePointer2, UserPlus, CheckCircle } from 'lucide-react';

export function EngagementSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="DAU" value="482" trend={5} icon={MousePointer2} color="indigo" />
        <StatCard title="Invitation Accept" value="82%" trend={1.5} icon={UserPlus} color="emerald" />
        <StatCard title="Action Completion" value="94.2%" trend={0.5} icon={CheckCircle} color="amber" />
      </div>

      <ChartCard title="DAU / WAU Trend">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{n:'Mon',d:420,w:1100},{n:'Tue',d:450,w:1120},{n:'Wed',d:480,w:1150}]}>
              <XAxis dataKey="n" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="d" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} name="DAU" />
              <Area type="monotone" dataKey="w" stroke="#10b981" fillOpacity={0} name="WAU" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}