const pool = require('../config/db');

async function getNextNumero(id_file) {
  const { rows } = await pool.query(
    `SELECT COALESCE(MAX(numero), 0) + 1 AS prochain_numero
     FROM t_ticket WHERE id_file = $1`,
    [id_file]
  );
  return parseInt(rows[0].prochain_numero, 10);
}

async function create(id_file, patientNom = null, patientPrenom = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const prochainNumero = await getNextNumero(id_file);
    const { rows } = await client.query(
      `INSERT INTO t_ticket (numero, id_file, statut, heure_creation, patient_nom, patient_prenom)
       VALUES ($1, $2, 'EN_ATTENTE', NOW(), $3, $4)
       RETURNING id_ticket, numero, statut, heure_creation, patient_nom, patient_prenom, id_file`,
      [prochainNumero, id_file, patientNom || null, patientPrenom || null]
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
    `SELECT * FROM t_ticket WHERE id_file = $1 ORDER BY numero ASC`,
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
  if (statut === 'APPELE' || statut === 'EN_COURS') {
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

async function closeTicket(id_ticket) {
  const ticket = await findById(id_ticket);
  if (!ticket) return { error: 'not_found' };
  if (ticket.statut !== 'EN_COURS' && ticket.statut !== 'APPELE') {
    return { error: 'invalid_state', ticket };
  }
  const updated = await updateStatut(id_ticket, 'TRAITE');
  return { ticket: updated };
}

async function getActiveQueue(id_file) {
  const { rows } = await pool.query(
    `SELECT * FROM t_ticket
     WHERE id_file = $1 AND statut IN ('EN_ATTENTE', 'APPELE', 'EN_COURS')
     ORDER BY heure_creation ASC`,
    [id_file]
  );
  const current = rows.find((t) => t.statut === 'APPELE' || t.statut === 'EN_COURS') || null;
  const waiting = rows.filter((t) => t.statut === 'EN_ATTENTE');
  return { current, waiting, all: rows };
}

async function getTicketStatus(id_ticket) {
  const ticket = await findById(id_ticket);
  if (!ticket) return null;

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS personnes_avant FROM t_ticket
     WHERE id_file = $1 AND statut = 'EN_ATTENTE' AND heure_creation < $2`,
    [ticket.id_file, ticket.heure_creation]
  );

  const personnes_avant = parseInt(rows[0].personnes_avant, 10);
  const estimation = personnes_avant * 5;

  return {
    id_ticket: ticket.id_ticket,
    numero: ticket.numero,
    statut: ticket.statut,
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
  closeTicket,
  getActiveQueue,
  getTicketStatus,
};
