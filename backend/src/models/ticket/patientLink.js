const pool = require('../../config/db');

async function associatePatientIfNull(id_ticket, id_patient) {
  await pool.query(
    `UPDATE t_ticket 
     SET id_patient = $1 
     WHERE id_ticket = $2 AND (id_patient IS NULL OR id_patient = $1)`,
    [id_patient, id_ticket]
  );
}

async function findActiveTicketByPatient(id_patient) {
  const { rows } = await pool.query(
    `SELECT id_ticket, id_file, numero FROM t_ticket 
     WHERE id_patient = $1 
       AND statut IN ('EN_ATTENTE', 'EN_CONSULTATION')
       AND heure_creation::date = CURRENT_DATE
     ORDER BY heure_creation DESC
     LIMIT 1`,
    [id_patient]
  );
  return rows[0] || null;
}

async function calculateQueuePosition(id_file, id_ticket) {
  const { rows } = await pool.query(
    `WITH file_ordonnee AS (
       SELECT 
         t.id_ticket,
         ROW_NUMBER() OVER (
           ORDER BY COALESCE(c.score_gravite, 1) DESC, t.heure_creation ASC
         ) AS rang
       FROM t_ticket t
       LEFT JOIN LATERAL (
         SELECT score_gravite 
         FROM t_cas_urgence cu 
         WHERE cu.id_patient = t.id_patient 
           AND cu.date_declaration::date = CURRENT_DATE
         ORDER BY cu.date_declaration DESC 
         LIMIT 1
       ) c ON TRUE
       WHERE t.id_file = $1 
         AND t.statut = 'EN_ATTENTE'
         AND t.heure_creation::date = CURRENT_DATE
     )
     SELECT rang FROM file_ordonnee WHERE id_ticket = $2`,
    [id_file, id_ticket]
  );

  return rows[0] ? parseInt(rows[0].rang, 10) : null;
}

module.exports = {
  associatePatientIfNull,
  findActiveTicketByPatient,
  calculateQueuePosition,
};
