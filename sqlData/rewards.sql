CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount_required DECIMAL NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO rewards (project_id, user_id, description, amount_required) VALUES 
(1, 1, 'AI course materials', 100.00),
(2, 2, 'Art supplies', 50.00);

CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_rewards_project_id ON rewards(project_id);
