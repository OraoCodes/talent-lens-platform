import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { Building2, TrendingUp, UserPlus } from 'lucide-react';

const growthTrend = [
  { date: '2023-12', workspaces: 850, users: 4200 },
  { date: '2024-01', workspaces: 920, users: 4800 },
  { date: '2024-02', workspaces: 1040, users: 5600 },
  { date: '2024-03', workspaces: 1120, users: 6100 },
  { date: '2024-04', workspaces: 1210, users: 7400 },
  { date: '2024-05', workspaces: 1284, users: 8200 },
];

export function GrowthSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Monthly Growth" value="+74" trend={14} icon={Building2} color="indigo" description="New workspaces" />
        <StatCard title="Active Workspaces" value="1,102" trend={4.2} icon={TrendingUp} color="emerald" />
        <StatCard title="New Signups" value="1,842" trend={22.5} icon={UserPlus} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Workspaces Over Time" subtitle="Source: workspaces.created_at">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="workspaces" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Team Distribution" subtitle="Members per workspace">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{s:'1-5',c:420},{s:'6-20',c:580},{s:'21-50',c:180},{s:'51-200',c:75}]}>
                <XAxis dataKey="s" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="c" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}