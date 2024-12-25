const db = require('../utils/db');

exports.addComment = async (user_id, project_id, content) => {
  const query = 'CALL add_comment($1, $2, $3)';
  const values = [user_id, project_id, content];
  await db.query(query, values);
};

exports.getCommentsByProject = async (project_id) => {
  const query = 'SELECT * FROM get_project_comments($1)';
  const values = [project_id];
  const result = await db.query(query, values);
  return result.rows;
};
