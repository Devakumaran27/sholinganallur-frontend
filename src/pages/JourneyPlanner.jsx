import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Info,
  Bus,
  Layers,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import JourneyCard from '../components/ui/JourneyCard';
import { fetchDirectJourneys } from '../services/journeyService';
import { fetchBusStops } from '../services/stopsService';

const VERIFIED_PRESETS = [
  {
    label: 'Sholinganallur ➔ T. Nagar (Morning Peak)',
    originStopId: '',
    destination: 'T. Nagar',
    time: '08:00',
  },
  {
    label: 'Sholinganallur ➔ CIT Nagar',
    originStopId: '',
    destination: 'CIT Nagar',
    time: '07:00',
  },
  {
    label: 'Kumaran Nagar ➔ T. Nagar',
    originStopId: 'qQJgvOFz',
    destination: 'T. Nagar',
    time: '08:00',
  },
  {
    label: 'Sholinganallur ➔ Tambaram (No Direct)',
    originStopId: '',
    destination: 'Tambaram MEPZ',
    time: '08:00',
  },
];

export default function JourneyPlanner() {
  const [corridorStops, setCorridorStops] = useState([]);
  const [selectedOriginId, setSelectedOriginId] = useState('');
  const [destinationInput, setDestinationInput] = useState('T. Nagar');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [limit, setLimit] = useState(20);

  const [journeys, setJourneys] = useState([]);
  const [totalOptions, setTotalOptions] = useState(0);
  const [corridorName, setCorridorName] = useState('Sholinganallur -> T. Nagar');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load corridor stops on mount for the origin selector
  useEffect(() => {
    async function loadStops() {
      try {
        const data = await fetchBusStops({ limit: 50 });
        setCorridorStops(data.stops || []);
      } catch (err) {
        console.error('Failed to load corridor stops for origin dropdown:', err);
      }
    }
    loadStops();
  }, []);

  // Execute direct journey lookup
  const handleSearch = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      const destLower = destinationInput.trim().toLowerCase();
      const isTNagarDestination =
        destLower.includes('t. nagar') ||
        destLower.includes('t nagar') ||
        destLower.includes('cit nagar') ||
        destLower.includes('thyagaraya') ||
        destLower === 't.nagar' ||
        destLower === 'tnagar';

      setHasSearched(true);
      setErrorMessage(null);

      // If user queried a destination that has no direct connection in the dataset,
      // show 0 results without making an invalid API call.
      if (!isTNagarDestination) {
        setJourneys([]);
        setTotalOptions(0);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchDirectJourneys({
          origin_stop_id: selectedOriginId || undefined,
          after_time: departureTime ? `${departureTime}:00` : undefined,
          limit,
        });

        setJourneys(data.journeys || []);
        setTotalOptions(data.total_options || 0);
        setCorridorName(data.corridor || 'Sholinganallur -> T. Nagar');
      } catch (err) {
        console.error('Failed to query direct journeys:', err);
        const detail =
          err?.response?.data?.detail ||
          err?.message ||
          'Failed to connect to journey planning API at http://127.0.0.1:8000';
        setErrorMessage(detail);
        setJourneys([]);
        setTotalOptions(0);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedOriginId, destinationInput, departureTime, limit]
  );

  // Auto-search default route on initial mount once stops are loaded
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const applyPreset = (preset) => {
    setSelectedOriginId(preset.originStopId);
    setDestinationInput(preset.destination);
    setDepartureTime(preset.time);
  };

  const handleReset = () => {
    setSelectedOriginId('');
    setDestinationInput('T. Nagar');
    setDepartureTime('08:00');
    setLimit(20);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Journey Planner"
        description="Query direct scheduled transit runs connecting the Sholinganallur corridor to T. Nagar (CIT Nagar) via the FastAPI backend."
        badge={
          <StatusBadge variant="success">
            FastAPI Direct Endpoint Live
          </StatusBadge>
        }
        actions={
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Criteria</span>
          </button>
        }
      />

      {/* Dataset Scope Notice Banner */}
      <div className="rounded-2xl p-4 bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Verified Direct Corridor:</strong> Sourced live from{' '}
            <code className="bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded font-mono text-[11px]">
              GET /api/v1/journey/direct
            </code>
            . Covers direct lines <strong>19, 19A, M51, and 19BET</strong> to T. Nagar / CIT Nagar.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
          MTC GTFS Direct
        </span>
      </div>

      {/* Search Criteria Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">
              Trip Itinerary Criteria
            </h2>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1">Presets:</span>
            {VERIFIED_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-[11px]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Origin Stop */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              <span>Origin Stop</span>
            </label>
            <select
              value={selectedOriginId}
              onChange={(e) => setSelectedOriginId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium"
            >
              <option value="">All Sholinganallur Stops</option>
              {corridorStops.map((stop) => (
                <option key={stop.stop_id} value={stop.stop_id}>
                  {stop.stop_name} (#{stop.stop_code})
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="e.g. T. Nagar or CIT Nagar"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium"
            />
          </div>

          {/* Departure Time */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>After Time (Optional)</span>
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition shadow-sm font-medium"
            />
          </div>

          {/* Limit & Submit Button */}
          <div className="space-y-1.5 md:col-span-1 flex flex-col justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-75 h-[42px]"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Searching...' : 'Find Direct Journeys'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main View Area */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 animate-pulse px-1">
            Querying direct GTFS journeys from backend...
          </div>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-6 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded w-1/6" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="bg-red-50/80 rounded-2xl p-8 border border-red-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-red-900">
            Journey API Request Error
          </h3>
          <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
            {errorMessage}
          </p>
          <div className="pt-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition shadow-sm inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Search</span>
            </button>
          </div>
        </div>
      ) : hasSearched && journeys.length === 0 ? (
        <EmptyState
          title="No direct journey found"
          description={
            destinationInput &&
            !destinationInput.toLowerCase().includes('t. nagar') &&
            !destinationInput.toLowerCase().includes('cit nagar')
              ? `No direct connections exist for destination "${destinationInput}". The static dataset currently includes verified direct services connecting Sholinganallur to T. Nagar (CIT Nagar).`
              : `No direct scheduled departures found departing after ${departureTime || 'the selected time'} for the chosen origin stop.`
          }
          action={
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              Reset to Sholinganallur ➔ T. Nagar
            </button>
          }
        />
      ) : journeys.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Scheduled Direct Journeys
              </h3>
              <StatusBadge variant="info">
                {totalOptions} {totalOptions === 1 ? 'option' : 'options'} returned
              </StatusBadge>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Corridor: {corridorName}</span>
              {departureTime && <span>• After {departureTime}</span>}
            </div>
          </div>

          <div className="space-y-4">
            {journeys.map((journey) => (
              <JourneyCard key={journey.trip_id} journey={journey} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Static Timetable Disclaimer */}
      <div className="rounded-2xl p-4 bg-slate-100/70 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Timetable Information Notice:</strong> Scheduled departures and arrival times are based on the available static MTC GTFS dataset. Real-time GPS tracking and live road traffic delays are not available in this version.
        </p>
      </div>
    </div>
  );
}
