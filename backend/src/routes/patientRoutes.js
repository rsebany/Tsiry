//Exposition de l'API
const express = require('express');
// lil vas regrouper uniquement les routes liees aux rendez-vous
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

// Enregistrement de la route REST structure MVC
// :id est une variable dynamique dans l'URL
//get car le patient veux consulter les rendezvous
router.get('/api/patients/:id/rendezvous', rendezvousController.getPatientAppointments);

module.exports = router;