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

    if (req.user?.role === 'PATIENT') {
      const ticket = await Ticket.findById(id);
      if (ticket?.id_patient && ticket.id_patient !== req.user.id) {
        const err = new Error('Accès non autorisé à ce ticket.');
        err.status = 403;
        throw err;
      }
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

async function streamTicketStatus(req, res) {
  const { id } = req.params;

  if (req.user?.role === 'PATIENT') {
    const ticket = await Ticket.findById(id);
    if (ticket?.id_patient && ticket.id_patient !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé à ce ticket.' });
    }
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let lastPayload = null;

  const pushStatus = async () => {
    try {
      const result = await Ticket.getTicketStatus(id);
      if (!result) return;
      const payload = JSON.stringify(result);
      if (payload !== lastPayload) {
        lastPayload = payload;
        res.write(`data: ${payload}\n\n`);
      }
    } catch (err) {
      console.error('Erreur stream statut ticket :', err.message);
    }
  };

  await pushStatus();
  const interval = setInterval(pushStatus, 2000);

  req.on('close', () => {
    clearInterval(interval);
  });
}

module.exports = { getActiveQueue, getTicketStatus, streamTicketStatus };
