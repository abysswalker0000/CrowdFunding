const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Добавление комментария
router.post('/add', authenticateToken, checkRole([3]), commentController.addComment);

// Получение комментариев проекта
router.get('/:project_id', commentController.getCommentsByProject);

module.exports = router;
