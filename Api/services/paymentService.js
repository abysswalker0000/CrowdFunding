const db = require('../utils/db');

exports.createPayment = async (user_id, project_id, amount) => {
  const query = 'CALL make_payment($1, $2, $3)';
  const values = [user_id, project_id, amount];
  await db.query(query, values);
};

exports.getPaymentsByProject = async (project_id) => {
  const query = 'SELECT * FROM get_project_payments($1)';
  const values = [project_id];
  const result = await db.query(query, values);
  return result.rows;
};
