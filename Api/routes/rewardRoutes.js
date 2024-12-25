const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Создание награды с уведомлением (только для Creator)
router.post('/create', authenticateToken, checkRole([2]), rewardController.createReward);

module.exports = router;
