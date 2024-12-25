const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role_id } = req.body;

  try {
    await userService.updateUser(id, { name, email, password, role_id });
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearOldNotifications = async (req, res) => {
  const { user_id } = req.params;

  try {
    await userService.clearOldNotifications(user_id);
    res.status(200).json({ message: 'Old notifications cleared successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  const { user_id } = req.params;

  try {
    const notifications = await userService.getUserNotifications(user_id);
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserLogs = async (req, res) => {
  const { user_id } = req.params;

  try {
    const logs = await userService.getUserLogs(user_id);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
