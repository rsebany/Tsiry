const express = require('express');
const ticketController = require('../controllers/ticket');

const router = express.Router();

// Routes principales (utilisées par le frontend)
router.post('/tickets/generate', ticketController.creerTicket);
router.get('/file-attente', ticketController.getFileAttente);
router.patch('/tickets/:id/call', ticketController.callTicketById);
router.patch('/tickets/:id/trigger-call', ticketController.triggerCallById);
router.patch('/tickets/:id/close', ticketController.closeTicketById);
router.get('/queue/active', ticketController.getActiveQueue);
router.get('/patients/present', ticketController.getPatientsPresent);
router.get('/tickets/:id/status', ticketController.getTicketStatus);

// Legacy — compatibilité API (non utilisées par l'UI après alignement FE/BE)
router.post('/tickets', ticketController.creerTicket);
router.put('/tickets/appeler', ticketController.appelerProchainTicket);
router.put('/tickets/:id/terminer', ticketController.terminerTicket);

module.exports = router;
