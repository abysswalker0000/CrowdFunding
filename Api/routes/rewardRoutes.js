const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/create', authenticateToken, checkRole([2]), async (req, res) => {
  const { id: user_id } = req.user;
  const { project_id, description, amount_required } = req.body;

  try {
    const ownerCheck = await pool.query('SELECT user_id FROM projects WHERE id = $1', [project_id]);

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const projectOwnerId = ownerCheck.rows[0].user_id;

    if (projectOwnerId !== user_id) {
      return res.status(403).json({ error: 'Access denied. You are not the owner of this project.' });
    }
    const paymentCheck = await pool.query('SELECT COUNT(*) AS payment_count FROM payments WHERE project_id = $1', [project_id]);

    if (parseInt(paymentCheck.rows[0].payment_count, 10) === 0) {
      return res.status(400).json({ error: 'Cannot add rewards to a project without payments.' });
    }

    await pool.query('CALL add_reward_with_notification($1, $2, $3, $4)', [
      user_id,
      project_id,
      description,
      amount_required,
    ]);

    res.status(201).json({ message: 'Reward created and users notified.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
