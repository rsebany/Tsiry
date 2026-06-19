const FileAttente = require('../models/FileAttente');
const Ticket = require('../models/Ticket');
const RendezVous = require('../models/RendezVous');

async function creerTicket(req, res, next) {
  try {
    const { patient_nom, patient_prenom, id_patient } = req.body;
    const fileActive = await FileAttente.getOrCreateTodayFile();
    const nouveauTicket = await Ticket.create(
      fileActive.id_file,
      patient_nom,
      patient_prenom,
      id_patient ? parseInt(id_patient, 10) : null
    );
    res.status(201).json({
      success: true,
      message: 'Ticket créé avec succès',
      data: nouveauTicket,
    });
  } catch (err) {
    next(err);
  }
}

async function getFileAttente(req, res, next) {
  try {
    const fileActive = await FileAttente.getOrCreateTodayFile();
    const tickets = await Ticket.findByFileId(fileActive.id_file);
    res.status(200).json({
      success: true,
      data: {
        file_attente: fileActive,
        tickets,
        total_en_attente: tickets.filter((t) => t.statut === 'EN_ATTENTE').length,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function appelerProchainTicket(req, res, next) {
  try {
    const fileActive = await FileAttente.getOrCreateTodayFile();
    const tickets = await Ticket.findByFileId(fileActive.id_file);
    const prochainTicket = tickets.find((t) => t.statut === 'EN_ATTENTE');

    if (!prochainTicket) {
      const err = new Error('Aucun ticket en attente');
      err.status = 404;
      throw err;
    }

    const ticketAppele = await Ticket.updateStatut(prochainTicket.id_ticket, 'APPELE');
    res.status(200).json({
      success: true,
      message: 'Patient appelé',
      data: ticketAppele,
    });
  } catch (err) {
    next(err);
  }
}

async function terminerTicket(req, res, next) {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.status = 404;
      throw err;
    }

    const ticketTermine = await Ticket.updateStatut(id, 'CLOTURE');
    res.status(200).json({
      success: true,
      message: 'Ticket terminé',
      data: ticketTermine,
    });
  } catch (err) {
    next(err);
  }
}

async function getPatientsPresent(req, res, next) {
  try {
    const data = await RendezVous.findPresentToday();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getTicketStatus(req, res, next) {
  try {
    const { id } = req.params;
    const result = await Ticket.getTicketStatus(id);

    if (!result) {
      const err = new Error('Ticket introuvable');
      err.status = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: result,
      message: 'Statut récupéré avec succès',
    });
  } catch (err) {
    next(err);
  }
}

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

async function getActiveQueue(req, res, next) {
  try {
    const fileActive = await FileAttente.getOrCreateTodayFile();
    const queue = await Ticket.getActiveQueue(fileActive.id_file);
    res.status(200).json({
      success: true,
      data: {
        file_attente: fileActive,
        current: queue.current,
        waiting: queue.waiting,
        all: queue.all,
      },
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

module.exports = {
  creerTicket,
  getFileAttente,
  appelerProchainTicket,
  terminerTicket,
  getPatientsPresent,
  getTicketStatus,
  callTicketById,
  closeTicketById,
  getActiveQueue,
  triggerCallById,
};
