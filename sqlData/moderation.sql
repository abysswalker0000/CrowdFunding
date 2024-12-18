CREATE TABLE moderation (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    admin_id INT NOT NULL,
    status VARCHAR(25) NOT NULL,
    review TEXT,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

INSERT INTO moderation (project_id, admin_id, status, review, review_date) VALUES 
(1, 1, 'approved', 'The project meets all requirements.', CURRENT_TIMESTAMP),
(2, 1, 'rejected', 'Not enough details provided.', CURRENT_TIMESTAMP);

CREATE INDEX idx_moderation_project_id ON moderation(project_id);
CREATE INDEX idx_moderation_admin_id ON moderation(admin_id);
