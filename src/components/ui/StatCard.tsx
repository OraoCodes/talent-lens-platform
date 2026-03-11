import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  description?: string;
}

export function StatCard({ title, value, trend, trendLabel, icon: Icon, color = 'indigo', description }: StatCardProps) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    slate: "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
          
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                trend >= 0 ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30" : "text-rose-700 bg-rose-50 dark:bg-rose-950/30"
              )}>
                {trend >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-slate-400 ml-2">{trendLabel || 'vs last month'}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}