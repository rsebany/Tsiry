import api, { unwrap } from '@/services/api';

// // TODO Nathan: relire le shape paginé de /patients/:id/rendezvous.

export async function fetchSpecialites() {
  const { data } = await api.get('/specialites');
  return unwrap(data);
}

export async function fetchMedecins(specialite) {
  const { data } = await api.get('/medecins', { params: specialite ? { specialite } : {} });
  return unwrap(data);
}

export async function fetchPatients() {
  const { data } = await api.get('/patients');
  return unwrap(data);
}

export async function bookAppointment(payload) {
  const { data } = await api.post('/rendezvous/book', payload);
  return unwrap(data);
}

export async function fetchPatientAppointments(patientId, filter) {
  const { data } = await api.get(`/patients/${patientId}/rendezvous`, {
    params: {
      ...(filter && filter !== 'all' ? { filter } : {}),
      limit: 50,
    },
  });
  return data; // { data, pagination }
}

export async function registerPresence(idRdv) {
  const { data } = await api.patch(`/rendezvous/${idRdv}/register`);
  return unwrap(data);
}

export async function searchTodayAppointments({ nom, telephone }) {
  const { data } = await api.get('/rendezvous/search', {
    params: { nom: nom || undefined, telephone: telephone || undefined },
  });
  return unwrap(data);
}

export async function downloadAppointmentsPDF(patientId) {
  const response = await api.get(`/patients/${patientId}/rendezvous/export`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rendez-vous-${patientId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}


