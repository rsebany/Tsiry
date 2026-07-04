const pool = require('../../config/db');
const { findById } = require('./crud');

const PRIORITY_ORDER_SQL = `COALESCE(cu.score_gravite, 0) DESC, t.heure_creation ASC`;

async function getActiveQueue(id_file) {
  const { rows } = await pool.query(
    `SELECT t.*, cu.niveau_priorite, cu.score_gravite
     FROM t_ticket t
     LEFT JOIN LATERAL (
       SELECT niveau_priorite, score_gravite FROM t_cas_urgence
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

  const ticketWithPriority = queue.all.find((t) => t.id_ticket === ticket.id_ticket);
  const niveau_priorite = ticketWithPriority?.niveau_priorite || null;

  return {
    id_ticket: ticket.id_ticket,
    numero: ticket.numero,
    statut: ticket.statut,
    numero_box: ticket.numero_box,
    niveau_priorite,
    personnes_avant,
    estimation_minutes: estimation,
    message: `Votre position : N°${personnes_avant + 1}. Estimation de passage : ${estimation} min`,
  };
}

module.exports = { getActiveQueue, getTicketStatus };
