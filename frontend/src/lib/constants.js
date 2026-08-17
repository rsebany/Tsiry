// Constantes partagées du Système de Gestion Hospitalière.
// // ============ OWNER: Jess (fondation) ============

export const ROLE_LABELS = {
  PATIENT: 'Marary',
  AGENT: 'Mpandraharaha',
  MEDECIN: 'Dokotera',
  ADMIN: 'Admin',
};

export const TICKET_STATUTS = {
  EN_ATTENTE: 'Miandry',
  APPELE: 'Antsoina',
  EN_COURS: 'Mitohy',
  EN_CONSULTATION: 'Am-pitsaboana',
  TRAITE: 'Vita',
  CLOTURE: 'Nofaranana',
};

export const RDV_STATUTS = {
  PLANIFIE: 'Voalahatra',
  PRESENT: 'Tonga',
  ANNULE: 'Nofoanana',
};

export const PRIORITES = {
  ROUGE: 'Mena',
  ORANGE: 'Laoranjy',
  JAUNE: 'Mavo',
  VERT: 'Maitso',
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
