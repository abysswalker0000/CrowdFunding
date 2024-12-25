const projectService = require('../services/projectService');

exports.createProject = async (req, res) => {
  const { user_id, title, description, goal_amount, category_id } = req.body;
  try {
    await projectService.createProject(user_id, title, description, goal_amount, category_id);
    res.status(201).json({ message: 'Project created successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectsByCategory = async (req, res) => {
  const { category_id } = req.params;
  try {
    const projects = await projectService.getProjectsByCategory(category_id);
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  const { project_id } = req.params;
  const { new_status } = req.body;
  try {
    await projectService.updateProjectStatus(project_id, new_status);
    res.status(200).json({ message: `Project status updated to ${new_status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectInvestors = async (req, res) => {
  const { project_id } = req.params;
  try {
    const investors = await projectService.getProjectInvestors(project_id);
    res.status(200).json(investors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFinancialReport = async (req, res) => {
  const { project_id } = req.params;
  try {
    const report = await projectService.getFinancialReport(project_id);
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.notifyInvestors = async (req, res) => {
  const { project_id } = req.params;
  try {
    const notifications = await projectService.notifyInvestors(project_id);
    res.status(200).json({
      message: 'Investors notified successfully.',
      notifications,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProjectUpdate = async (req, res) => {
  const { project_id } = req.params;
  const { title, content } = req.body;
  try {
    await projectService.addProjectUpdate(project_id, title, content);
    res.status(201).json({ message: 'Project update added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectUpdates = async (req, res) => {
  const { project_id } = req.params;
  try {
    const updates = await projectService.getProjectUpdates(project_id);
    res.status(200).json(updates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { project_id } = req.params;
  try {
    await projectService.deleteProject(project_id);
    res.status(200).json({ message: `Project with ID ${project_id} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.moderateProject = async (req, res) => {
  const { project_id } = req.params;
  const { admin_id, status, review } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use "approved" or "rejected".' });
  }

  try {
    await projectService.moderateProject(project_id, admin_id, status, review);
    res.status(200).json({ message: `Project moderation completed with status: ${status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
