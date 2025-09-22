-- Create database and employees table for TARDUS Inc
CREATE DATABASE IF NOT EXISTS tardus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tardus;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  officeLocation VARCHAR(100) NOT NULL,
  resumeFile VARCHAR(512)
);


