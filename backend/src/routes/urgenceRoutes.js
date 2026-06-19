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
router.get('/hopitaux', urgenceController.getHopitaux);

module.exports = router;
