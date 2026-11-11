-- DISASTER MANAGEMENT AND EMERGENCY COMMUNICATION NETWORK
-- Database Schema for MySQL 8.x / 9.x

CREATE DATABASE IF NOT EXISTS disaster_network_db;
USE disaster_network_db;

-- 1. HOSPITALS
CREATE TABLE IF NOT EXISTS hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  total_beds INT NOT NULL,
  available_beds INT NOT NULL,
  icu_total INT DEFAULT 20,
  icu_available INT DEFAULT 5,
  oxygen_cylinders INT DEFAULT 60,
  oxygen_pct INT DEFAULT 90,
  ambulances_total INT DEFAULT 12,
  ambulances_available INT DEFAULT 8,
  emergency_capacity VARCHAR(30) DEFAULT 'Normal',
  operational_status VARCHAR(30) DEFAULT 'Fully Operational',
  contact_number VARCHAR(30),
  ip_address VARCHAR(45) DEFAULT '10.10.20.10',
  vlan VARCHAR(20) DEFAULT 'VLAN 20',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. DISASTER SHELTERS
CREATE TABLE IF NOT EXISTS shelters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  total_capacity INT NOT NULL,
  current_occupancy INT NOT NULL,
  food_supply_days INT DEFAULT 7,
  water_supply_days INT DEFAULT 6,
  power_status VARCHAR(50) DEFAULT 'Auxiliary Generator Active (94%)',
  medical_station BOOLEAN DEFAULT TRUE,
  operational_status VARCHAR(30) DEFAULT 'Accepting Evacuees',
  contact_person VARCHAR(100),
  contact_phone VARCHAR(30),
  ip_address VARCHAR(45) DEFAULT '10.10.30.20',
  vlan VARCHAR(20) DEFAULT 'VLAN 30',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. RESPONDERS
CREATE TABLE IF NOT EXISTS responders (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  assigned_location VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(30) NOT NULL,
  availability_status VARCHAR(30) DEFAULT 'Available',
  current_assignment VARCHAR(150),
  callsign VARCHAR(50),
  vlan VARCHAR(20) DEFAULT 'VLAN 10',
  ip_address VARCHAR(45) DEFAULT '10.10.10.51',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. EMERGENCY INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(100) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  incident_status VARCHAR(30) DEFAULT 'Active',
  reported_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_responders TEXT,
  description TEXT,
  affected_sector VARCHAR(50),
  reported_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. EMERGENCY ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  location VARCHAR(100) NOT NULL,
  affected_locations TEXT NOT NULL,
  description TEXT NOT NULL,
  broadcast_channel VARCHAR(50) DEFAULT 'ALL NETWORKS (VLAN 10/20/30)',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. NETWORK DEVICES
CREATE TABLE IF NOT EXISTS network_devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  subnet VARCHAR(45) NOT NULL,
  vlan VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  status VARCHAR(30) DEFAULT 'Online',
  mac_address VARCHAR(30),
  role VARCHAR(100),
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. NETWORK LINKS & WAN BACKBONE
CREATE TABLE IF NOT EXISTS network_links (
  id VARCHAR(50) PRIMARY KEY,
  source_id VARCHAR(50) NOT NULL,
  target_id VARCHAR(50) NOT NULL,
  link_type VARCHAR(30) NOT NULL,
  bandwidth VARCHAR(30) DEFAULT '1 Gbps',
  latency_ms FLOAT DEFAULT 2.0,
  packet_loss_pct FLOAT DEFAULT 0.0,
  status VARCHAR(30) DEFAULT 'Active',
  ospf_cost INT DEFAULT 10
);

-- 8. TELEMETRY & SYSTEM LOGS
CREATE TABLE IF NOT EXISTS telemetry_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  primary_link_status VARCHAR(30) DEFAULT 'Active',
  backup_link_status VARCHAR(30) DEFAULT 'Standby',
  active_path VARCHAR(50) DEFAULT 'Primary Path (Fiber Backbone)',
  latency_ms FLOAT DEFAULT 2.4,
  packet_loss_pct FLOAT DEFAULT 0.0,
  bandwidth_mbps FLOAT DEFAULT 940.0,
  jitter_ms FLOAT DEFAULT 0.3,
  is_simulated BOOLEAN DEFAULT TRUE
);
