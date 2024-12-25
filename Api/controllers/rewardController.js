const rewardService = require('../services/rewardService');

exports.createReward = async (req, res) => {
  const { id: user_id } = req.user;
  const { project_id, description, amount_required } = req.body;

  try {
    const isOwner = await rewardService.checkProjectOwnership(project_id, user_id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You are not the owner of this project.' });
    }

    const hasPayments = await rewardService.checkProjectPayments(project_id);
    if (!hasPayments) {
      return res.status(400).json({ error: 'Cannot add rewards to a project without payments.' });
    }

    await rewardService.createReward(user_id, project_id, description, amount_required);

    res.status(201).json({ message: 'Reward created and users notified.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
