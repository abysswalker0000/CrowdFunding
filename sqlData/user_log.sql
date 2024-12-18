CREATE TABLE user_log (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    action_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO user_log (user_id, action, action_date) VALUES 
(1, 'Logged in', CURRENT_TIMESTAMP),
(2, 'Created project', CURRENT_TIMESTAMP);

CREATE INDEX idx_user_log_user_id ON user_log(user_id);
CREATE INDEX idx_user_log_action_date ON user_log(action_date);
