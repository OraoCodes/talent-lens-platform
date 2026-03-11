import React from 'react';
import { Filter, Calendar, Download } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select-primitive';

export function Filters({ onWorkspaceChange, onTimeRangeChange }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Analytics</h1>
        <p className="text-slate-500">Platform performance and health.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select onValueChange={onWorkspaceChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Workspaces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workspaces</SelectItem>
            <SelectItem value="acme">Acme Corp</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30d" onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[160px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
}