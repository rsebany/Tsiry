//Exposition de l'API
const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

// Enregistrement de la route REST structure MVC
// :id est une variable dynamique dans l'URL
router.get('/api/patients/:id/rendezvous', rendezvousController.getPatientAppointments);

module.exports = router;