// Constantes partagées du Système de Gestion Hospitalière.
// // ============ OWNER: Jess (fondation) ============

export const ROLE_LABELS = {
  PATIENT: 'Patient',
  AGENT: "Agent d'accueil",
  MEDECIN: 'Médecin',
};

export const TICKET_STATUTS = {
  EN_ATTENTE: 'En attente',
  APPELE: 'Appelé',
  EN_COURS: 'En cours',
  EN_CONSULTATION: 'En consultation',
  TRAITE: 'Traité',
  CLOTURE: 'Clôturé',
};

export const RDV_STATUTS = {
  PLANIFIE: 'Planifié',
  PRESENT: 'Présent',
  ANNULE: 'Annulé',
};

export const PRIORITES = {
  ROUGE: 'Rouge',
  ORANGE: 'Orange',
  JAUNE: 'Jaune',
  VERT: 'Vert',
};

export const PRIORITE_ORDER = ['ROUGE', 'ORANGE', 'JAUNE', 'VERT'];

export const FILTER_RDV = {
  ALL: 'all',
  UPCOMING: 'upcoming',
  PAST: 'past',
};

export const POLLING = {
  MONITEUR: 5000,
  MEDECIN: 8000,
  FILE_ATTENTE: 5000,
};

export const SLOT = {
  HOURS_START: 8,
  HOURS_END: 18,
  CLOSED_DAY: 0, // Dimanche (getDay())
};

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
