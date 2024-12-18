CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, role_id, created_at) VALUES 
('Danik', 'vaper@gmail.com', 1, CURRENT_TIMESTAMP),
('Ivan', 'triceps@gmail.com', 2, CURRENT_TIMESTAMP),
('Slava', 'casplaer@gmail.com', 3, CURRENT_TIMESTAMP);

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_email ON users(email);
