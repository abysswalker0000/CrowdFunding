const db = require('../utils/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.checkEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows.length > 0;
};

exports.registerUser = async (name, email, password, role_id) => {
  const query = 'INSERT INTO users (name, email, password, role_id, created_at) VALUES ($1, $2, $3, $4, NOW())';
  await db.query(query, [name, email, password, role_id]);
};

exports.validateUser = async (email, password) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);

  if (result.rows.length === 0) {
    return { user: null, isValid: false };
  }

  const user = result.rows[0];
  return { user, isValid: password === user.password };
};

exports.generateToken = (id, role_id) => {
  return jwt.sign(
    { id, role_id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
