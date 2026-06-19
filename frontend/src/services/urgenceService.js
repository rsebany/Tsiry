import api from './api.js';

export async function declarerUrgence(payload) {
  const { data } = await api.post('/urgences/declare', payload);
  return data;
}

export async function getHopitaux() {
  const { data } = await api.get('/hopitaux');
  return data;
}
