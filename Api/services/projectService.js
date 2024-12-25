const db = require('../utils/db');

exports.createProject = async (user_id, title, description, goal_amount, category_id) => {
  const query = 'CALL create_project($1, $2, $3, $4, $5)';
  await db.query(query, [user_id, title, description, goal_amount, category_id]);
};

exports.getProjectsByCategory = async (category_id) => {
  const query = 'SELECT * FROM get_projects_by_category($1)';
  const result = await db.query(query, [category_id]);
  return result.rows;
};

exports.updateProjectStatus = async (project_id, new_status) => {
  const query = 'CALL update_project_status($1, $2)';
  await db.query(query, [project_id, new_status]);
};

exports.getProjectInvestors = async (project_id) => {
  const query = 'SELECT * FROM get_project_investors($1)';
  const result = await db.query(query, [project_id]);
  return result.rows;
};

exports.getFinancialReport = async (project_id) => {
  const query = 'SELECT * FROM get_project_financial_report($1)';
  const result = await db.query(query, [project_id]);
  return result.rows;
};

exports.getAllProjects = async () => {
  const query = 'SELECT * FROM projects';
  const result = await db.query(query);
  return result.rows;
};

exports.notifyInvestors = async (project_id) => {
  const query = 'SELECT * FROM notify_investors_goal_reached($1)';
  const result = await db.query(query, [project_id]);
  return result.rows;
};

exports.addProjectUpdate = async (project_id, title, content) => {
  const query = 'INSERT INTO updates (project_id, title, content, created_at) VALUES ($1, $2, $3, NOW())';
  await db.query(query, [project_id, title, content]);
};

exports.getProjectUpdates = async (project_id) => {
  const query = 'SELECT * FROM updates WHERE project_id = $1';
  const result = await db.query(query, [project_id]);
  return result.rows;
};

exports.deleteProject = async (project_id) => {
  const query = 'CALL delete_project($1)';
  await db.query(query, [project_id]);
};

exports.moderateProject = async (project_id, admin_id, status, review) => {
  const query = 'CALL moderate_project($1, $2, $3, $4)';
  await db.query(query, [project_id, admin_id, status, review]);
};
