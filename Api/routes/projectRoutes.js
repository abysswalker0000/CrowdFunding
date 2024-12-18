const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Создание проекта (только для Creator)
router.post('/create', authenticateToken, checkRole([2]), async (req, res) => {
  const { user_id, title, description, goal_amount, category_id } = req.body;
  try {
    await pool.query('CALL create_project($1, $2, $3, $4, $5)', [
      user_id,
      title,
      description,
      goal_amount,
      category_id,
    ]);
    res.status(201).json({ message: 'Project created successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение всех проектов по категории (только для Backer)
router.get('/category/:category_id', authenticateToken, async (req, res) => {
  const { category_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_projects_by_category($1)', [category_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновление статуса проекта (только для Creator)
router.put('/:project_id/update-status', authenticateToken, checkRole([2]), async (req, res) => {
  const { project_id } = req.params;
  const { new_status } = req.body;
  try {
    await pool.query('CALL update_project_status($1, $2)', [project_id, new_status]);
    res.status(200).json({ message: `Project status updated to ${new_status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение инвесторов проекта (только для Creator)
router.get('/:project_id/investors', authenticateToken, checkRole([2]), async (req, res) => {
  const project_id = parseInt(req.params.project_id, 10);

  try {
    const result = await pool.query('SELECT * FROM get_project_investors($1)', [project_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Финансовый отчет проекта (только для Creator)
router.get('/:project_id/financial-report', authenticateToken, checkRole([2]), async (req, res) => {
  const { project_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_project_financial_report($1)', [project_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// список Проектов
router.get('/projectlist', authenticateToken, async (req, res) => {
  const { project_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Уведомление инвесторов при достижении цели проекта (только для Creator)
router.post('/:project_id/notify-investors', authenticateToken, checkRole([2]), async (req, res) => {
  const { project_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM notify_investors_goal_reached($1)', [project_id]);
    res.status(200).json({
      message: 'Investors notified successfully.',
      notifications: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавление обновления для проекта (только для Creator)
router.post('/:project_id/updates', authenticateToken, checkRole([2]), async (req, res) => {
  const { project_id } = req.params;
  const { title, content } = req.body;
  try {
    await pool.query(
      'INSERT INTO updates (project_id, title, content, created_at) VALUES ($1, $2, $3, NOW())',
      [project_id, title, content]
    );
    res.status(201).json({ message: 'Project update added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение всех обновлений для проекта (только для Creator)
router.get('/:project_id/updates', authenticateToken, checkRole([2]), async (req, res) => {
  const { project_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM updates WHERE project_id = $1', [project_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удаление проекта (только для Creator)
router.delete('/:project_id/delete', authenticateToken, checkRole([2]), async (req, res) => {
  const { project_id } = req.params;

  try {
    await pool.query('CALL delete_project($1)', [project_id]);
    res.status(200).json({ message: `Project with ID ${project_id} and all related data deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:project_id/moderate', authenticateToken, checkRole([1]), async (req, res) => {
  const { project_id } = req.params;
  const { admin_id, status, review } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use "approved" or "rejected".' });
  }

  try {
    await pool.query('CALL moderate_project($1, $2, $3, $4)', [project_id, admin_id, status, review]);
    res.status(200).json({ message: `Project moderation completed with status: ${status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
