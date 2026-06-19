const express = require('express');
const ticketController = require('../controllers/ticket');
const { authMiddleware, optionalAuth } = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

router.post(
  '/tickets/generate',
  authMiddleware,
  authorizeRole('AGENT'),
  ticketController.creerTicket
);
router.get(
  '/file-attente',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'),
  ticketController.getFileAttente
);
router.patch(
  '/tickets/:id/call',
  authMiddleware,
  authorizeRole('AGENT'),
  ticketController.callTicketById
);
router.patch(
  '/tickets/:id/trigger-call',
  authMiddleware,
  authorizeRole('MEDECIN'),
  ticketController.triggerCallById
);
router.patch(
  '/tickets/:id/close',
  authMiddleware,
  authorizeRole('AGENT'),
  ticketController.closeTicketById
);
router.get('/queue/active', optionalAuth, ticketController.getActiveQueue);
router.get(
  '/patients/present',
  authMiddleware,
  authorizeRole('AGENT'),
  ticketController.getPatientsPresent
);
router.get(
  '/tickets/:id/status',
  authMiddleware,
  authorizeRole('PATIENT', 'AGENT', 'MEDECIN'),
  ticketController.getTicketStatus
);

// Legacy — compatibilité API
router.post('/tickets', authMiddleware, authorizeRole('AGENT'), ticketController.creerTicket);
router.put(
  '/tickets/appeler',
  authMiddleware,
  authorizeRole('AGENT'),
  ticketController.appelerProchainTicket
);
router.put(
  '/tickets/:id/terminer',
  authMiddleware,
  authorizeRole('AGENT'),
  ticketController.terminerTicket
);

module.exports = router;
