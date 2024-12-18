const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.put('/mark-all-read', authenticateToken, async (req, res) => {
  const { id: user_id } = req.user;

  try {
    await pool.query('CALL mark_all_notifications_as_read_proc($1)', [user_id]);
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
