import api from './api.js';

export async function fetchSpecialites() {
  const { data } = await api.get('/specialites');
  return data;
}

export async function fetchMedecins(specialite) {
  const params = specialite ? { specialite } : {};
  const { data } = await api.get('/medecins', { params });
  return data;
}

export async function fetchPatients() {
  const { data } = await api.get('/patients');
  return data;
}

export async function bookAppointment(payload) {
  const { data } = await api.post('/rendezvous/book', payload);
  return data;
}
