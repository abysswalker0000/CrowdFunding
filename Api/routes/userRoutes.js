const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Получение всех пользователей (только администратор)
router.get('/', authenticateToken, checkRole([1]), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение пользователя по ID (только администратор)
router.get('/:id', authenticateToken, checkRole([1]), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновление пользователя (только администратор)
router.put('/:id/update', authenticateToken, checkRole([1]), async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role_id } = req.body;

  try {
    await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, role_id = $4 WHERE id = $5',
      [name, email, password, role_id, id]
    );

    res.status(200).json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удаление пользователя (только администратор)
router.delete('/:id/delete', authenticateToken, checkRole([1]), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('CALL delete_user($1)', [id]);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Очистка старых уведомлений пользователя (только администратор)
router.delete('/:user_id/clear-notifications', authenticateToken, checkRole([1]), async (req, res) => {
  const { user_id } = req.params;

  try {
    await pool.query(
      'DELETE FROM notifications WHERE user_id = $1 AND created_at < NOW() - INTERVAL \'30 days\'',
      [user_id]
    );

    res.status(200).json({ message: 'Old notifications cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение уведомлений (доступно всем пользователям)
router.get('/:user_id/notifications', authenticateToken, async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.status(200).json({ notifications: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение логов пользователя (только администратор)
router.get('/:user_id/logs', authenticateToken, checkRole([1]), async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM user_log WHERE user_id = $1 ORDER BY action_date DESC', [user_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
