const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.post('/tickets/generate', ticketController.creerTicket);
router.post('/tickets', ticketController.creerTicket);
router.get('/file-attente', ticketController.getFileAttente);
router.put('/tickets/appeler', ticketController.appelerProchainTicket);
router.put('/tickets/:id/terminer', ticketController.terminerTicket);
router.patch('/tickets/:id/call', ticketController.callTicketById);
router.patch('/tickets/:id/close', ticketController.closeTicketById);
router.get('/queue/active', ticketController.getActiveQueue);
router.get('/patients/present', ticketController.getPatientsPresent);
router.get('/tickets/:id/status', ticketController.getTicketStatus);

module.exports = router;
