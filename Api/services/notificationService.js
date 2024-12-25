const db = require('../utils/db');

exports.markAllAsRead = async(user_id) =>{
    const query ='CALL mark_all_notifications_as_read_proc($1)';
    const values = [user_id];
    await db.query(query, values);
};