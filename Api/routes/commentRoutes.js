const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); 


router.post(
  '/add',authenticateToken, checkRole([3]),
  async (req, res) => {
    const { project_id, content } = req.body; 
    const user_id = req.user.id; 

    try {
      await pool.query('CALL add_comment($1, $2, $3)', [user_id, project_id, content]);
      res.status(201).json({ message: 'Comment added successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM get_project_comments($1)', [project_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
