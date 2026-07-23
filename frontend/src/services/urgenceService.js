import api from './api.js';

export async function declarerUrgence(payload) {
  const { data } = await api.post('/urgences/declare', payload);
  return data;
}

export async function getHopitaux() {
  const { data } = await api.get('/hopitaux');
  return data;
}

export async function getDernierCasPatient(idPatient) {
  const response = await api.get(`/urgences/patient/${idPatient}`);
  return response.data;
}

//Service pour récupérer le tableau de bord de triage
export async function getTriageDashboard() {
  const response = await api.get('/urgences/triage-dashboard');
  return response.data;
}

// Appel API pour l'historique d'un patient
export async function getHistoriqueUrgencesPatient(idPatient) {
  const response = await api.get(`/urgences/patient/${idPatient}/historique`);
  return response.data;
}