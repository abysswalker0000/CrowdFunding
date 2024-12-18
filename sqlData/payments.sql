CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    amount DECIMAL NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

INSERT INTO payments (user_id, project_id, amount, payment_date) VALUES 
(3, 1, 100.00, CURRENT_TIMESTAMP),
(2, 2, 50.00, CURRENT_TIMESTAMP);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_project_id ON payments(project_id);
