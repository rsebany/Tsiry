const express = require('express');
const urgenceController = require('../controllers/urgenceController');
const { authMiddleware } = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

router.post(
  '/urgences/declare',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'),
  urgenceController.declarerUrgence
);

// Tableau de bord de triage (Statistiques & File ROUGE en priorité)
router.get(
  '/urgences/triage-dashboard',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'),
  urgenceController.getTriageDashboard
);

router.get(
  '/urgences/patient/:id',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'),
  urgenceController.getDernierCasPatient
);

// Historique complet d'un patient
router.get(
  '/urgences/patient/:id/historique',
  authMiddleware,
  authorizeRole('AGENT', 'MEDECIN'),
  urgenceController.getHistoriquePatient
);

router.get('/hopitaux', urgenceController.getHopitaux);

module.exports = router;
