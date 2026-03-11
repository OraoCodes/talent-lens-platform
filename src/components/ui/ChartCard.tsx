import React from 'react';
import { cn } from '../../lib/utils';
import { Download, MoreHorizontal } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onExport?: () => void;
}

export function ChartCard({ title, subtitle, children, className, onExport }: ChartCardProps) {
  return (
    <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col h-full", className)}>
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button onClick={onExport} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-6 flex-1">
        {children}
      </div>
    </div>
  );
}