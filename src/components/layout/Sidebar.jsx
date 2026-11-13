import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Route,
  MessageSquare,
  Mic,
  Users,
  Settings,
  Bus,
  X,
  Sparkles,
  Database,
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Bus Stops', path: '/stops', icon: MapPin },
  { name: 'Journey Planner', path: '/journey', icon: Route },
  { name: 'AI Chat', path: '/chat', icon: MessageSquare, badge: 'RAG' },
  { name: 'Voice Assistant', path: '/voice', icon: Mic, badge: 'Tamil' },
  { name: 'Crowd Advisor', path: '/crowd-advisor', icon: Users, badge: 'Soon' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400 shadow-sm">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-slate-900 tracking-tight">
                    RouteWise AI
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    MTC
                  </span>
                </div>
                <p className="text-xs text-slate-400">Sholinganallur Corridor</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Transit Modules
            </div>

            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 group ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition ${
                            isActive
                              ? 'text-teal-400'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-slate-800 text-teal-300 border border-slate-700'
                              : item.badge === 'Soon'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Visual Settings placeholder */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preferences
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-not-allowed"
                title="Settings placeholder (visual only)"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">
                  Static
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Dataset Verification Card */}
        <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <Database className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-800">
              Corridor Dataset
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
            26 Stops • 58 Routes • 18,439 Departures verified.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Frontend Preview Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
}

