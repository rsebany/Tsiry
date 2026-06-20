const express = require('express');
const router = express.Router();
const { generateTicket } = require('../controllers/ticketController');

// Route officielle validée dans le plan d'implémentation
router.post('/generate', generateTicket);

module.exports = router;