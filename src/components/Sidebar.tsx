import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarDays,
  DollarSign,
  Settings,
  Wrench,
  X,
  PhoneCall,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { t, activeTab, setActiveTab, orders, profile } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'in_progress'
  ).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'customers',
      label: t.nav.customers,
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'orders',
      label: t.nav.orders,
      icon: <ClipboardList className="w-5 h-5" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'schedule',
      label: t.nav.schedule,
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: 'revenue',
      label: t.nav.revenue,
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Brand Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Usta<span className="text-blue-600 dark:text-blue-400">Pro</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Technician Info Card */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {profile.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {profile.specialty}
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-slate-400" />
              <span>{profile.phone}</span>
            </div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {profile.workHours}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left) */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer container */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
