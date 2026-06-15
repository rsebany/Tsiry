const express = require('express');
const router = express.Router();
const { getTicketStatus } = require('../controllers/ticketController');

router.get('/tickets/:id/status', getTicketStatus);

module.exports = router;
