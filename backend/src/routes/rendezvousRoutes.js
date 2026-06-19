const express = require('express');
const rendezvousController = require('../controllers/rendezvousController');
const medecinController = require('../controllers/medecinController');

const router = express.Router();

router.post('/rendezvous/book', rendezvousController.bookAppointment);
router.patch('/rendezvous/:id/register', rendezvousController.registerPresence);
router.get('/patients/:id/rendezvous', rendezvousController.listPatientAppointments);
router.get('/specialites', medecinController.listSpecialites);
router.get('/medecins', medecinController.listMedecins);
router.get('/patients', medecinController.listPatients);

module.exports = router;
