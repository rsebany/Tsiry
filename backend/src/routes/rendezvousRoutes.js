const express = require('express');
const rendezvousController = require('../controllers/rendezvousController');
const { registerPresence } = require('../controllers/rendezvous/registerPresence');
const medecinController = require('../controllers/medecinController');
const { authMiddleware } = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

router.post(
  '/rendezvous/book',
  authMiddleware,
  authorizeRole('PATIENT'),
  rendezvousController.bookAppointment
);

router.patch('/rendezvous/:id/register', registerPresence);

router.get(
  '/patients/:id/rendezvous',
  authMiddleware,
  authorizeRole('PATIENT', 'AGENT', 'MEDECIN'),
  rendezvousController.listPatientAppointments
);

router.get(
  '/patients/:id/rendezvous/export',
  authMiddleware,
  authorizeRole('PATIENT', 'AGENT', 'MEDECIN'),
  rendezvousController.exportPatientAppointmentsPDF
);

router.get(
  '/specialites',
  authMiddleware,
  authorizeRole('PATIENT', 'AGENT', 'MEDECIN'),
  medecinController.listSpecialites
);

router.get(
  '/medecins',
  authMiddleware,
  authorizeRole('PATIENT', 'AGENT', 'MEDECIN'),
  medecinController.listMedecins
);

router.get(
  '/patients',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'),
  medecinController.listPatients
);

router.post(
  '/rendezvous/reminders',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'), // Accessible aux agents/médecins (ou via un jeton système)
  rendezvousController.sendAppointmentReminders
);

module.exports = router;
