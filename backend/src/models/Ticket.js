const pool = require('../config/db');

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
       SELECT niveau_priorite FROM t_cas_urgence
       WHERE id_patient = t.id_patient AND date_declaration::date = CURRENT_DATE
       ORDER BY date_declaration DESC LIMIT 1
     ) cu ON true
     WHERE t.id_file = $1
     ORDER BY
       CASE cu.niveau_priorite
         WHEN 'ROUGE' THEN 1 WHEN 'ORANGE' THEN 2 WHEN 'JAUNE' THEN 3 WHEN 'VERT' THEN 4
         ELSE 5
       END,
       t.numero ASC`,
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

async function callTicket(id_ticket) {
  const ticket = await findById(id_ticket);
  if (!ticket) return { error: 'not_found' };
  if (ticket.statut !== 'EN_ATTENTE') return { error: 'invalid_state', ticket };
  const updated = await updateStatut(id_ticket, 'EN_COURS');
  return { ticket: updated };
}

async function triggerCall(id_ticket, numero_box) {
  const ticket = await findById(id_ticket);
  if (!ticket) return { error: 'not_found' };
  if (ticket.statut !== 'EN_ATTENTE') return { error: 'invalid_state', ticket };
  const { rows } = await pool.query(
    `UPDATE t_ticket SET statut = 'EN_CONSULTATION', heure_appel = NOW(), numero_box = $2
     WHERE id_ticket = $1 RETURNING *`,
    [id_ticket, numero_box]
  );
  return { ticket: rows[0] };
}

async function closeTicket(id_ticket) {
  const ticket = await findById(id_ticket);
  if (!ticket) return { error: 'not_found' };
  if (ticket.statut !== 'EN_COURS' && ticket.statut !== 'APPELE' && ticket.statut !== 'EN_CONSULTATION') {
    return { error: 'invalid_state', ticket };
  }
  const updated = await updateStatut(id_ticket, 'TRAITE');
  return { ticket: updated };
}

const PRIORITY_ORDER_SQL = `
  CASE cu.niveau_priorite
    WHEN 'ROUGE' THEN 1 WHEN 'ORANGE' THEN 2 WHEN 'JAUNE' THEN 3 WHEN 'VERT' THEN 4
    ELSE 5
  END,
  t.heure_creation ASC`;

async function getActiveQueue(id_file) {
  const { rows } = await pool.query(
    `SELECT t.*, cu.niveau_priorite
     FROM t_ticket t
     LEFT JOIN LATERAL (
       SELECT niveau_priorite FROM t_cas_urgence
       WHERE id_patient = t.id_patient AND date_declaration::date = CURRENT_DATE
       ORDER BY date_declaration DESC LIMIT 1
     ) cu ON true
     WHERE t.id_file = $1 AND t.statut IN ('EN_ATTENTE', 'APPELE', 'EN_COURS', 'EN_CONSULTATION')
     ORDER BY ${PRIORITY_ORDER_SQL}`,
    [id_file]
  );
  const activeStatuses = ['EN_CONSULTATION', 'EN_COURS', 'APPELE'];
  const current = rows.find((t) => activeStatuses.includes(t.statut)) || null;
  const waiting = rows.filter((t) => t.statut === 'EN_ATTENTE');
  return { current, waiting, all: rows };
}

async function getTicketStatus(id_ticket) {
  const ticket = await findById(id_ticket);
  if (!ticket) return null;

  const queue = await getActiveQueue(ticket.id_file);
  const waitingOrdered = queue.waiting;
  const index = waitingOrdered.findIndex((t) => t.id_ticket === ticket.id_ticket);
  const personnes_avant = index >= 0 ? index : 0;
  const estimation = personnes_avant * 5;

  return {
    id_ticket: ticket.id_ticket,
    numero: ticket.numero,
    statut: ticket.statut,
    numero_box: ticket.numero_box,
    personnes_avant,
    estimation_minutes: estimation,
    message: `Votre position : N°${personnes_avant + 1}. Estimation de passage : ${estimation} min`,
  };
}

module.exports = {
  getNextNumero,
  create,
  findByFileId,
  findById,
  updateStatut,
  callTicket,
  triggerCall,
  closeTicket,
  getActiveQueue,
  getTicketStatus,
};
