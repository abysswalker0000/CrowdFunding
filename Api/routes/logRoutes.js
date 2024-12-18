const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); 

router.post('/log-action', authenticateToken, checkRole([1]), 
  async (req, res) => {
    const { user_id, action } = req.body;

    try {
      await pool.query('CALL log_user_action($1, $2)', [user_id, action]);
      res.status(201).json({ message: 'User action logged successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
