const db = require('../utils/db');

exports.checkProjectOwnership = async (project_id, user_id) => {
  const query = 'SELECT user_id FROM projects WHERE id = $1';
  const result = await db.query(query, [project_id]);

  if (result.rows.length === 0) {
    throw new Error('Project not found.');
  }

  return result.rows[0].user_id === user_id;
};

exports.checkProjectPayments = async (project_id) => {
  const query = 'SELECT COUNT(*) AS payment_count FROM payments WHERE project_id = $1';
  const result = await db.query(query, [project_id]);

  return parseInt(result.rows[0].payment_count, 10) > 0;
};

exports.createReward = async (user_id, project_id, description, amount_required) => {
  const query = 'CALL add_reward_with_notification($1, $2, $3, $4)';
  const values = [user_id, project_id, description, amount_required];
  await db.query(query, values);
};
