/**
 * api.ts — Cliente HTTP centralizado para chamadas ao Backend FastAPI.
 *
 * Todas as requisições para /api/* incluem automaticamente o header X-API-Key.
 * Isso garante que apenas o frontend autorizado consiga disparar notificações WhatsApp.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Faz uma requisição autenticada ao backend com JSON.
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('X-API-Key', API_KEY);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * Faz uma requisição autenticada ao backend com FormData (multipart).
 * NÃO define Content-Type — o browser define automaticamente com boundary.
 */
export async function apiRequestFormData(endpoint: string, formData: FormData): Promise<Response> {
  return fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
    },
    body: formData,
  });
}

export { BACKEND_URL, API_KEY };
