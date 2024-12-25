const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Создание проекта (только для Creator)
router.post('/create', authenticateToken, checkRole([2]), projectController.createProject);

// Получение всех проектов по категории (только для Backer)
router.get('/category/:category_id', authenticateToken, projectController.getProjectsByCategory);

// Обновление статуса проекта (только для Creator)
router.put('/:project_id/update-status', authenticateToken, checkRole([2]), projectController.updateProjectStatus);

// Получение инвесторов проекта (только для Creator)
router.get('/:project_id/investors', authenticateToken, checkRole([2]), projectController.getProjectInvestors);

// Финансовый отчет проекта (только для Creator)
router.get('/:project_id/financial-report', authenticateToken, checkRole([2]), projectController.getFinancialReport);

// Список проектов
router.get('/projectlist', authenticateToken, projectController.getAllProjects);

// Уведомление инвесторов (только для Creator)
router.post('/:project_id/notify-investors', authenticateToken, checkRole([2]), projectController.notifyInvestors);

// Добавление обновления для проекта (только для Creator)
router.post('/:project_id/updates', authenticateToken, checkRole([2]), projectController.addProjectUpdate);

// Получение всех обновлений для проекта (только для Creator)
router.get('/:project_id/updates', authenticateToken, checkRole([2]), projectController.getProjectUpdates);

// Удаление проекта (только для Creator)
router.delete('/:project_id/delete', authenticateToken, checkRole([2]), projectController.deleteProject);

// Модерация проекта (только для администраторов)
router.put('/:project_id/moderate', authenticateToken, checkRole([1]), projectController.moderateProject);

module.exports = router;
