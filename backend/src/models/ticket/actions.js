const pool = require('../../config/db');
const { findById, updateStatut } = require('./crud');

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

module.exports = { callTicket, triggerCall, closeTicket };
