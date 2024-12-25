const logService = require('../services/logService');

exports.logUserAction = async (req, res) => {
  const { user_id, action } = req.body;

  try {
    await logService.logUserAction(user_id, action);
    res.status(201).json({ message: 'User action logged successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
