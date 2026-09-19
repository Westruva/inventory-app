-- Schema for the car parts inventory database.
-- Run with: npm run db:migrate

-- 1. Create Parts Table
CREATE TABLE IF NOT EXISTS parts (
    part_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    part_number VARCHAR(50) UNIQUE NOT NULL,
    brand VARCHAR(50),
    part_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    cost NUMERIC(10, 2) NOT NULL,
    retail_price NUMERIC(10, 2) NOT NULL,
    quantity_on_hand INT DEFAULT 0,
    reorder_level INT DEFAULT 5,
    location_bin VARCHAR(20)
);

-- 2. Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    engine_trim VARCHAR(50)
);

-- 3. Create Fitment Junction Table (which parts fit which vehicles)
CREATE TABLE IF NOT EXISTS part_fitment (
    fitment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    part_id INT REFERENCES parts(part_id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    CONSTRAINT unique_fitment UNIQUE (part_id, vehicle_id)
);
