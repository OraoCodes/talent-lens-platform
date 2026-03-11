import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { Briefcase, UserCheck, Timer, FileText } from 'lucide-react';

export function RecruitmentSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Candidates" value="28,401" trend={18} icon={UserCheck} color="indigo" />
        <StatCard title="Jobs" value="4,821" trend={5} icon={Briefcase} color="emerald" />
        <StatCard title="Applications" value="142.5K" trend={12} icon={FileText} color="amber" />
        <StatCard title="Time-to-Hire" value="18 days" trend={-8} icon={Timer} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Candidates Created Per Month">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{m:'Jan',c:2400},{m:'Feb',c:2100},{m:'Mar',c:2800},{m:'Apr',c:3200}]}>
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="c" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Time-to-Hire Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{d:'1-7',c:12},{d:'8-14',c:45},{d:'15-21',c:82},{d:'22-30',c:120}]}>
                <XAxis dataKey="d" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="c" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}