const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Получение всех пользователей (только администратор)
router.get('/', authenticateToken, checkRole([1]), userController.getAllUsers);

// Получение пользователя по ID (только администратор)
router.get('/:id', authenticateToken, checkRole([1]), userController.getUserById);

// Обновление пользователя (только администратор)
router.put('/:id/update', authenticateToken, checkRole([1]), userController.updateUser);

// Удаление пользователя (только администратор)
router.delete('/:id/delete', authenticateToken, checkRole([1]), userController.deleteUser);

// Очистка старых уведомлений пользователя (только администратор)
router.delete('/:user_id/clear-notifications', authenticateToken, checkRole([1]), userController.clearOldNotifications);

// Получение уведомлений (доступно всем пользователям)
router.get('/:user_id/notifications', authenticateToken, userController.getUserNotifications);

// Получение логов пользователя (только администратор)
router.get('/:user_id/logs', authenticateToken, checkRole([1]), userController.getUserLogs);

module.exports = router;
