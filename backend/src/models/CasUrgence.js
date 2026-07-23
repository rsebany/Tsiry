const pool = require('../config/db');

const PRIORITY_SCORE = {
  ROUGE: 4,
  ORANGE: 3,
  JAUNE: 2,
  VERT: 1,
};

function calculerScoreGravite(pouls, tension_systolique, saturation_o2) {
  if (
    saturation_o2 < 90 ||
    pouls > 120 ||
    pouls < 50 ||
    tension_systolique < 90 ||
    tension_systolique > 180
  ) {
    return { niveau_priorite: 'ROUGE', score_gravite: PRIORITY_SCORE.ROUGE };
  }
  if (
    saturation_o2 < 94 ||
    pouls > 100 ||
    pouls < 55 ||
    tension_systolique > 160 ||
    tension_systolique < 100
  ) {
    return { niveau_priorite: 'ORANGE', score_gravite: PRIORITY_SCORE.ORANGE };
  }
  if (saturation_o2 < 96 || pouls > 90 || tension_systolique > 140) {
    return { niveau_priorite: 'JAUNE', score_gravite: PRIORITY_SCORE.JAUNE };
  }
  return { niveau_priorite: 'VERT', score_gravite: PRIORITY_SCORE.VERT };
}

async function create({ id_patient, pouls, tension_systolique, saturation_o2, id_medecin = null }) {
  const { niveau_priorite, score_gravite } = calculerScoreGravite(
    pouls,
    tension_systolique,
    saturation_o2
  );

  const { rows } = await pool.query(
    `INSERT INTO t_cas_urgence (
       id_patient, id_medecin, pouls, tension_systolique, saturation_o2,
       niveau_priorite, score_gravite
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING 
       id_urgence,
       id_patient,
       id_medecin,
       pouls,
       tension_systolique,
       saturation_o2,
       niveau_priorite,
       score_gravite,
       TO_CHAR(date_declaration, 'YYYY-MM-DD"T"HH24:MI:SS') AS date_declaration`,
    [
      id_patient,
      id_medecin,
      pouls,
      tension_systolique,
      saturation_o2,
      niveau_priorite,
      score_gravite,
    ]
  );
  return rows[0];
}

async function findLatestByPatient(id_patient) {
  const { rows } = await pool.query(
    `SELECT 
       id_urgence,
       id_patient,
       id_medecin,
       pouls,
       tension_systolique,
       saturation_o2,
       niveau_priorite,
       score_gravite,
       TO_CHAR(date_declaration, 'YYYY-MM-DD"T"HH24:MI:SS') AS date_declaration
     FROM t_cas_urgence
     WHERE id_patient = $1 AND date_declaration::date = CURRENT_DATE
     ORDER BY date_declaration DESC 
     LIMIT 1`,
    [id_patient]
  );
  return rows[0] || null;
}

// Historique complet des urgences d'un patient avec formatage précis de la date
async function findAllByPatient(id_patient) {
  const { rows } = await pool.query(
    `SELECT 
       cu.id_urgence,
       cu.id_patient,
       cu.id_medecin,
       cu.pouls,
       cu.tension_systolique,
       cu.saturation_o2,
       cu.niveau_priorite,
       cu.score_gravite,
       TO_CHAR(cu.date_declaration, 'YYYY-MM-DD"T"HH24:MI:SS') AS date_declaration,
       COALESCE(u.nom, '') AS medecin_nom,
       COALESCE(u.prenom, '') AS medecin_prenom
     FROM t_cas_urgence cu
     LEFT JOIN t_utilisateur u ON u.id_utilisateur = cu.id_medecin
     WHERE cu.id_patient = $1
     ORDER BY cu.date_declaration DESC`,
    [id_patient]
  );
  return rows;
}

// Encapsulation de la requête du tableau de bord de triage avec dates formatées
async function getTriageDashboardData() {
  const statsQuery = await pool.query(
    `SELECT 
       COUNT(*)::int AS total_urgences,
       COUNT(*) FILTER (WHERE niveau_priorite = 'ROUGE')::int AS count_rouge,
       COUNT(*) FILTER (WHERE niveau_priorite = 'ORANGE')::int AS count_orange,
       COUNT(*) FILTER (WHERE niveau_priorite = 'JAUNE')::int AS count_jaune,
       COUNT(*) FILTER (WHERE niveau_priorite = 'VERT')::int AS count_vert,
       COALESCE(ROUND(AVG(score_gravite)::numeric, 2), 0)::float AS score_moyen
     FROM t_cas_urgence
     WHERE date_declaration::date = CURRENT_DATE`
  );

  const casQuery = await pool.query(
    `SELECT 
       cu.id_urgence,
       cu.id_patient,
       cu.pouls,
       cu.tension_systolique,
       cu.saturation_o2,
       cu.niveau_priorite,
       cu.score_gravite,
       TO_CHAR(cu.date_declaration, 'YYYY-MM-DD"T"HH24:MI:SS') AS date_declaration,
       COALESCE(u.nom, 'Inconnu') AS patient_nom,
       COALESCE(u.prenom, '') AS patient_prenom,
       t.id_ticket,
       t.numero AS numero_ticket,
       t.statut AS statut_ticket
     FROM t_cas_urgence cu
     LEFT JOIN t_utilisateur u ON u.id_utilisateur = cu.id_patient
     LEFT JOIN LATERAL (
       SELECT id_ticket, numero, statut
       FROM t_ticket
       WHERE id_patient = cu.id_patient
         AND heure_creation::date = CURRENT_DATE
       ORDER BY heure_creation DESC
       LIMIT 1
     ) t ON TRUE
     WHERE cu.date_declaration::date = CURRENT_DATE
     ORDER BY cu.score_gravite DESC, cu.date_declaration DESC`
  );

  return {
    stats: statsQuery.rows[0],
    urgences: casQuery.rows,
  };
}

module.exports = {
  calculerScoreGravite,
  create,
  findLatestByPatient,
  findAllByPatient,
  getTriageDashboardData,
  PRIORITY_SCORE,
};