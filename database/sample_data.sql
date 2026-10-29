-- ============================================================================
-- MessMate — Hostel Mess and Raw Material Management System
-- File: database/sample_data.sql
-- Description: Realistic seed data for the 4 hostels, managers, raw materials,
--              initial stock balances, purchase transactions, and meal records.
-- Target RDBMS: MySQL 8.0+
-- ============================================================================

USE messmate_db;

-- Clear previous sample data to avoid duplicate key errors on multiple runs
DELETE FROM meal_consumptions;
DELETE FROM meal_records;
DELETE FROM stock_transactions;
DELETE FROM hostel_inventory;
DELETE FROM raw_materials;
DELETE FROM managers;
DELETE FROM hostels;

-- Reset AUTO_INCREMENT counters
ALTER TABLE hostels AUTO_INCREMENT = 1;
ALTER TABLE managers AUTO_INCREMENT = 1;
ALTER TABLE raw_materials AUTO_INCREMENT = 1;
ALTER TABLE hostel_inventory AUTO_INCREMENT = 1;
ALTER TABLE stock_transactions AUTO_INCREMENT = 1;
ALTER TABLE meal_records AUTO_INCREMENT = 1;
ALTER TABLE meal_consumptions AUTO_INCREMENT = 1;

-- ----------------------------------------------------------------------------
-- 1. Insert Hostels
-- ----------------------------------------------------------------------------
INSERT INTO hostels (hostel_name, student_capacity, contact_number) VALUES
('Nek Chand 1', 450, '+91-9876543210'),
('Nek Chand 2', 500, '+91-9876543211'),
('Zakir 1',       400, '+91-9876543212'),
('Zakir 2',       350, '+91-9876543213');

-- ----------------------------------------------------------------------------
-- 2. Insert Mess Managers
-- ----------------------------------------------------------------------------
INSERT INTO managers (hostel_id, full_name, email, phone, hire_date, is_active) VALUES
(1, 'Rajesh Sharma', 'rajesh.nc1@messmate.edu', '+91-9811100001', '2023-01-15', TRUE),
(2, 'Anita Verma',   'anita.nc2@messmate.edu',  '+91-9811100002', '2023-03-20', TRUE),
(3, 'Sunil Kumar',   'sunil.z1@messmate.edu',   '+91-9811100003', '2022-08-10', TRUE),
(4, 'Preeti Singh',  'preeti.z2@messmate.edu',  '+91-9811100004', '2024-02-01', TRUE);

-- ----------------------------------------------------------------------------
-- 3. Insert Raw Materials Master Catalog
-- ----------------------------------------------------------------------------
INSERT INTO raw_materials (item_name, category, unit_of_measure, reorder_level) VALUES
-- Grains & Cereals
('Basmati Rice',            'Grains & Cereals',    'kg',      50.00),
('Sharbati Wheat Flour',    'Grains & Cereals',    'kg',      75.00),
('Poha (Flattened Rice)',   'Grains & Cereals',    'kg',      20.00),

-- Pulses & Lentils
('Arhar / Toor Dal',        'Pulses & Lentils',    'kg',      30.00),
('Chana Dal',               'Pulses & Lentils',    'kg',      25.00),
('Rajma (Red Kidney Beans)','Pulses & Lentils',    'kg',      20.00),
('Moong Dal (Washed)',      'Pulses & Lentils',    'kg',      25.00),

-- Oils & Ghee
('Mustard Oil',             'Oils & Ghee',         'litres',  25.00),
('Refined Sunflower Oil',   'Oils & Ghee',         'litres',  30.00),
('Desi Ghee',               'Oils & Ghee',         'litres',  10.00),

-- Dairy
('Fresh Cow Milk',          'Dairy',               'litres',  50.00),
('Fresh Paneer',            'Dairy',               'kg',      15.00),
('Plain Curd (Dahi)',       'Dairy',               'kg',      20.00),

-- Vegetables
('Potatoes (Aloo)',         'Vegetables',          'kg',      60.00),
('Onions (Pyaz)',           'Vegetables',          'kg',      50.00),
('Tomatoes (Tamatar)',      'Vegetables',          'kg',      30.00),
('Green Chillies',          'Vegetables',          'kg',       5.00),

-- Spices & Condiments
('Turmeric Powder (Haldi)', 'Spices & Condiments', 'kg',       5.00),
('Red Chilli Powder',       'Spices & Condiments', 'kg',       5.00),
('Garam Masala',            'Spices & Condiments', 'kg',       3.00),
('Iodized Table Salt',      'Spices & Condiments', 'kg',      25.00),

-- Bakery & Others
('Tea Leaves',              'Bakery & Others',     'kg',      10.00),
('Refined Sugar',           'Bakery & Others',     'kg',      35.00);

-- ----------------------------------------------------------------------------
-- 4. Insert Initial Inventory for all 4 Hostels
-- (Note: A few items have quantities <= reorder_level to test low-stock alerts)
-- ----------------------------------------------------------------------------
INSERT INTO hostel_inventory (hostel_id, item_id, current_quantity) VALUES
-- Nek Chand 1 (hostel_id = 1)
(1, 1,  180.00), -- Basmati Rice
(1, 2,  240.00), -- Wheat Flour
(1, 3,   45.00), -- Poha
(1, 4,   85.00), -- Toor Dal
(1, 5,   60.00), -- Chana Dal
(1, 6,   55.00), -- Rajma
(1, 7,   70.00), -- Moong Dal
(1, 8,   40.00), -- Mustard Oil
(1, 9,   50.00), -- Sunflower Oil
(1, 10,  18.00), -- Desi Ghee
(1, 11,  65.00), -- Fresh Milk
(1, 12,  22.00), -- Paneer
(1, 13,  35.00), -- Curd
(1, 14, 150.00), -- Potatoes
(1, 15, 120.00), -- Onions
(1, 16,  80.00), -- Tomatoes
(1, 17,  12.00), -- Green Chillies
(1, 18,  14.00), -- Haldi
(1, 19,  11.00), -- Red Chilli
(1, 20,   6.50), -- Garam Masala
(1, 21,  60.00), -- Salt
(1, 22,  25.00), -- Tea Leaves
(1, 23,  90.00), -- Sugar

-- Nek Chand 2 (hostel_id = 2)
(2, 1,  210.00),
(2, 2,  280.00),
(2, 3,   50.00),
(2, 4,   95.00),
(2, 5,   70.00),
(2, 6,   65.00),
(2, 7,   80.00),
(2, 8,   18.00), -- *LOW STOCK ALERT* (Current 18.00 <= Reorder 25.00)
(2, 9,   60.00),
(2, 10,  15.00),
(2, 11,  42.00), -- *LOW STOCK ALERT* (Current 42.00 <= Reorder 50.00)
(2, 12,  28.00),
(2, 13,  40.00),
(2, 14, 175.00),
(2, 15, 140.00),
(2, 16,  95.00),
(2, 17,  15.00),
(2, 18,  16.00),
(2, 19,  14.00),
(2, 20,   8.00),
(2, 21,  70.00),
(2, 22,  28.00),
(2, 23, 105.00),

-- Zakir 1 (hostel_id = 3)
(3, 1,  160.00),
(3, 2,  210.00),
(3, 3,   40.00),
(3, 4,   22.00), -- *LOW STOCK ALERT* (Current 22.00 <= Reorder 30.00)
(3, 5,   50.00),
(3, 6,   48.00),
(3, 7,   60.00),
(3, 8,   35.00),
(3, 9,   45.00),
(3, 10,  12.00),
(3, 11,  55.00),
(3, 12,  18.00),
(3, 13,  30.00),
(3, 14, 130.00),
(3, 15, 110.00),
(3, 16,  24.00), -- *LOW STOCK ALERT* (Current 24.00 <= Reorder 30.00)
(3, 17,  10.00),
(3, 18,  12.00),
(3, 19,  10.00),
(3, 20,   5.00),
(3, 21,  50.00),
(3, 22,  20.00),
(3, 23,  75.00),

-- Zakir 2 (hostel_id = 4)
(4, 1,  140.00),
(4, 2,  190.00),
(4, 3,   35.00),
(4, 4,   70.00),
(4, 5,   45.00),
(4, 6,   40.00),
(4, 7,   55.00),
(4, 8,   30.00),
(4, 9,   40.00),
(4, 10,   6.00), -- *LOW STOCK ALERT* (Current 6.00 <= Reorder 10.00)
(4, 11,  48.00), -- *LOW STOCK ALERT* (Current 48.00 <= Reorder 50.00)
(4, 12,  16.00),
(4, 13,  25.00),
(4, 14, 115.00),
(4, 15,  95.00),
(4, 16,  70.00),
(4, 17,   8.00),
(4, 18,  10.00),
(4, 19,   9.00),
(4, 20,   4.50),
(4, 21,  45.00),
(4, 22,  18.00),
(4, 23,  65.00);

-- ----------------------------------------------------------------------------
-- 5. Insert Stock Transactions (Inward Supplies Received)
-- ----------------------------------------------------------------------------
INSERT INTO stock_transactions 
(hostel_id, item_id, transaction_type, quantity, unit_price, supplier_name, reference_note, transaction_date, recorded_by)
VALUES
-- Inward batch for Nek Chand 1
(1, 1,  'INWARD', 200.00, 48.00,  'Kisan Agro Foods',       'INV-2026-101', '2026-10-20', 1),
(1, 2,  'INWARD', 250.00, 34.50,  'Shree Ganesh Flour Mill','INV-2026-102', '2026-10-20', 1),
(1, 4,  'INWARD', 100.00, 135.00, 'Kisan Agro Foods',       'INV-2026-103', '2026-10-21', 1),
(1, 8,  'INWARD',  50.00, 145.00, 'Dhara Oil Depot',        'INV-2026-104', '2026-10-21', 1),
(1, 11, 'INWARD',  80.00,  58.00, 'Verka Milk Cooperative', 'INV-2026-105', '2026-10-24', 1),
(1, 14, 'INWARD', 180.00,  22.00, 'City Sabzi Mandi',       'INV-2026-106', '2026-10-24', 1),

-- Inward batch for Nek Chand 2
(2, 1,  'INWARD', 250.00, 48.00,  'Kisan Agro Foods',       'INV-2026-201', '2026-10-19', 2),
(2, 2,  'INWARD', 300.00, 34.50,  'Shree Ganesh Flour Mill','INV-2026-202', '2026-10-19', 2),
(2, 6,  'INWARD',  80.00, 120.00, 'Kisan Agro Foods',       'INV-2026-203', '2026-10-21', 2),
(2, 12, 'INWARD',  35.00, 320.00, 'Verka Milk Cooperative', 'INV-2026-204', '2026-10-23', 2),

-- Inward batch for Zakir 1
(3, 1,  'INWARD', 180.00, 48.00,  'Punjab Grains Agency',   'INV-2026-301', '2026-10-20', 3),
(3, 2,  'INWARD', 220.00, 34.00,  'Shree Ganesh Flour Mill','INV-2026-302', '2026-10-20', 3),
(3, 11, 'INWARD',  70.00,  58.00, 'Verka Milk Cooperative', 'INV-2026-303', '2026-10-23', 3),

-- Inward batch for Zakir 2
(4, 1,  'INWARD', 150.00, 48.00,  'Punjab Grains Agency',   'INV-2026-401', '2026-10-21', 4),
(4, 2,  'INWARD', 200.00, 34.00,  'Shree Ganesh Flour Mill','INV-2026-402', '2026-10-21', 4),
(4, 9,  'INWARD',  50.00, 125.00, 'Dhara Oil Depot',        'INV-2026-403', '2026-10-22', 4);

-- ----------------------------------------------------------------------------
-- 6. Insert Daily Meal Records
-- ----------------------------------------------------------------------------
INSERT INTO meal_records (hostel_id, meal_date, meal_type, food_prepared, portions_served, managed_by) VALUES
-- Nek Chand 1 meals (Oct 25, 2026)
(1, '2026-10-25', 'Breakfast', 'Aloo Paratha, Curd & Pickle',    410, 1),
(1, '2026-10-25', 'Lunch',     'Rajma, Basmati Rice, Roti & Salad',430, 1),
(1, '2026-10-25', 'Snacks',    'Veg Samosa & Masala Tea',        390, 1),
(1, '2026-10-25', 'Dinner',    'Dal Tadka, Mix Veg, Rice, Roti', 420, 1),

-- Nek Chand 2 meals (Oct 25, 2026)
(2, '2026-10-25', 'Breakfast', 'Poha, Boiled Eggs / Milk & Tea', 460, 2),
(2, '2026-10-25', 'Lunch',     'Chole, Jeera Rice, Bhature/Roti',480, 2),
(2, '2026-10-25', 'Dinner',    'Kadai Paneer, Arhar Dal, Roti',  470, 2),

-- Zakir 1 meals (Oct 25, 2026)
(3, '2026-10-25', 'Breakfast', 'Bread Omelette / Veg Sandwich',  370, 3),
(3, '2026-10-25', 'Lunch',     'Moong Dal Khichdi, Curd & Papad',360, 3),
(3, '2026-10-25', 'Dinner',    'Aloo Gobhi, Arhar Dal, Rice, Roti',380, 3),

-- Zakir 2 meals (Oct 25, 2026)
(4, '2026-10-25', 'Lunch',     'Kadhi Pakoda, Rice, Roti, Salad',320, 4),
(4, '2026-10-25', 'Dinner',    'Rajma, Steamed Rice, Tawa Roti', 330, 4);

-- ----------------------------------------------------------------------------
-- 7. Insert Meal Consumptions (Raw materials used per meal)
-- ----------------------------------------------------------------------------
INSERT INTO meal_consumptions (meal_id, item_id, quantity_consumed) VALUES
-- Meal 1: NC1 Breakfast (Aloo Paratha, Curd)
(1, 2,  45.00), -- Wheat Flour (45 kg)
(1, 14, 35.00), -- Potatoes (35 kg)
(1, 8,   8.00), -- Mustard Oil (8 L)
(1, 13, 30.00), -- Curd (30 kg)
(1, 17,  1.50), -- Green Chillies (1.5 kg)
(1, 21,  2.00), -- Salt (2 kg)

-- Meal 2: NC1 Lunch (Rajma, Rice, Roti)
(2, 1,  38.00), -- Basmati Rice (38 kg)
(2, 2,  40.00), -- Wheat Flour (40 kg)
(2, 6,  25.00), -- Rajma (25 kg)
(2, 15, 12.00), -- Onions (12 kg)
(2, 16, 15.00), -- Tomatoes (15 kg)
(2, 8,   7.50), -- Mustard Oil (7.5 L)
(2, 18,  0.75), -- Turmeric Powder (0.75 kg)
(2, 21,  3.00), -- Salt (3 kg)

-- Meal 3: NC1 Snacks (Veg Samosa & Tea)
(3, 2,  20.00), -- Wheat Flour (20 kg)
(3, 14, 25.00), -- Potatoes (25 kg)
(3, 9,  10.00), -- Sunflower Oil (10 L)
(3, 11, 15.00), -- Milk for tea (15 L)
(3, 22,  3.00), -- Tea leaves (3 kg)
(3, 23,  6.00), -- Sugar (6 kg)

-- Meal 4: NC1 Dinner (Dal Tadka, Mix Veg, Rice, Roti)
(4, 1,  35.00), -- Basmati Rice (35 kg)
(4, 2,  42.00), -- Wheat Flour (42 kg)
(4, 4,  18.00), -- Toor Dal (18 kg)
(4, 14, 15.00), -- Potatoes (15 kg)
(4, 15, 10.00), -- Onions (10 kg)
(4, 16, 12.00), -- Tomatoes (12 kg)
(4, 8,   6.00), -- Mustard Oil (6 L)
(4, 21,  2.50), -- Salt (2.5 kg)

-- Meal 5: NC2 Breakfast (Poha & Tea)
(5, 3,  28.00), -- Poha (28 kg)
(5, 14, 12.00), -- Potatoes (12 kg)
(5, 15,  8.00), -- Onions (8 kg)
(5, 9,   5.00), -- Sunflower Oil (5 L)
(5, 11, 18.00), -- Milk (18 L)
(5, 22,  3.50), -- Tea Leaves (3.5 kg)
(5, 23,  7.00), -- Sugar (7 kg)

-- Meal 7: NC2 Dinner (Kadai Paneer, Dal)
(7, 2,  45.00), -- Wheat Flour (45 kg)
(7, 12, 18.00), -- Paneer (18 kg)
(7, 4,  15.00), -- Toor Dal (15 kg)
(7, 15, 14.00), -- Onions (14 kg)
(7, 16, 16.00), -- Tomatoes (16 kg)
(7, 9,   8.00), -- Sunflower Oil (8 L)
(7, 21,  3.00); -- Salt (3 kg)
