const express = require('express');
const urgenceController = require('../controllers/urgenceController');

const router = express.Router();

router.post('/urgences/declare', urgenceController.declarerUrgence);
router.get('/hopitaux', urgenceController.getHopitaux);

module.exports = router;
