import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { 
  Users, 
  Building2, 
  Target, 
  AlertCircle, 
  Clock, 
  Zap, 
  Mail,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { WorkspaceDrilldown } from './WorkspaceDrilldown';
import { cn } from '../../lib/utils';

// Mock Data
const growthData = [
  { name: 'Jan', workspaces: 45, signups: 120 },
  { name: 'Feb', workspaces: 52, signups: 145 },
  { name: 'Mar', workspaces: 68, signups: 190 },
  { name: 'Apr', workspaces: 94, signups: 260 },
  { name: 'May', workspaces: 110, signups: 310 },
  { name: 'Jun', workspaces: 132, signups: 380 },
];

const pipelineData = [
  { stage: 'Screening', count: 1200, color: '#6366f1' },
  { stage: 'Interview', count: 450, color: '#8b5cf6' },
  { stage: 'Assessment', count: 180, color: '#a855f7' },
  { stage: 'Offer', count: 65, color: '#d946ef' },
  { stage: 'Hired', count: 42, color: '#ec4899' },
];

const workspaces = [
  { id: 'ws-1', name: 'Acme Corp', hires: 24, activity: 98, ai: '92%', color: 'bg-blue-500' },
  { id: 'ws-2', name: 'Globex Inc', hires: 18, activity: 85, ai: '88%', color: 'bg-purple-500' },
  { id: 'ws-3', name: 'Stark Ind.', hires: 15, activity: 92, ai: '95%', color: 'bg-red-500' },
  { id: 'ws-4', name: 'Wayne Ent.', hires: 12, activity: 76, ai: '81%', color: 'bg-slate-800' },
  { id: 'ws-5', name: 'Umbrella Co.', hires: 9, activity: 64, ai: '72%', color: 'bg-green-500' },
];

export function Overview() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<typeof workspaces[0] | null>(null);

  const exportData = () => {
    toast.success("Exporting dashboard data as CSV...");
  };

  if (selectedWorkspace) {
    return <WorkspaceDrilldown workspace={selectedWorkspace} onBack={() => setSelectedWorkspace(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workspaces"
          value="1,284"
          trend={12.5}
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Active Users"
          value="15.2K"
          trend={8.2}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Jobs Posted"
          value="4,821"
          trend={-2.4}
          icon={Target}
          color="amber"
        />
        <StatCard
          title="Avg. Time to Hire"
          value="18.5d"
          trend={-15.0}
          trendLabel="days decreased"
          icon={Clock}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <ChartCard 
          title="Platform Growth" 
          subtitle="Workspace and User Signup Trends"
          className="lg:col-span-2"
          onExport={exportData}
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorWorkspaces" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="workspaces" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorWorkspaces)" 
                  strokeWidth={2}
                  name="Workspaces"
                />
                <Area 
                  type="monotone" 
                  dataKey="signups" 
                  stroke="#10b981" 
                  fillOpacity={0} 
                  strokeWidth={2}
                  name="Signups"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Pipeline Distribution */}
        <ChartCard title="Hiring Pipeline" subtitle="Candidate flow across stages">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{fontSize: 12, fill: '#64748b'}}
                  width={80}
                />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Overall Conversion</span>
              <span className="font-semibold">3.5%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '3.5%' }}></div>
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts / Anomalies */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              System Alerts
            </h3>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">3 Active</span>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl">
              <Zap className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-400">Gmail Sync Failure</p>
                <p className="text-xs text-red-700/80 dark:text-red-500/80">Acme Corp (ID: 482) has 12 failed ingestions.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-400">Stagnant Pipelines</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-500/80">4 workspaces have candidates stuck {'>'} 7 days.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-400">LinkedIn API Refresh</p>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-500/80">Integration token for Globex Inc expires in 48h.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Workspaces Leaderboard */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold">Top Performing Workspaces</h3>
            <p className="text-xs text-slate-500">Click to drill down</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Workspace</th>
                <th className="px-6 py-3 text-left font-medium">Hires (30d)</th>
                <th className="px-6 py-3 text-left font-medium">Activity Score</th>
                <th className="px-6 py-3 text-left font-medium">AI Match Rate</th>
                <th className="px-6 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {workspaces.map((ws, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedWorkspace(ws)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold", ws.color)}>
                        {ws.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium">{ws.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{ws.hires}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full w-24">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${ws.activity}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{ws.activity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ws.ai}</td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}