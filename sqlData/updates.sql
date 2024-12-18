CREATE TABLE updates (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

INSERT INTO updates (project_id, title, content, created_at) VALUES 
(1, 'First Update', 'We have started working on the AI project!', CURRENT_TIMESTAMP),
(2, 'Art Show', 'We are hosting an art show this weekend.', CURRENT_TIMESTAMP);

CREATE INDEX idx_updates_project_id ON updates(project_id);
