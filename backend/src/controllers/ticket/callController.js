const Ticket = require('../../models/ticket');

async function callTicketById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await Ticket.callTicket(id);

    if (result.error === 'not_found') {
      const err = new Error('Ticket non trouvé');
      err.status = 404;
      throw err;
    }
    if (result.error === 'invalid_state') {
      const err = new Error('Le ticket doit être EN_ATTENTE pour être appelé.');
      err.status = 409;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Patient appelé',
      data: result.ticket,
    });
  } catch (err) {
    next(err);
  }
}

async function closeTicketById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await Ticket.closeTicket(id);

    if (result.error === 'not_found') {
      const err = new Error('Ticket non trouvé');
      err.status = 404;
      throw err;
    }
    if (result.error === 'invalid_state') {
      const err = new Error('Le ticket doit être EN_COURS pour être clôturé.');
      err.status = 409;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Ticket clôturé',
      data: result.ticket,
    });
  } catch (err) {
    next(err);
  }
}

async function triggerCallById(req, res, next) {
  try {
    const { id } = req.params;
    const { numero_box } = req.body;

    if (!numero_box) {
      const err = new Error('numero_box requis');
      err.status = 400;
      throw err;
    }

    const result = await Ticket.triggerCall(id, String(numero_box));

    if (result.error === 'not_found') {
      const err = new Error('Ticket non trouvé');
      err.status = 404;
      throw err;
    }
    if (result.error === 'invalid_state') {
      const err = new Error('Le ticket doit être EN_ATTENTE pour être appelé en consultation.');
      err.status = 409;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: `Patient appelé — box ${numero_box}`,
      data: result.ticket,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { callTicketById, closeTicketById, triggerCallById };
