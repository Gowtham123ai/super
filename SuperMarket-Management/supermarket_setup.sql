CREATE DATABASE supermarket;

USE supermarket;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    barcode VARCHAR(100),
    price DOUBLE,
    gst_percent DOUBLE,
    stock INT
);

-- Insert a default admin user (password 'admin123' hashed with BCrypt)
-- INSERT INTO users (username, password, role) VALUES ('admin', '$2a$10$YourHashedPasswordHere', 'Admin');
