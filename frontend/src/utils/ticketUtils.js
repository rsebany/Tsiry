const ACTIVE_STATUTS = ['APPELE', 'EN_COURS', 'EN_CONSULTATION'];

export function isActiveStatut(statut) {
  return ACTIVE_STATUTS.includes(statut);
}

export function isClosedStatut(statut) {
  return statut === 'CLOTURE' || statut === 'TRAITE';
}

export function formatPatientName(ticket) {
  const parts = [ticket?.patient_prenom, ticket?.patient_nom].filter(Boolean);
  return parts.join(' ') || '—';
}
