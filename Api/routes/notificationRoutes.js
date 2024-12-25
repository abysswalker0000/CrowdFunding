const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/authMiddleware');

router.put('/mark-all-read', authenticateToken, notificationController.markAllAsRead);

module.exports = router;
