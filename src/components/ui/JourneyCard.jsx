import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  ArrowRight,
  Bus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function JourneyCard({ journey }) {
  const [showStops, setShowStops] = useState(false);

  if (!journey) return null;

  const {
    trip_id,
    route_number,
    route_name,
    origin_stop_name,
    origin_stop_id,
    scheduled_departure,
    destination_stop_name,
    destination_stop_id,
    scheduled_arrival,
    duration_minutes,
    intermediate_stop_count,
    stops_between = [],
  } = journey;

  // Format duration (e.g. 67.25 -> "1 hr 7 mins" or "67 mins")
  const formatDuration = (mins) => {
    if (!mins && mins !== 0) return 'N/A';
    const totalMinutes = Math.round(mins);
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const remainder = totalMinutes % 60;
    return remainder > 0 ? `${hours} hr ${remainder} mins` : `${hours} hr`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition duration-200 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-base flex items-center gap-1.5 tracking-tight shadow-sm">
            <Bus className="w-4 h-4 text-teal-400" />
            <span>Route {route_number}</span>
          </div>
          <StatusBadge variant="teal">Direct Corridor Connection</StatusBadge>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified GTFS Dataset</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-[11px] text-slate-400">Trip: {trip_id}</span>
        </div>
      </div>

      {/* Trajectory Name */}
      {route_name && (
        <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-normal">Trajectory:</span>
          <span className="text-slate-800">{route_name}</span>
        </div>
      )}

      {/* Main Journey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Origin / Departure */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Origin Departure</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {scheduled_departure}
          </div>
          <div className="text-sm font-semibold text-slate-800">
            {origin_stop_name}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Stop ID: {origin_stop_id}
          </div>
        </div>

        {/* Journey Duration & Route Line */}
        <div className="flex flex-col items-center justify-center text-center px-2 py-1">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full mb-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{formatDuration(duration_minutes)}</span>
          </div>
          <div className="w-full flex items-center justify-center gap-2 my-1 text-slate-300">
            <span className="h-0.5 w-1/3 bg-slate-200 rounded-full" />
            <ArrowRight className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="h-0.5 w-1/3 bg-slate-200 rounded-full" />
          </div>
          <div className="text-xs font-medium text-slate-500">
            {intermediate_stop_count} intermediate stops
          </div>
        </div>

        {/* Destination / Arrival */}
        <div className="space-y-1 md:text-right">
          <div className="flex items-center gap-1.5 md:justify-end text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Destination Arrival</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {scheduled_arrival}
          </div>
          <div className="text-sm font-semibold text-slate-800">
            {destination_stop_name}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Stop ID: {destination_stop_id}
          </div>
        </div>
      </div>

      {/* Expandable Stops Between Sequence */}
      {stops_between && stops_between.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowStops(!showStops)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {showStops
                  ? 'Hide intermediate stop sequence'
                  : `View ${intermediate_stop_count} intermediate stops`}
              </span>
              {showStops ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              MTC Ordered Sequence
            </span>
          </div>

          {showStops && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 max-h-48 overflow-y-auto">
              {stops_between.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-white transition text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[11px] font-mono text-slate-400">
                      #{stop.stop_sequence}
                    </span>
                    <span className="font-medium text-slate-800">{stop.stop_name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Dep: {stop.departure_time || stop.arrival_time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
        <span>Corridor: Sholinganallur ➔ T. Nagar</span>
        <span className="italic">Fixed GTFS Timetable</span>
      </div>
    </div>
  );
}
