import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { Globe, MousePointer, Users, FileText } from 'lucide-react';

export function JobBoardSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Boards" value="842" trend={12} icon={Globe} color="indigo" />
        <StatCard title="Traffic" value="1.2M" trend={15} icon={Users} color="emerald" />
        <StatCard title="Applications" value="12.4K" trend={22} icon={FileText} color="amber" />
        <StatCard title="Conv Rate" value="4.2%" trend={-0.5} icon={MousePointer} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Inbound Application Growth">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{n:'Jan',a:450},{n:'Feb',a:520},{n:'Mar',a:610}]}>
                <XAxis dataKey="n" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="a" stroke="#6366f1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Job Performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{j:'Dev',v:4200,a:180},{j:'Des',v:3100,a:145}]}>
                <XAxis dataKey="j" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="v" fill="#e2e8f0" name="Views" />
                <Bar dataKey="a" fill="#6366f1" name="Apps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}