import React from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Briefcase, 
  Activity, 
  Zap, 
  Mail, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';
import { cn } from '../../lib/utils';

interface WorkspaceDrilldownProps {
  workspace: {
    id: string;
    name: string;
    color: string;
    hires: number;
    activity: number;
    ai: string;
  };
  onBack: () => void;
}

const activityData = [
  { day: 'Mon', events: 120 },
  { day: 'Tue', events: 150 },
  { day: 'Wed', events: 210 },
  { day: 'Thu', events: 180 },
  { day: 'Fri', events: 160 },
  { day: 'Sat', events: 45 },
  { day: 'Sun', events: 30 },
];

export function WorkspaceDrilldown({ workspace, onBack }: WorkspaceDrilldownProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm", workspace.color)}>
            {workspace.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{workspace.name}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              Workspace ID: {workspace.id} • Premium Plan • <span className="text-emerald-600 font-medium">Active</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Team Members" value="12" icon={Users} color="indigo" />
        <StatCard title="Active Jobs" value="8" icon={Briefcase} color="emerald" />
        <StatCard title="Total Candidates" value="452" icon={Activity} color="amber" />
        <StatCard title="AI Usage Rate" value={workspace.ai} icon={Zap} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Daily Activity Events" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="drillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="events" stroke="#6366f1" fill="url(#drillGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-6">Integration Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Gmail Sync</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span className="text-sm">LinkedIn Board</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Slack Notifications</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full">NOT LINKED</span>
            </div>
          </div>
          <button className="w-full mt-8 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            Manage Integrations
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold">Recent Job Activity</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Stage Distribution</th>
              <th className="px-6 py-4 text-left">Apps (7d)</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { title: 'Frontend Engineer', apps: 42, status: 'Open' },
              { title: 'Product Manager', apps: 18, status: 'Open' },
              { title: 'UX Researcher', apps: 5, status: 'Closing Soon' },
            ].map((job, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-medium">{job.title}</td>
                <td className="px-6 py-4">
                  <div className="flex h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div className="bg-indigo-500 w-[40%]" />
                    <div className="bg-purple-500 w-[30%]" />
                    <div className="bg-emerald-500 w-[20%]" />
                  </div>
                </td>
                <td className="px-6 py-4">+{job.apps}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    job.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  )}>{job.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}