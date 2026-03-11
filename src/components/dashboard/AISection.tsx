import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { Zap, Brain, FileSearch, Sparkles } from 'lucide-react';

export function AISection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="AI Match Rate" value="84%" trend={15} icon={Zap} color="indigo" />
        <StatCard title="Parse Success" value="98.2%" trend={0.5} icon={FileSearch} color="emerald" />
        <StatCard title="AI Accept Rate" value="68%" trend={12} icon={Sparkles} color="amber" />
        <StatCard title="Vector Embeds" value="91.4%" trend={4} icon={Brain} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="AI Adoption Trend" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{w:'W1',m:1200,p:800},{w:'W2',m:1500,p:950},{w:'W3',m:1800,p:1100}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="w" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="m" stroke="#6366f1" name="Matches" />
                <Line type="monotone" dataKey="p" stroke="#10b981" name="Parsed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Suggestions Status">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{n:'Acted',v:68},{n:'Dismissed',v:32}]} dataKey="v" nameKey="n" innerRadius={60}>
                  <Cell fill="#6366f1" /><Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}