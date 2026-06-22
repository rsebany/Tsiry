const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

// CORRECTION : On laisse juste /:id car le préfixe /api/rendezvous est donné par server.js
// Récupération des infos d'un RDV (pour affichage avant validation)
router.get('/:id', rendezvousController.getRendezVous);

// Enregistrement de la présence (mutation de statut)
router.patch('/:id/register', rendezvousController.registerPresence);

module.exports = router;