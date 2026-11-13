/**
 * Service module for Journey Planning API integration.
 * Communicates with FastAPI backend at /api/v1/journey/direct.
 */
import api from './api';
import ENDPOINTS from './endpoints';

/**
 * Fetch direct Sholinganallur to T. Nagar (CIT Nagar) journeys from the backend.
 *
 * @param {Object} options
 * @param {string} [options.origin_stop_id] - Optional filter for specific origin Sholinganallur stop ID
 * @param {string} [options.after_time] - Optional departure time filter (e.g. '08:00:00' or '08:00')
 * @param {number} [options.limit=20] - Maximum direct journey options to return (1-50)
 * @returns {Promise<{corridor: string, total_options: number, journeys: Array}>}
 */
export async function fetchDirectJourneys({ origin_stop_id, after_time, limit = 20 } = {}) {
  const params = {};

  if (origin_stop_id && typeof origin_stop_id === 'string' && origin_stop_id.trim()) {
    params.origin_stop_id = origin_stop_id.trim();
  }

  if (after_time && typeof after_time === 'string' && after_time.trim()) {
    let cleanTime = after_time.trim();
    // Ensure HH:MM has seconds appended if not present
    if (/^\d{2}:\d{2}$/.test(cleanTime)) {
      cleanTime = `${cleanTime}:00`;
    }
    params.after_time = cleanTime;
  }

  if (limit && Number.isInteger(Number(limit))) {
    params.limit = Math.min(Math.max(Number(limit), 1), 50);
  }

  const response = await api.get(ENDPOINTS.JOURNEY.DIRECT, { params });
  return response.data;
}

