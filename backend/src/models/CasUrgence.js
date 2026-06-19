const pool = require('../config/db');

function calculerScoreGravite(pouls, tension_systolique, saturation_o2) {
  if (
    saturation_o2 < 90 ||
    pouls > 120 ||
    pouls < 50 ||
    tension_systolique < 90 ||
    tension_systolique > 180
  ) {
    return 'ROUGE';
  }
  if (
    saturation_o2 < 94 ||
    pouls > 100 ||
    pouls < 55 ||
    tension_systolique > 160 ||
    tension_systolique < 100
  ) {
    return 'ORANGE';
  }
  if (saturation_o2 < 96 || pouls > 90 || tension_systolique > 140) {
    return 'JAUNE';
  }
  return 'VERT';
}

async function create({ id_patient, pouls, tension_systolique, saturation_o2 }) {
  const niveau_priorite = calculerScoreGravite(pouls, tension_systolique, saturation_o2);
  const { rows } = await pool.query(
    `INSERT INTO t_cas_urgence (id_patient, pouls, tension_systolique, saturation_o2, niveau_priorite)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id_patient, pouls, tension_systolique, saturation_o2, niveau_priorite]
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
};
