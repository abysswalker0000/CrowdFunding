function checkRole(requiredRoles) {
    return (req, res, next) => {
      const user = req.user; 
  
      if (!user) {
        return res.status(403).json({ error: 'User not authenticated.' });
      }
  
      if (!requiredRoles.includes(user.role_id)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
  
      next(); 
    };
  }
  
  module.exports = checkRole;
  