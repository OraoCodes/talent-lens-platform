import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  Bell, 
  Search, 
  TrendingUp, 
  Activity, 
  Zap, 
  Globe, 
  Share2, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-all rounded-lg group",
      active 
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400" 
        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
    )}
  >
    <Icon className={cn("w-5 h-5 mr-3", active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600")} />
    <span className="flex-1 text-left">{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
  </button>
);

export function DashboardShell({ children, activeTab, onTabChange }: { children: React.ReactNode, activeTab: string, onTabChange: (id: string) => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'growth', label: 'Growth & Adoption', icon: TrendingUp },
    { id: 'recruitment', label: 'Recruitment Activity', icon: Briefcase },
    { id: 'pipeline', label: 'Pipeline Health', icon: Activity },
    { id: 'ai', label: 'AI Features', icon: Zap },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'engagement', label: 'Engagement', icon: Users },
    { id: 'jobboard', label: 'Job Boards', icon: Globe },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out sticky top-0 h-screen",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className={cn("flex items-center gap-2 transition-opacity duration-300", !isSidebarOpen && "hidden")}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">RecruitAI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ""}
              active={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <SidebarItem icon={Settings} label={isSidebarOpen ? "Settings" : ""} onClick={() => {}} />
          <SidebarItem icon={LogOut} label={isSidebarOpen ? "Logout" : ""} onClick={() => {}} />
        </div>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 md:hidden bg-white dark:bg-slate-900 p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl">RecruitAI</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full p-4 rounded-xl text-lg font-medium",
                    activeTab === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600"
                  )}
                >
                  <item.icon className="w-6 h-6 mr-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search metrics..."
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">A</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}