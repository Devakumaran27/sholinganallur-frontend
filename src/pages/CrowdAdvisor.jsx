import React, { useState } from 'react';
import {
  Users,
  Calendar,
  MapPin,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';

const CHENNAI_EVENTS = [
  { id: 'pongal', name: 'Pongal Festival Season', date: 'January Mid', impact: 'High (State Holiday Exoduses)' },
  { id: 'margazhi', name: 'Margazhi Music Festival (Mylapore)', date: 'December - January', impact: 'Moderate (Evening Congestion)' },
  { id: 'diwali', name: 'Diwali Shopping Rush (T. Nagar)', date: 'October - November', impact: 'Severe (Commercial Hubs)' },
  { id: 'ipl', name: 'Chepauk IPL Cricket Match Day', date: 'April - May', impact: 'High (Mount Road / Triplicane)' },
];

const CHENNAI_HUBS = [
  'T. Nagar (Panagal Park & Ranganathan St)',
  'Sholinganallur Junction & OMR IT Corridors',
  'Mylapore & Luz Corner',
  'Central & Broadway (George Town)',
  'Tambaram Sanatorium Hub',
];

export default function CrowdAdvisor() {
  const [selectedDate, setSelectedDate] = useState('2026-11-15');
  const [selectedArea, setSelectedArea] = useState(CHENNAI_HUBS[0]);
  const [selectedEvent, setSelectedEvent] = useState(CHENNAI_EVENTS[0].id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Event & Festival Crowd Advisor"
        description="Predict transit congestion spikes during major Chennai religious festivals, sporting events, and corridor peaks."
        badge={
          <StatusBadge variant="warning">Coming Soon</StatusBadge>
        }
      />

      {/* Coming Soon Notice Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/90 p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
          <Users className="w-8 h-8" />
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-200/70 text-purple-900 uppercase tracking-wider">
            Crowd Advisor — Coming Soon
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Predictive Festival & Corridor Surge Advisory
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This module will integrate event calendars, holiday timetables, and historical congestion patterns for Chennai. Real-time predictive calculations are not active in this prototype.
          </p>
        </div>
      </div>

      {/* Advisory Criteria Selector (Interactive Form UI) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Simulate Advisory Parameter Selection
          </h3>
          <span className="text-xs text-slate-400 font-medium">UI Prototype Only</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Journey Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium"
            />
          </div>

          {/* Destination Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Target Hub / Corridor</span>
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium"
            >
              {CHENNAI_HUBS.map((hub, idx) => (
                <option key={idx} value={hub}>
                  {hub}
                </option>
              ))}
            </select>
          </div>

          {/* Festival / Event */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Associated Event</span>
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium"
            >
              {CHENNAI_EVENTS.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estimated Crowd-Risk Card (Demonstration Preview Only) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Estimated Crowd-Risk Simulation
            </h3>
          </div>
          <StatusBadge variant="purple">UI Mockup Preview</StatusBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Projected Surge Index
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
                Elevated (Demo)
              </span>
            </div>
            <div className="text-3xl font-extrabold text-amber-950">
              High Volume
            </div>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              Demonstration baseline indicates heavy evening corridor loading during festival and event periods.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Simulated Corridor
            </span>
            <div className="text-lg font-bold text-slate-900 truncate">
              {selectedArea}
            </div>
            <p className="text-xs text-slate-500">
              Affected primary routes: 102, 19B, 570, 119
            </p>
          </div>
        </div>

        {/* Travel Recommendations Preview */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            Demonstration Travel Recommendations:
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
              <span>
                <strong>Off-Peak Departure:</strong> Board prior to 04:30 PM or after 08:30 PM to avoid peak boarding queues at Sholinganallur.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
              <span>
                <strong>Alternative Line:</strong> Consider limited stop express services (e.g., 102X or 19BET) over local stopping patterns.
              </span>
            </li>
          </ul>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
          Disclaimer: Live crowd telemetry and real-time risk calculations will be plugged in as backend models mature.
        </div>
      </div>
    </div>
  );
}
