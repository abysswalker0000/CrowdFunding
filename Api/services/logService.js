const db = require('../utils/db');

exports.logUserAction = async (user_id, action) => {
  const query = 'CALL log_user_action($1, $2)';
  const values = [user_id, action];
  await db.query(query, values);
};
