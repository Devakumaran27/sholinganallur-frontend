import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Bus,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Compass,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/common/SearchInput';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { fetchBusStops, fetchStopRoutes } from '../services/stopsService';

export default function BusStops() {
  const [stops, setStops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mapEligibleOnly, setMapEligibleOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Expanded routes drawer/accordion state per stop ID
  const [expandedStopId, setExpandedStopId] = useState(null);
  const [stopRoutesMap, setStopRoutesMap] = useState({});
  const [loadingRoutesStopId, setLoadingRoutesStopId] = useState(null);

  // Debounce search input to avoid excessive rapid requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load stops from backend API
  const loadStops = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchBusStops({
        query: debouncedQuery,
        map_eligible_only: mapEligibleOnly,
        limit: 50,
      });
      setStops(data.stops || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch bus stops from API:', err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Unable to connect to FastAPI backend at http://127.0.0.1:8000';
      setErrorMessage(detail);
      setStops([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, mapEligibleOnly]);

  useEffect(() => {
    loadStops();
  }, [loadStops]);

  // Handle route loading for an individual stop
  const toggleStopRoutes = async (stopId) => {
    if (expandedStopId === stopId) {
      setExpandedStopId(null);
      return;
    }

    setExpandedStopId(stopId);

    // If already fetched, don't re-fetch
    if (stopRoutesMap[stopId]) {
      return;
    }

    setLoadingRoutesStopId(stopId);
    try {
      const routeData = await fetchStopRoutes(stopId);
      setStopRoutesMap((prev) => ({
        ...prev,
        [stopId]: routeData,
      }));
    } catch (err) {
      console.error(`Failed to fetch routes for stop ${stopId}:`, err);
      setStopRoutesMap((prev) => ({
        ...prev,
        [stopId]: { error: 'Failed to load routes for this stop' },
      }));
    } finally {
      setLoadingRoutesStopId(null);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedQuery('');
    setMapEligibleOnly(false);
    setExpandedStopId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Bus Stops Directory"
        description="Explore live MTC bus stops indexed in the Sholinganallur transit corridor via the FastAPI backend."
        badge={
          <StatusBadge variant="success">
            FastAPI Live Connected
          </StatusBadge>
        }
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              Dataset Total: {totalCount} {totalCount === 1 ? 'Stop' : 'Stops'}
            </span>
            <button
              onClick={loadStops}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
              title="Refresh Stops from Backend"
              aria-label="Refresh stops"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      {/* Backend API Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 px-4 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Live Backend Integration:</strong> Serving actual records from{' '}
            <code className="bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded font-mono text-[11px]">
              GET /api/v1/stops
            </code>
            . Non-map-eligible stops preserve null coordinates as mandated by dataset standards.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded self-start sm:self-auto shrink-0">
          FastAPI v1
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-xl">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search by stop name (e.g. SHOLINGANALLUR, KUMARAN NAGAR)..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mapEligibleOnly}
              onChange={(e) => setMapEligibleOnly(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900/20"
            />
            <span>Map-eligible only (Has verified GPS coordinates)</span>
          </label>

          {(searchTerm || mapEligibleOnly) && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 animate-pulse px-1">
            Loading bus stops from FastAPI backend...
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ) : errorMessage ? (
        <div className="bg-red-50/80 rounded-2xl p-8 border border-red-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-red-900">
            Backend Connection Error
          </h3>
          <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
            {errorMessage}
          </p>
          <div className="pt-2">
            <button
              onClick={loadStops}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition shadow-sm inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      ) : stops.length === 0 ? (
        <EmptyState
          title="No matching bus stops found"
          description={
            searchTerm
              ? `No stop records match "${searchTerm}" in the backend database.`
              : 'No stops available matching the current filter criteria.'
          }
          action={
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              Reset Search & Filters
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>
              Showing {stops.length} of {totalCount} bus stops returned by API
            </span>
            {debouncedQuery && (
              <span className="text-slate-400">
                Filtered by: "{debouncedQuery}"
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stops.map((stop) => {
              const isMapEligible = Boolean(stop.map_eligible);
              const hasCoordinates =
                stop.latitude !== null &&
                stop.latitude !== undefined &&
                stop.longitude !== null &&
                stop.longitude !== undefined;
              const isExpanded = expandedStopId === stop.stop_id;
              const routeData = stopRoutesMap[stop.stop_id];
              const isLoadingRoutes = loadingRoutesStopId === stop.stop_id;

              return (
                <div
                  key={stop.stop_id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Stop Name & Code Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 leading-snug break-words">
                          {stop.stop_name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ID: {stop.stop_id}
                        </p>
                      </div>

                      <span
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold shrink-0"
                        title="Operational Stop Code"
                      >
                        #{stop.stop_code}
                      </span>
                    </div>

                    {/* Coordinates & Map Eligibility Status */}
                    <div className="space-y-2 my-3 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400 font-medium">GPS Coordinates:</span>
                        {hasCoordinates ? (
                          <span className="font-mono text-slate-800 font-semibold text-[11px]">
                            {Number(stop.latitude).toFixed(5)}, {Number(stop.longitude).toFixed(5)}
                          </span>
                        ) : (
                          <span className="italic text-amber-700 font-medium text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            Null (Quarantined)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/40 text-[11px]">
                        <span className="text-slate-400">Quality Status:</span>
                        <span className="text-slate-700 font-medium truncate max-w-[180px]" title={stop.coordinate_status}>
                          {stop.coordinate_status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {stop.coordinate_source && (
                        <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 pt-0.5">
                          <span>Source:</span>
                          <span className="font-mono">{stop.coordinate_source}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Serving Routes Drawer */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <StatusBadge
                        variant={isMapEligible ? 'success' : 'warning'}
                      >
                        {isMapEligible ? 'Map Eligible' : 'Not Map Eligible'}
                      </StatusBadge>

                      <button
                        type="button"
                        onClick={() => toggleStopRoutes(stop.stop_id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition"
                      >
                        <Bus className="w-3.5 h-3.5 text-teal-600" />
                        <span>{isExpanded ? 'Hide Routes' : 'Serving Routes'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Serving Routes Expansion */}
                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/90 rounded-xl p-3 space-y-2">
                        {isLoadingRoutes ? (
                          <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                            <span className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                            <span>Loading serving routes from backend...</span>
                          </div>
                        ) : routeData?.error ? (
                          <div className="text-xs text-red-600">
                            {routeData.error}
                          </div>
                        ) : routeData?.routes?.length > 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                              <span>Total Active Routes:</span>
                              <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono">
                                {routeData.total_routes}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pt-1">
                              {routeData.routes.map((rt, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-white text-slate-800 font-bold text-[11px] border border-slate-200 shadow-2xs"
                                  title={`${rt.route_number}: ${rt.route_name}`}
                                >
                                  {rt.route_number}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">
                            No serving routes cataloged for this stop ID.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
