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

async function findById(id_rdv) {
  const { rows } = await pool.query(
    `SELECT * FROM t_rendez_vous WHERE id_rdv = $1`,
    [id_rdv]
  );
  return rows[0] || null;
}

async function updatePresence(id_rdv) {
  const { rows } = await pool.query(
    `UPDATE t_rendez_vous SET statut = 'PRESENT'
     WHERE id_rdv = $1 AND statut = 'PLANIFIE'
     RETURNING *`,
    [id_rdv]
  );
  return rows[0] || null;
}

async function findPresentToday() {
  const { rows } = await pool.query(
    `SELECT u.nom AS patient_nom, u.prenom AS patient_prenom, r.id_rdv
     FROM t_rendez_vous r
     JOIN t_utilisateur u ON r.id_patient = u.id_utilisateur
     WHERE r.statut = 'PRESENT' AND DATE(r.date_heure) = CURRENT_DATE
     ORDER BY r.date_heure ASC`
  );
  return rows;
}

async function findByPatient(id_patient) {
  const { rows } = await pool.query(
    `SELECT r.id_rdv, r.date_heure, r.motif, r.statut,
            u.nom AS nom_medecin, u.prenom AS prenom_medecin, u.specialite
     FROM t_rendez_vous r
     JOIN t_utilisateur u ON r.id_medecin = u.id_utilisateur
     WHERE r.id_patient = $1
     ORDER BY r.date_heure DESC`,
    [id_patient]
  );
  return rows;
}

module.exports = {
  findConflict,
  create,
  findById,
  updatePresence,
  findPresentToday,
  findByPatient,
};
