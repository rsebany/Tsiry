const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

// Récupération des infos d'un RDV (pour affichage avant validation)
router.get('/api/rendezvous/:id', rendezvousController.getRendezVous);

// Enregistrement de la présence (mutation de statut)
router.patch('/api/rendezvous/:id/register', rendezvousController.registerPresence);

module.exports = router;