const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
  const { id: user_id } = req.user;
  const { project_id, amount } = req.body;

  try {
    await paymentService.createPayment(user_id, project_id, amount);
    res.status(201).json({ message: 'Payment created successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentsByProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const payments = await paymentService.getPaymentsByProject(project_id);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
