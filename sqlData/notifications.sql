CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content VARCHAR(255) DEFAULT 'No content provided',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO notifications (user_id, is_read, created_at) VALUES 
(1, FALSE, CURRENT_TIMESTAMP),
(2, TRUE, CURRENT_TIMESTAMP);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
