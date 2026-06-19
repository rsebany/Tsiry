const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

module.exports = router;
