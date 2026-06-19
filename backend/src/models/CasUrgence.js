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
     RETURNING *`,
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
    `SELECT * FROM t_cas_urgence
     WHERE id_patient = $1 AND date_declaration::date = CURRENT_DATE
     ORDER BY date_declaration DESC LIMIT 1`,
    [id_patient]
  );
  return rows[0] || null;
}

module.exports = {
  calculerScoreGravite,
  create,
  findLatestByPatient,
  PRIORITY_SCORE,
};
