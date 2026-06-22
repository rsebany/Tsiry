import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

// ── SERVICES CENTRALISÉS POUR LES RENDEZ-VOUS ───────────────────────────────

/**
 * Récupère les détails d'un rendez-vous par son ID
 */
export async function fetchRendezVousById(id) {
  const { data } = await api.get(`/rendezvous/${id}`);
  return data;
}

/**
 * Enregistre la présence du patient
 * @param {string|number} id - L'identifiant du rendez-vous
 * @param {boolean} force - Passer à true pour bypasser les restrictions d'heures (dérogation)
 */
export async function registerPatientPresence(id, force = false) {
  const { data } = await api.patch(`/rendezvous/${id}/register`, { force });
  return data;
}

export default api;