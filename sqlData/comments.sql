CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

INSERT INTO comments (user_id, project_id, content, created_at) VALUES 
(1, 1, 'This project looks interesting!', CURRENT_TIMESTAMP),
(2, 2, 'Great art project!', CURRENT_TIMESTAMP);

CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_project_id ON comments(project_id);
