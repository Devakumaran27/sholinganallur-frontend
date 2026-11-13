/**
 * Service module for Grounded Transit AI Chat.
 * Communicates with FastAPI backend at /api/v1/chat/ask.
 */
import api from './api';
import ENDPOINTS from './endpoints';

/**
 * Send a question to the grounded transit assistant.
 *
 * @param {Object} options
 * @param {string} options.question - User's transport query (min 2, max 1000 chars)
 * @param {number} [options.top_k=4] - Number of RAG chunks to retrieve (1-10)
 * @returns {Promise<{question: string, answer: string, grounding_sources: Array, structured_context_used: Object|null, limitations: Array}>}
 */
export async function askTransitAssistant({ question, top_k = 4 }) {
  if (!question || typeof question !== 'string' || question.trim().length < 2) {
    throw new Error('Please enter a question with at least 2 characters.');
  }

  const payload = {
    question: question.trim(),
    top_k: Math.min(Math.max(Number(top_k) || 4, 1), 10),
  };

  const response = await api.post(
    ENDPOINTS.CHAT.ASK,
    {
      question: payload.question,
      top_k: payload.top_k,
    },
    {
      timeout: 35000, // 35s timeout for Gemini GenAI synthesis and transient retry handling
    }
  );

  return response.data;
}

