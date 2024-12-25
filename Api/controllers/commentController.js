const commentService = require('../services/commentService');

exports.addComment = async (req, res) => {
  const { project_id, content } = req.body;
  const user_id = req.user.id;

  try {
    await commentService.addComment(user_id, project_id, content);
    res.status(201).json({ message: 'Comment added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const comments = await commentService.getCommentsByProject(project_id);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
