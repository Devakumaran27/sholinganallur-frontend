import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bus, ShieldCheck, ChevronRight, User } from 'lucide-react';

const PAGE_META = {
  '/': {
    title: 'Dashboard Overview',
    breadcrumb: 'System Overview & GTFS Dataset',
  },
  '/stops': {
    title: 'Bus Stops Explorer',
    breadcrumb: 'Sholinganallur Corridor Stations',
  },
  '/journey': {
    title: 'Journey Planner',
    breadcrumb: 'MTC Route Schedules & Timetables',
  },
  '/chat': {
    title: 'RouteWise AI Chat',
    breadcrumb: 'RAG-Grounded Transit Intelligence',
  },
  '/voice': {
    title: 'Voice Assistant',
    breadcrumb: 'Tamil / Tanglish Speech Assistant',
  },
  '/crowd-advisor': {
    title: 'Crowd Advisor',
    breadcrumb: 'Festival & Event Crowd Intelligence',
  },
};

export default function TopNavbar({ onMenuClick }) {
  const location = useLocation();
  const currentMeta = PAGE_META[location.pathname] || {
    title: 'RouteWise AI',
    breadcrumb: 'Public Transit Dashboard',
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>RouteWise</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600 font-medium">{currentMeta.breadcrumb}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {currentMeta.title}
          </h2>
        </div>
      </div>

      {/* Right: Operational Status & Profile Placeholder */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dataset Status Tag */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">Verified GTFS Data</span>
          <span className="text-[11px] text-slate-400">|</span>
          <span className="text-[11px] font-medium text-slate-500">MTC Chennai</span>
        </div>

        {/* User / Operator Placeholder */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l sm:border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-xs shadow-sm">
            RW
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              Transit Operator
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Demo Environment
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

