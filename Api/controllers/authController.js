const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { name, email, password, role_id } = req.body;

  try {
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ error: 'All fields are required (name, email, password, role_id).' });
    }

    const emailCheck = await authService.checkEmail(email);
    if (emailCheck) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    await authService.registerUser(name, email, password, role_id);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, isValid } = await authService.validateUser(email, password);
    if (!user || !isValid) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = authService.generateToken(user.id, user.role_id);
    res.status(200).json({ message: 'Login successful.', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.protected = (req, res) => {
  res.status(200).json({ message: 'You have access to the protected route.', user: req.user });
};
