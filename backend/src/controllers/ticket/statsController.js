const FileAttente = require('../../models/FileAttente');
const Ticket = require('../../models/ticket');

async function getFileAttenteStats(req, res, next) {
  try {
    const fileActive = await FileAttente.getOrCreateTodayFile();
    const stats = await Ticket.getDailyStats(fileActive.id_file);
    res.status(200).json({
      success: true,
      data: { file_attente: fileActive, ...stats },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFileAttenteStats };
