import api, { unwrap } from '@/services/api';

export async function declarerUrgence(payload) {
  const { data } = await api.post('/urgences/declare', payload);
  return data; // { success, message, data, alerte }
}

export async function getHopitaux() {
  const { data } = await api.get('/hopitaux');
  return unwrap(data);
}

export async function getTriageDashboard() {
  const { data } = await api.get('/urgences/triage-dashboard');
  return unwrap(data); // { stats, urgences }
}

export async function getDernierCasPatient(idPatient) {
  const { data } = await api.get(`/urgences/patient/${idPatient}`);
  return unwrap(data);
}

export async function getHistoriquePatient(idPatient) {
  const { data } = await api.get(`/urgences/patient/${idPatient}/historique`);
  return unwrap(data);
}
