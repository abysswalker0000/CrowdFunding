const db = require('../utils/db');

exports.getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  const result = await db.query(query);
  return result.rows;
};

exports.getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

exports.updateUser = async (id, { name, email, password, role_id }) => {
  const query = 'UPDATE users SET name = $1, email = $2, password = $3, role_id = $4 WHERE id = $5';
  await db.query(query, [name, email, password, role_id, id]);
};

exports.deleteUser = async (id) => {
  const query = 'CALL delete_user($1)';
  await db.query(query, [id]);
};

exports.clearOldNotifications = async (user_id) => {
  const query = 'DELETE FROM notifications WHERE user_id = $1 AND created_at < NOW() - INTERVAL \'30 days\'';
  await db.query(query, [user_id]);
};

exports.getUserNotifications = async (user_id) => {
  const query = 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC';
  const result = await db.query(query, [user_id]);
  return result.rows;
};

exports.getUserLogs = async (user_id) => {
  const query = 'SELECT * FROM user_log WHERE user_id = $1 ORDER BY action_date DESC';
  const result = await db.query(query, [user_id]);
  return result.rows;
};
