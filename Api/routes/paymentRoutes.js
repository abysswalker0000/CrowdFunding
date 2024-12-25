const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/create', authenticateToken, paymentController.createPayment);

router.get('/:project_id', authenticateToken, checkRole([3]), paymentController.getPaymentsByProject);

module.exports = router;
