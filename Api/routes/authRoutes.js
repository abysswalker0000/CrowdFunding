const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');
require('dotenv').config();


router.post('/register', async (req, res) => {
  const { name, email, password, role_id } = req.body; 

  try {

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ error: 'All fields are required (name, email, password, role_id).' });
    }

    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    await pool.query(
      'INSERT INTO users (name, email, password, role_id, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [name, email, password, role_id]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

   
    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ message: 'Login successful.', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Пример защищённого маршрута
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'You have access to the protected route.', user: req.user });
});

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Добавляем расшифрованные данные пользователя в запрос
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = router;
