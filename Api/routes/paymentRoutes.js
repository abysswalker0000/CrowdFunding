const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/create', authenticateToken, async (req, res) => {
  const { id: user_id } = req.user;
  const { project_id, amount } = req.body;

  try {
    await pool.query('CALL make_payment($1, $2, $3)', [user_id,  project_id, amount]);
    res.status(201).json({ message: 'Payment created successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:project_id', authenticateToken, checkRole([3]), async (req, res) => {
  const { project_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM get_project_payments($1)', [project_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
