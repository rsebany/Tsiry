const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');
const admin = require('../controllers/adminController');

const router = express.Router();

const adminOnly = [authMiddleware, authorizeRole('ADMIN')];

// Stats
router.get('/admin/stats', ...adminOnly, admin.getStats);

// Users
router.get('/admin/users', ...adminOnly, admin.listUsers);
router.get('/admin/users/:id', ...adminOnly, admin.getUser);
router.post('/admin/users', ...adminOnly, admin.createUser);
router.put('/admin/users/:id', ...adminOnly, admin.updateUser);
router.delete('/admin/users/:id', ...adminOnly, admin.deleteUser);

// Hospitals
router.get('/admin/hospitals', ...adminOnly, admin.listHospitals);
router.post('/admin/hospitals', ...adminOnly, admin.createHospital);
router.put('/admin/hospitals/:id', ...adminOnly, admin.updateHospital);
router.delete('/admin/hospitals/:id', ...adminOnly, admin.deleteHospital);

// Logs
router.get('/admin/logs', ...adminOnly, admin.listLogs);

module.exports = router;
