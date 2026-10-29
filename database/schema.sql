-- ============================================================================
-- MessMate — Hostel Mess and Raw Material Management System
-- File: database/schema.sql
-- Description: DDL script to create the database schema, normalized tables,
--              primary keys, foreign keys, and integrity constraints.
-- Target RDBMS: MySQL 8.0+
-- ============================================================================

-- Create and switch to the project database
CREATE DATABASE IF NOT EXISTS messmate_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE messmate_db;

-- ----------------------------------------------------------------------------
-- Drop existing tables in reverse dependency order (to prevent FK conflicts)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS meal_consumptions;
DROP TABLE IF EXISTS meal_records;
DROP TABLE IF EXISTS stock_transactions;
DROP TABLE IF EXISTS hostel_inventory;
DROP TABLE IF EXISTS raw_materials;
DROP TABLE IF EXISTS managers;
DROP TABLE IF EXISTS hostels;

-- ----------------------------------------------------------------------------
-- Table 1: hostels
-- Represents the residential hostels whose mess kitchens are managed.
-- ----------------------------------------------------------------------------
CREATE TABLE hostels (
    hostel_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_name VARCHAR(50) NOT NULL,
    student_capacity INT NOT NULL,
    contact_number VARCHAR(15) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_hostel_name UNIQUE (hostel_name),
    CONSTRAINT chk_hostel_capacity CHECK (student_capacity > 0)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2: managers
-- Mess supervisors and wardens responsible for inventory and meal logs.
-- ----------------------------------------------------------------------------
CREATE TABLE managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    hire_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_manager_email UNIQUE (email),
    CONSTRAINT uq_manager_phone UNIQUE (phone),
    CONSTRAINT fk_manager_hostel FOREIGN KEY (hostel_id)
        REFERENCES hostels(hostel_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 3: raw_materials
-- Master catalog of raw ingredients (grains, pulses, dairy, oils, vegetables).
-- ----------------------------------------------------------------------------
CREATE TABLE raw_materials (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category ENUM(
        'Grains & Cereals',
        'Pulses & Lentils',
        'Oils & Ghee',
        'Dairy',
        'Vegetables',
        'Spices & Condiments',
        'Bakery & Others'
    ) NOT NULL,
    unit_of_measure ENUM('kg', 'litres', 'packets', 'pieces') NOT NULL,
    reorder_level DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_item_name UNIQUE (item_name),
    CONSTRAINT chk_reorder_level CHECK (reorder_level >= 0)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 4: hostel_inventory
-- Real-time stock balance for each raw material in each hostel store.
-- ----------------------------------------------------------------------------
CREATE TABLE hostel_inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    item_id INT NOT NULL,
    current_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_hostel_inventory_item UNIQUE (hostel_id, item_id),
    CONSTRAINT chk_inventory_qty CHECK (current_quantity >= 0),
    CONSTRAINT fk_inv_hostel FOREIGN KEY (hostel_id)
        REFERENCES hostels(hostel_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_inv_item FOREIGN KEY (item_id)
        REFERENCES raw_materials(item_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 5: stock_transactions
-- Audit log of inward purchases (received) and manual adjustments.
-- ----------------------------------------------------------------------------
CREATE TABLE stock_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    item_id INT NOT NULL,
    transaction_type ENUM('INWARD', 'WASTAGE_ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT') NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NULL, -- Required for inward purchases to compute cost
    supplier_name VARCHAR(100) NULL,
    reference_note VARCHAR(255) NULL,
    transaction_date DATE NOT NULL,
    recorded_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_trans_qty CHECK (quantity > 0),
    CONSTRAINT chk_trans_unit_price CHECK (unit_price IS NULL OR unit_price >= 0),
    CONSTRAINT fk_trans_hostel FOREIGN KEY (hostel_id)
        REFERENCES hostels(hostel_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_trans_item FOREIGN KEY (item_id)
        REFERENCES raw_materials(item_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_trans_manager FOREIGN KEY (recorded_by)
        REFERENCES managers(manager_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 6: meal_records
-- Daily meals prepared across the hostels (Breakfast, Lunch, Snacks, Dinner).
-- ----------------------------------------------------------------------------
CREATE TABLE meal_records (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Snacks', 'Dinner') NOT NULL,
    food_prepared VARCHAR(255) NOT NULL,
    portions_served INT NOT NULL,
    managed_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uq_hostel_meal_slot UNIQUE (hostel_id, meal_date, meal_type),
    CONSTRAINT chk_portions_served CHECK (portions_served >= 0),
    CONSTRAINT fk_meal_hostel FOREIGN KEY (hostel_id)
        REFERENCES hostels(hostel_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_meal_manager FOREIGN KEY (managed_by)
        REFERENCES managers(manager_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 7: meal_consumptions
-- Raw materials consumed during the preparation of each specific meal.
-- ----------------------------------------------------------------------------
CREATE TABLE meal_consumptions (
    consumption_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_consumed DECIMAL(10, 2) NOT NULL,

    -- Constraints
    CONSTRAINT uq_meal_item_consumption UNIQUE (meal_id, item_id),
    CONSTRAINT chk_consumed_qty CHECK (quantity_consumed > 0),
    CONSTRAINT fk_consumption_meal FOREIGN KEY (meal_id)
        REFERENCES meal_records(meal_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_consumption_item FOREIGN KEY (item_id)
        REFERENCES raw_materials(item_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Helpful Indexes for frequent JOINs and filtering
-- ----------------------------------------------------------------------------
CREATE INDEX idx_trans_hostel_date ON stock_transactions(hostel_id, transaction_date);
CREATE INDEX idx_meal_hostel_date ON meal_records(hostel_id, meal_date);
CREATE INDEX idx_consumption_meal ON meal_consumptions(meal_id);
