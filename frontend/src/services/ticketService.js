import api from './api.js';

export async function generateTicket(patientData) {
  const { data } = await api.post('/tickets/generate', patientData);
  return data;
}

export async function getFileAttente() {
  const { data } = await api.get('/file-attente');
  return data;
}

export async function appelerProchainTicket() {
  const { data } = await api.put('/tickets/appeler');
  return data;
}

export async function terminerTicket(id) {
  const { data } = await api.put(`/tickets/${id}/terminer`);
  return data;
}

export async function getPatientsPresent() {
  try {
    const { data } = await api.get('/patients/present');
    return data;
  } catch {
    return { success: true, data: [] };
  }
}

export async function getTicketStatus(ticketId) {
  const { data } = await api.get(`/tickets/${ticketId}/status`);
  return data.data;
}

export async function getActiveQueue() {
  const { data } = await api.get('/queue/active');
  return data;
}

export async function callTicket(id) {
  const { data } = await api.patch(`/tickets/${id}/call`);
  return data;
}

export async function closeTicket(id) {
  const { data } = await api.patch(`/tickets/${id}/close`);
  return data;
}
