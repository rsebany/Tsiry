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

export const fetchPatientAppointments = async (patientId, filter = 'all') => {
  const response = await api.get(`/patients/${patientId}/rendezvous`, {
    params: { filter },
  });
  return response.data;
};

export async function registerPresence(idRdv) {
  const { data } = await api.patch(`/rendezvous/${idRdv}/register`);
  return dafetchPatientAppointments
fetchPatientAppointmentsta;
}

export const downloadAppointmentsPDF = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/rendezvous/export`, {
    responseType: 'blob', // Important pour traiter la réponse binaire PDF
  });

  // Création d'un lien de téléchargement temporaire dans le DOM
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `historique_rdv_patient_${patientId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getPatientAppointments = async (patientId, filter = 'all') => {
  const response = await api.get(`/patients/${patientId}/rendezvous`, {
    params: { filter }, // Génère automatiquement ?filter=upcoming, ?filter=past ou ?filter=all
  });
  return response.data;
};

