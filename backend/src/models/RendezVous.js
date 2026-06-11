const pool = require('../config/db');

async function findConflict(id_medecin, date_heure) {
  const { rows } = await pool.query(
    `SELECT id_rdv FROM t_rendez_vous
     WHERE id_medecin = $1 AND date_heure = $2 AND statut != 'ANNULE'`,
    [id_medecin, date_heure]
  );
  return rows[0] || null;
}

async function create({ id_patient, id_medecin, date_heure, motif }) {
  const { rows } = await pool.query(
    `INSERT INTO t_rendez_vous (id_patient, id_medecin, date_heure, motif, statut)
     VALUES ($1, $2, $3, $4, 'PLANIFIE')
     RETURNING *`,
    [id_patient, id_medecin, date_heure, motif || null]
  );
  return rows[0];
}

module.exports = { findConflict, create };
