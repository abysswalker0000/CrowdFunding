CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    goal_amount DECIMAL NOT NULL,
    status VARCHAR(50) NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO projects (user_id, title, description, goal_amount, status, category_id, created_at) VALUES 
(1, 'AI Project', 'A project about AI development.', 10000.00, 'pending', 1, CURRENT_TIMESTAMP),
(2, 'Art Project', 'A project about modern art.', 5000.00, 'approved', 2, CURRENT_TIMESTAMP);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_status ON projects(status);

SELECT * FROM projects
ORDER BY created_at DESC;

SELECT * FROM projects
WHERE status = 'approved';
