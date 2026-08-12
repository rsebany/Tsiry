import axios from 'axios';
import { getStoredToken, clearStoredToken } from '@/lib/auth';

// Client axios unique du frontend.
// // ============ OWNER: Jess (fondation) ============
// Base URL : VITE_API_URL (défaut "/api") — proxy Vite → backend (voir vite.config.js).

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      clearStoredToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Normalise les réponses backend (3 formes coexistent) :
//  - { success, data, ... }  → renvoie data
//  - tableau brut (specialites, medecins...) → renvoie tel quel
//  - ligne brute (auth, book, register) → renvoie tel quel
export function unwrap(payload) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'success' in payload) {
    return payload.data ?? payload;
  }
  return payload;
}

// Message d'erreur lisible depuis une erreur axios
export function errorMessage(error, fallback = 'Hadisoana tambajotra') {
  return error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
}

export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

export function sseUrl(path) {
  const base = import.meta.env.VITE_API_URL || '/api';
  const token = getStoredToken();
  const separator = path.includes('?') ? '&' : '?';
  return `${base}${path}${token ? `${separator}token=${encodeURIComponent(token)}` : ''}`;
}

export default api;
