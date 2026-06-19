const FileAttente = require('../../models/FileAttente');
const Ticket = require('../../models/ticket');

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

module.exports = { getActiveQueue, getTicketStatus };
