import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { Mail, Linkedin, Send, AlertTriangle } from 'lucide-react';

export function IntegrationsSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Gmail Links" value="842" trend={8} icon={Mail} color="indigo" />
        <StatCard title="Ingestion Rate" value="96.4%" trend={-1.2} icon={Mail} color="emerald" />
        <StatCard title="LinkedIn Shares" value="2.4K" trend={24} icon={Linkedin} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Email Ingestion Health">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{t:'00h',s:42,f:2},{t:'08h',s:124,f:8},{t:'16h',s:312,f:14}]}>
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="s" stackId="a" fill="#10b981" />
                <Bar dataKey="f" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Active Alerts
          </h3>
          <div className="space-y-4">
            <div className="p-3 border rounded-xl text-sm">Gmail API: Rate limit approaching (85%)</div>
            <div className="p-3 border border-red-100 bg-red-50 rounded-xl text-sm text-red-700">Telegram Bot: Failed deliveries</div>
          </div>
        </div>
      </div>
    </div>
  );
}