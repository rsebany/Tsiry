const pool = require('../../config/db');

async function getNextNumero(id_file) {
  const { rows } = await pool.query(
    `SELECT COALESCE(MAX(numero), 0) + 1 AS prochain_numero
     FROM t_ticket WHERE id_file = $1`,
    [id_file]
  );
  return parseInt(rows[0].prochain_numero, 10);
}

async function create(id_file, patientNom = null, patientPrenom = null, id_patient = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const prochainNumero = await getNextNumero(id_file);
    const { rows } = await client.query(
      `INSERT INTO t_ticket (numero, id_file, statut, heure_creation, patient_nom, patient_prenom, id_patient)
       VALUES ($1, $2, 'EN_ATTENTE', NOW(), $3, $4, $5)
       RETURNING id_ticket, numero, statut, heure_creation, patient_nom, patient_prenom, id_file, id_patient, numero_box`,
      [prochainNumero, id_file, patientNom || null, patientPrenom || null, id_patient || null]
    );
    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function findByFileId(id_file) {
  const { rows } = await pool.query(
    `SELECT t.*, cu.niveau_priorite
     FROM t_ticket t
     LEFT JOIN LATERAL (
       SELECT niveau_priorite, score_gravite FROM t_cas_urgence
       WHERE id_patient = t.id_patient AND date_declaration::date = CURRENT_DATE
       ORDER BY date_declaration DESC LIMIT 1
     ) cu ON true
     WHERE t.id_file = $1
     ORDER BY COALESCE(cu.score_gravite, 0) DESC, t.heure_creation ASC`,
    [id_file]
  );
  return rows;
}

async function findById(id_ticket) {
  const { rows } = await pool.query(
    `SELECT * FROM t_ticket WHERE id_ticket = $1`,
    [id_ticket]
  );
  return rows[0] || null;
}

async function updateStatut(id_ticket, statut) {
  let extra = '';
  if (statut === 'APPELE' || statut === 'EN_COURS' || statut === 'EN_CONSULTATION') {
    extra = ', heure_appel = NOW()';
  } else if (statut === 'CLOTURE' || statut === 'TRAITE') {
    extra = ', heure_cloture = NOW()';
  }
  const { rows } = await pool.query(
    `UPDATE t_ticket SET statut = $1${extra} WHERE id_ticket = $2 RETURNING *`,
    [statut, id_ticket]
  );
  return rows[0] || null;
}

module.exports = {
  getNextNumero,
  create,
  findByFileId,
  findById,
  updateStatut,
};
