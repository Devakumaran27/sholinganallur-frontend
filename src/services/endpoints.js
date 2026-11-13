/**
 * RouteWise AI API Endpoints Registry
 * Centralized endpoint constants matching FastAPI backend routes.
 */

export const ENDPOINTS = {
  HEALTH: '/health',
  BUS_STOPS: {
    LIST: '/api/v1/stops',
    DETAILS: (stopId) => `/api/v1/stops/${stopId}`,
    NEARBY: '/api/v1/stops/nearby',
  },
  JOURNEY: {
    DIRECT: '/api/v1/journey/direct',
    PLAN: '/api/v1/journey/plan',
    ROUTES: '/api/v1/routes',
  },
  CHAT: {
    ASK: '/api/v1/chat/ask',
    SEND_MESSAGE: '/api/v1/chat/ask',
    HISTORY: '/api/v1/chat/history',
  },
  VOICE: {
    TRANSCRIBE: '/api/v1/voice/transcribe',
    SYNTHESIZE: '/api/v1/voice/synthesize',
  },
  CROWD: {
    ADVISOR: '/api/v1/crowd/advisor',
    ALERTS: '/api/v1/crowd/alerts',
  },
};

export default ENDPOINTS;

