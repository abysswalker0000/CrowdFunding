const notificationService = require('../services/notificationService');

exports.markAllAsRead= async(req,res) =>{
    const{id:user_id} =req.user;
    try {
        await notificationService.markAllAsRead(user_id);
        res.status(200).json({ message: 'All notifications marked as read.' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};