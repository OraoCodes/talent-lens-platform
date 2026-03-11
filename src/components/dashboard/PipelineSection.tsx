import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { Layers, Timer, XCircle, Star } from 'lucide-react';

export function PipelineSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Conv. Rate" value="18.2%" trend={2.1} icon={Layers} color="indigo" />
        <StatCard title="Dwell Time" value="5.4d" trend={-0.5} icon={Timer} color="emerald" />
        <StatCard title="Rejection Rate" value="92.4%" trend={0.2} icon={XCircle} color="rose" />
        <StatCard title="Avg Rating" value="3.8/5" trend={0.1} icon={Star} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Conversion Funnel">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={[{s:'Applied',v:100},{s:'Screened',v:45},{s:'Interview',v:20},{s:'Offer',v:5}]}>
                <XAxis type="number" hide />
                <YAxis dataKey="s" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="v" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Rejection Reasons">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{n:'Skills',v:45},{n:'Culture',v:20},{n:'Salary',v:15}]} dataKey="v" nameKey="n" innerRadius={60} outerRadius={80}>
                   <Cell fill="#6366f1" /><Cell fill="#8b5cf6" /><Cell fill="#ec4899" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}