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
    `SELECT u.id_utilisateur AS id_patient, u.nom AS patient_nom, u.prenom AS patient_prenom, r.id_rdv
     FROM t_rendez_vous r
     JOIN t_utilisateur u ON r.id_patient = u.id_utilisateur
     WHERE r.statut = 'PRESENT' AND DATE(r.date_heure) = CURRENT_DATE
     ORDER BY r.date_heure ASC`
  );
  return rows;
}

async function findByPatient(idPatient, filter = 'all') {
  let query =
  `SELECT r.id_rdv, r.date_heure, r.motif, r.statut,
          u.nom AS nom_medecin, u.prenom AS prenom_medecin, u.specialite
    FROM t_rendez_vous r
    JOIN t_utilisateur u ON r.id_medecin = u.id_utilisateur
    WHERE r.id_patient = $1`;

  const values = [idPatient];
  // Application dynamique de la condition temporelle et de l'ordre de tri
  if (filter === 'upcoming') {
    query += ` AND r.date_heure >= NOW() ORDER BY r.date_heure ASC`;
  } else if (filter === 'past') {
    query += ` AND r.date_heure < NOW() ORDER BY r.date_heure DESC`;
  } else {
    // 'all' ou non spécifié : tri chronologique inversé par défaut
    query += ` ORDER BY r.date_heure DESC`;
  }

  const { rows } = await pool.query(query, values);
  return rows;
}

async function findUpcomingForReminders(hoursAhead = 24) {
  const query = `
    SELECT 
      r.id_rdv, 
      r.date_heure, 
      r.motif,
      p.id_utilisateur AS id_patient, 
      p.nom AS nom_patient, 
      p.prenom AS prenom_patient, 
      p.email AS email_patient,
      m.nom AS nom_medecin, 
      m.specialite
    FROM t_rendez_vous r
    JOIN t_utilisateur p ON r.id_patient = p.id_utilisateur
    JOIN t_utilisateur m ON r.id_medecin = m.id_utilisateur
    WHERE r.statut = 'PLANIFIE'
      AND (r.rappel_envoye IS FALSE OR r.rappel_envoye IS NULL)
      AND r.date_heure >= NOW()
      AND r.date_heure <= NOW() + ($1 || ' hours')::INTERVAL
    ORDER BY r.date_heure ASC
  `;
  const { rows } = await pool.query(query, [hoursAhead]);
  return rows;
}

async function markReminderSent(idRdv) {
  const query = `
    UPDATE t_rendez_vous
    SET rappel_envoye = TRUE
    WHERE id_rdv = $1
    RETURNING id_rdv, rappel_envoye;
  `;
  const { rows } = await pool.query(query, [idRdv]);
  return rows[0];
}

async function searchTodayByPatient({ nom, telephone }) {
  const conditions = [];
  const values = [];

  if (nom && String(nom).trim()) {
    values.push(`%${String(nom).trim()}%`);
    conditions.push(`(u.nom ILIKE $${values.length} OR u.prenom ILIKE $${values.length})`);
  }
  if (telephone && String(telephone).trim()) {
    values.push(String(telephone).replace(/\D/g, ''));
    conditions.push(`REGEXP_REPLACE(u.telephone, '[^0-9]', '', 'g') LIKE $${values.length} || '%'`);
  }

  if (conditions.length === 0) {
    return [];
  }

  const { rows } = await pool.query(
    `SELECT r.id_rdv, r.date_heure, r.statut, r.motif,
            u.id_utilisateur AS id_patient, u.nom AS patient_nom, u.prenom AS patient_prenom
     FROM t_rendez_vous r
     JOIN t_utilisateur u ON r.id_patient = u.id_utilisateur
     WHERE r.date_heure::date = CURRENT_DATE
       AND r.statut = 'PLANIFIE'
       AND ${conditions.join(' AND ')}
     ORDER BY r.date_heure ASC`,
    values
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
  findUpcomingForReminders,
  markReminderSent,
  searchTodayByPatient,
};
