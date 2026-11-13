/**
 * Service module for Bus Stops API integration.
 * Communicates with FastAPI backend at /api/v1/stops.
 */
import api from './api';
import ENDPOINTS from './endpoints';

/**
 * Fetch bus stops with optional search query and map eligibility filter.
 *
 * @param {Object} options
 * @param {string} [options.query] - Case-insensitive search string matching stop names
 * @param {boolean} [options.map_eligible_only] - If true, filters out stops with missing coordinates
 * @param {number} [options.limit=50] - Maximum number of stops to return
 * @returns {Promise<{total: number, query: string|null, stops: Array}>}
 */
export async function fetchBusStops({ query = '', map_eligible_only = false, limit = 50 } = {}) {
  const params = {};

  const cleanQuery = query ? query.trim() : '';
  if (cleanQuery.length > 0) {
    params.query = cleanQuery;
  }

  if (map_eligible_only) {
    params.map_eligible_only = true;
  }

  if (limit) {
    params.limit = limit;
  }

  const response = await api.get(ENDPOINTS.BUS_STOPS.LIST, { params });
  return response.data;
}

/**
 * Fetch routes serving a specific bus stop.
 *
 * @param {string} stopId - Target bus stop ID (e.g. 'elxmPCDf' or '380')
 * @returns {Promise<{stop_id: string, stop_name: string, total_routes: number, routes: Array}>}
 */
export async function fetchStopRoutes(stopId) {
  if (!stopId) {
    throw new Error('Stop ID is required');
  }
  const endpoint = ENDPOINTS.BUS_STOPS.DETAILS(stopId) + '/routes';
  const response = await api.get(endpoint);
  return response.data;
}

