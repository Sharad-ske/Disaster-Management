# Disaster Management & Emergency Communication Network (EOC Platform)

A full-stack, real-time emergency management command-centre interface and network simulation platform built for **Computer Networks (Review 1 & 2)**.

**Authors:**
- Sharad Pratap Singh (RA2411026010036)
- Shubhankar Pratap Singh (RA2411026010024)
- Aaditya Jain (RA2411026010039)

---

## 🚀 Live Local URLs
- **Interactive Web App (Vite Dev Server):** [http://localhost:5173](http://localhost:5173)
- **Production Full-Stack & API Server:** [http://localhost:5001](http://localhost:5001)
- **API Health Endpoint:** [http://localhost:5001/health](http://localhost:5001/health)

---

## 🏗️ Architecture & Features

### 1. 10 Functional Command Center Modules
1. **Overview Dashboard (`/`):** Real-time KPI cards, WAN connectivity status, network availability gauge, incident severity breakdown, hospital availability, and live timeline.
2. **Network Topology (`/topology`):** Interactive React Flow visualization showing all 13 core nodes from the original project architecture, active links, OSPF metrics, and one-click **"Simulate Fiber Cut"** and **"Restore Primary Link"** failover controls.
3. **Emergency Alerts (`/alerts`):** Broadcast emergency bulletins with Common Alerting Protocol (CAP) severity tiers (`Critical`, `High`, `Medium`, `Low`) across VLANs 10, 20, and 30.
4. **Incident Management (`/incidents`):** Log disaster incidents, prioritize by severity, assign tactical response units, and transition statuses (`Active`, `En Route`, `On Scene`, `Resolved`, `Closed`).
5. **Hospital Management (`/hospitals`):** Track total and available beds, ICU capacity, oxygen storage cylinders, and ambulance dispatch readiness with CRUD capabilities.
6. **Disaster Shelters (`/shelters`):** Monitor evacuee headcount, remaining food and potable water days, auxiliary generator fuel status, and on-site medical clinic availability.
7. **Responder Management (`/responders`):** Coordinate tactical personnel, radio callsigns, VHF/UHF channels, and current deployment assignments.
8. **Network Monitoring (`/monitoring`):** Real-time Recharts waveforms tracking RTT latency (ms), packet loss (%), throughput (Mbps), and physical router interface states.
9. **Reports & Analytics (`/reports`):** Multi-dimensional response reports with downloadable JSON export and clean printing view.
10. **System Settings (`/settings`):** OSPF routing metrics (Cost 10 vs Cost 100), BFD timer configurations, 802.1Q VLAN table reference, and project credentials.

---

## 📡 Dynamic Failover Demonstration
- **Primary WAN Link (Fiber Backbone):** `10.0.1.0/30`, OSPF Cost: `10`, Latency: ~2.3 ms, Loss: 0.0%.
- **Backup WAN Link (Satellite / Radio Gateway):** `10.0.2.0/30`, OSPF Cost: `100`, Latency: ~350 ms, Loss: ~2.4%, Bandwidth: 5 Mbps.
- **Failover Trigger:** Clicking **"Simulate Fiber Cut"** in the top navigation bar or on the Topology page immediately engages satellite backup routing, emits real-time WebSocket events, flashes a critical command banner, and switches the live graph edges.

---

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router v6, `@xyflow/react`.
- **Backend:** Node.js, Express.js, Socket.IO, REST APIs.
- **Database:** MySQL 8/9 with automatic embedded SQLite failover engine for zero-configuration startup.
