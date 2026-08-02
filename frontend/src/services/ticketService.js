import api, { unwrap, sseUrl } from '@/services/api';

// ============ OWNER: Clova (UC9/UC10) ============
export async function generateTicket(patientData) {
  const { data } = await api.post('/tickets/generate', patientData);
  return data; // { success, message, data }
}

export async function getFileAttente() {
  const { data } = await api.get('/file-attente');
  return unwrap(data); // { file_attente, tickets, total_en_attente }
}

export async function getActiveQueue() {
  const { data } = await api.get('/queue/active');
  return unwrap(data); // { file_attente, current, waiting, all }
}

export async function callTicket(id) {
  const { data } = await api.patch(`/tickets/${id}/call`);
  return data;
}

export async function closeTicket(id) {
  const { data } = await api.patch(`/tickets/${id}/close`);
  return data;
}

export async function triggerCall(id, numero_box) {
  const { data } = await api.patch(`/tickets/${id}/trigger-call`, { numero_box });
  return data;
}

export async function getPatientsPresent() {
  try {
    const { data } = await api.get('/patients/present');
    return unwrap(data);
  } catch {
    return [];
  }
}

export async function getTicketStatus(ticketId) {
  const { data } = await api.get(`/tickets/${ticketId}/status`);
  return unwrap(data);
}

export function getStatusStreamUrl(ticketId) {
  return sseUrl(`/tickets/${ticketId}/status/stream`);
}
