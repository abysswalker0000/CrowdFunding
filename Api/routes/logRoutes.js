const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Логирование действий пользователя
router.post('/log-action', authenticateToken, checkRole([1]), logController.logUserAction);

module.exports = router;
