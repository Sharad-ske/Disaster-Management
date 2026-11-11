export const initialHospitals = [
  {
    id: 1,
    name: 'Hospital A (City General Trauma)',
    location: 'North District - Sector 3',
    total_beds: 450,
    available_beds: 68,
    icu_total: 40,
    icu_available: 7,
    oxygen_cylinders: 180,
    oxygen_pct: 92,
    ambulances_total: 16,
    ambulances_available: 5,
    emergency_capacity: 'Surging',
    operational_status: 'Fully Operational',
    contact_number: '+1 (555) 019-2831',
    ip_address: '10.10.20.10',
    vlan: 'VLAN 20 (ADMIN)'
  },
  {
    id: 2,
    name: 'Hospital B (Memorial Emergency Clinic)',
    location: 'West Healthcare District - Sector 8',
    total_beds: 220,
    available_beds: 34,
    icu_total: 18,
    icu_available: 3,
    oxygen_cylinders: 95,
    oxygen_pct: 78,
    ambulances_total: 8,
    ambulances_available: 2,
    emergency_capacity: 'Critical',
    operational_status: 'Fully Operational',
    contact_number: '+1 (555) 014-9922',
    ip_address: '10.10.20.15',
    vlan: 'VLAN 20 (ADMIN)'
  },
  {
    id: 3,
    name: 'St. Jude Urgent Care Facility',
    location: 'Eastern Perimeter - Sector 12',
    total_beds: 150,
    available_beds: 42,
    icu_total: 12,
    icu_available: 6,
    oxygen_cylinders: 70,
    oxygen_pct: 88,
    ambulances_total: 6,
    ambulances_available: 4,
    emergency_capacity: 'Normal',
    operational_status: 'Fully Operational',
    contact_number: '+1 (555) 018-4720',
    ip_address: '10.10.20.18',
    vlan: 'VLAN 20 (ADMIN)'
  }
];

export const initialShelters = [
  {
    id: 1,
    name: 'Shelter A (Civic Center Relief)',
    location: 'Downtown Safe Zone - Sector 2',
    total_capacity: 1200,
    current_occupancy: 940,
    food_supply_days: 8,
    water_supply_days: 6,
    power_status: 'Auxiliary Generator Active (94%)',
    medical_station: 1,
    operational_status: 'Accepting Evacuees',
    contact_person: 'Major Douglas Hayes',
    contact_phone: '+1 (555) 349-2041',
    ip_address: '10.10.30.20',
    vlan: 'VLAN 30 (PUBLIC)'
  },
  {
    id: 2,
    name: 'Shelter B (High School Gymnasium)',
    location: 'East Evacuation Point - Sector 6',
    total_capacity: 650,
    current_occupancy: 590,
    food_supply_days: 4,
    water_supply_days: 3,
    power_status: 'Primary Grid Offline / Generator (65%)',
    medical_station: 1,
    operational_status: 'At Capacity',
    contact_person: 'Sarah Jenkins, Red Cross',
    contact_phone: '+1 (555) 349-8812',
    ip_address: '10.10.30.25',
    vlan: 'VLAN 30 (PUBLIC)'
  },
  {
    id: 3,
    name: 'South District Field Dome',
    location: 'South Recreational Park - Sector 11',
    total_capacity: 800,
    current_occupancy: 310,
    food_supply_days: 10,
    water_supply_days: 9,
    power_status: 'Solar Microgrid & Battery (98%)',
    medical_station: 0,
    operational_status: 'Accepting Evacuees',
    contact_person: 'Capt. Marcus Vance',
    contact_phone: '+1 (555) 349-7703',
    ip_address: '10.10.30.30',
    vlan: 'VLAN 30 (PUBLIC)'
  }
];

export const initialResponders = [
  {
    id: 'RESP-101',
    name: 'Capt. Elena Rostova',
    department: 'Fire & Rescue',
    assigned_location: 'Sector 4 Collapse Zone',
    contact_phone: '+1 (555) 701-1101',
    availability_status: 'Deployed',
    current_assignment: 'Urban search & heavy extrication',
    callsign: 'RESCUE-LEAD-1',
    vlan: 'VLAN 10 (OPS)',
    ip_address: '10.10.10.51'
  },
  {
    id: 'RESP-102',
    name: 'Lt. James Miller',
    department: 'Tactical Comms',
    assigned_location: 'Mobile Command Post (MCP-1)',
    contact_phone: '+1 (555) 701-1102',
    availability_status: 'Deployed',
    current_assignment: 'Maintaining mesh uplink and backup satellite gateway',
    callsign: 'COMMS-ALPHA',
    vlan: 'VLAN 10 (OPS)',
    ip_address: '10.10.10.10'
  },
  {
    id: 'RESP-103',
    name: 'Dr. Anita Roy',
    department: 'Medical / EMS',
    assigned_location: 'Hospital A Triage Bay',
    contact_phone: '+1 (555) 701-1103',
    availability_status: 'Available',
    current_assignment: 'Mass casualty trauma intake coordination',
    callsign: 'MEDIC-CHIEF-1',
    vlan: 'VLAN 20 (ADMIN)',
    ip_address: '10.10.20.52'
  },
  {
    id: 'RESP-104',
    name: 'Sgt. David Vance',
    department: 'Police & Security',
    assigned_location: 'Shelter A Evacuation Perimeter',
    contact_phone: '+1 (555) 701-1104',
    availability_status: 'Available',
    current_assignment: 'Securing supply transport corridors and perimeter',
    callsign: 'PATROL-BRAVO',
    vlan: 'VLAN 10 (OPS)',
    ip_address: '10.10.10.63'
  },
  {
    id: 'RESP-105',
    name: 'Inspector Chloe Chen',
    department: 'Hazmat Response',
    assigned_location: 'West Industrial Park - Sector 9',
    contact_phone: '+1 (555) 701-1105',
    availability_status: 'Deployed',
    current_assignment: 'Chemical spill containment & air quality monitoring',
    callsign: 'HAZMAT-DELTA',
    vlan: 'VLAN 10 (OPS)',
    ip_address: '10.10.10.74'
  },
  {
    id: 'RESP-106',
    name: 'Officer Tariq Mansoor',
    department: 'Fire & Rescue',
    assigned_location: 'Reserve Staging Base',
    contact_phone: '+1 (555) 701-1106',
    availability_status: 'Available',
    current_assignment: 'On rapid reserve standby for second wave dispatch',
    callsign: 'RESCUE-STANDBY-2',
    vlan: 'VLAN 10 (OPS)',
    ip_address: '10.10.10.82'
  }
];

export const initialIncidents = [
  {
    id: 'INC-2026-001',
    name: 'Structural Collapse - Commercial Center',
    location: 'Sector 4, West Commerce Blvd',
    severity: 'Critical',
    incident_status: 'On Scene',
    reported_time: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    assigned_responders: JSON.stringify(['RESP-101', 'RESP-102']),
    description: 'Multi-story structural collapse triggered by regional seismic tremor. Multiple trapped victims reported. Primary power lines down.',
    affected_sector: 'Sector 4',
    reported_by: 'EOC Sensor Telemetry & 911 Dispatch'
  },
  {
    id: 'INC-2026-002',
    name: 'Hazardous Chemical Tanker Leak',
    location: 'Sector 9 Industrial Corridor',
    severity: 'High',
    incident_status: 'Active',
    reported_time: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    assigned_responders: JSON.stringify(['RESP-105']),
    description: 'Overturned chlorine transport trailer leaking vapor cloud toward residential boundary. 1000m evacuation zone established.',
    affected_sector: 'Sector 9',
    reported_by: 'Highway Patrol Unit 4'
  },
  {
    id: 'INC-2026-003',
    name: 'Water Main Rupture Near Evacuation Route',
    location: 'Sector 6 Highway 101 Access Ramp',
    severity: 'Medium',
    incident_status: 'En Route',
    reported_time: new Date(Date.now() - 3600000 * 0.9).toISOString(),
    assigned_responders: JSON.stringify(['RESP-104']),
    description: 'High-pressure municipal water main burst causing localized flash flooding across primary ambulance arterial route.',
    affected_sector: 'Sector 6',
    reported_by: 'Public Works Telemetry'
  },
  {
    id: 'INC-2026-004',
    name: 'Shelter B Emergency Power Surge',
    location: 'Shelter B - High School Gym',
    severity: 'Low',
    incident_status: 'Resolved',
    reported_time: new Date(Date.now() - 3600000 * 5.2).toISOString(),
    assigned_responders: JSON.stringify(['RESP-102']),
    description: 'Auxiliary diesel generator automatic transfer switch tripped. Reset completed and power restored to shelter medical bay.',
    affected_sector: 'Sector 6',
    reported_by: 'Shelter Manager'
  }
];

export const initialAlerts = [
  {
    id: 1,
    title: 'CIVIL EMERGENCY: Category 3 Flash Flood & Seismic Warning',
    severity: 'Critical',
    location: 'Sectors 3, 4, 8 & 9 (Metropolitan Valley)',
    affected_locations: 'North Medical Zone, Sector 4 Collapse Area, Coastal Arterial Bridges',
    description: 'Severe infrastructure damage detected across Sector 4. All civilian traffic barred from highway arteries. Emergency responders prioritize human rescue and flood gate containment.',
    broadcast_channel: 'ALL CHANNELS (VLAN 10/20/30 & PUBLIC CAP)',
    active: 1,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 2,
    title: 'NETWORK WARNING: Fiber Backhaul Stress / Degradation Pre-Alert',
    severity: 'High',
    location: 'WAN Link Segment Core-Regional (10.0.1.0/30)',
    affected_locations: 'EOC Core Router to District Regional Router',
    description: 'Elevated bit error rate detected on subterranean fiber conduit. Satellite/Radio gateway (10.0.2.0/30) placed on hot standby for automatic OSPF failover.',
    broadcast_channel: 'OPS & ADMIN (VLAN 10 / VLAN 20)',
    active: 1,
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 3,
    title: 'SHELTER ADVISORY: Shelter B Reaching Bed Capacity',
    severity: 'Medium',
    location: 'East Evacuation Point - Sector 6',
    affected_locations: 'Shelter B, St. Jude Transit Point',
    description: 'Shelter B current headcount is 590/650 (91%). Directing inbound civilian buses toward South District Field Dome (Sector 11).',
    broadcast_channel: 'PUBLIC & ADMIN (VLAN 20 / VLAN 30)',
    active: 1,
    created_at: new Date(Date.now() - 3600000 * 0.8).toISOString()
  }
];

export const initialNetworkDevices = [
  {
    id: 'eoc-core',
    name: 'EOC Core Router (cisco/FRR)',
    device_type: 'Core Router',
    ip_address: '10.0.1.1/30',
    subnet: '10.0.1.0/30 (WAN Primary)',
    vlan: 'OSPF Backbone',
    location: 'EOC Command Headquarters - Vault 1',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:01',
    role: 'Central WAN Aggregator & Default Route Hub'
  },
  {
    id: 'reg-rtr',
    name: 'District Regional Router',
    device_type: 'Regional Router',
    ip_address: '10.0.1.2/30',
    subnet: '10.0.1.0/30 (Primary) & 10.0.2.2/30 (Backup)',
    vlan: 'OSPF Area 0',
    location: 'Regional Distribution Tower - Sector 5',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:02',
    role: 'Tactical WAN Gateway & 802.1Q VLAN Router-on-a-Stick'
  },
  {
    id: 'sat-gw',
    name: 'Satellite / Radio Gateway',
    device_type: 'Gateway',
    ip_address: '10.0.2.2/30',
    subnet: '10.0.2.0/30 (WAN Backup)',
    vlan: 'OSPF Backup (Cost 100)',
    location: 'High-Altitude Ground Station Terminal',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:03',
    role: 'Low-Earth Orbit & UHF/VHF Resilient Fallback Gateway'
  },
  {
    id: 'eoc-l3-sw',
    name: 'EOC Layer 3 Core Switch',
    device_type: 'Layer 3 Switch',
    ip_address: '10.100.0.1/24',
    subnet: '10.100.0.0/24 (EOC Core LAN)',
    vlan: 'VLAN 100 (EOC Core)',
    location: 'EOC Data Center Rack A',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:04',
    role: 'Inter-VLAN Wire-Speed Routing & Server Aggregation'
  },
  {
    id: 'eoc-app-srv',
    name: 'Application / Database Server',
    device_type: 'Application Server',
    ip_address: '10.100.0.10/24',
    subnet: '10.100.0.0/24',
    vlan: 'VLAN 100 (Server LAN)',
    location: 'EOC Server Rack A-01',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:05',
    role: 'Disaster Coordination DB, REST APIs, WebSocket Broker'
  },
  {
    id: 'eoc-mon-srv',
    name: 'Network Monitoring Server',
    device_type: 'Monitoring Server',
    ip_address: '10.100.0.20/24',
    subnet: '10.100.0.0/24',
    vlan: 'VLAN 100 (Server LAN)',
    location: 'EOC Server Rack A-02',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:06',
    role: 'Real-Time SNMP / Netlink Telemetry Ingestion'
  },
  {
    id: 'eoc-core-dns',
    name: 'Emergency Operations Centre (EOC)',
    device_type: 'Emergency Operations Centre',
    ip_address: '10.100.0.5/24',
    subnet: '10.100.0.0/24',
    vlan: 'VLAN 100 (Core Services)',
    location: 'EOC Central Facility',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:07',
    role: 'Primary Emergency Command & Authoritative DNS/DHCP'
  },
  {
    id: 'hosp-a',
    name: 'Hospital A Terminal',
    device_type: 'Hospital',
    ip_address: '10.10.20.10/24',
    subnet: '10.10.20.0/24',
    vlan: 'VLAN 20 (ADMIN)',
    location: 'City General Trauma Center',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:10',
    role: 'ICU Bed Telemetry & Trauma Triage Intake Station'
  },
  {
    id: 'hosp-b',
    name: 'Hospital B Terminal',
    device_type: 'Hospital',
    ip_address: '10.10.20.15/24',
    subnet: '10.10.20.0/24',
    vlan: 'VLAN 20 (ADMIN)',
    location: 'Memorial Emergency Clinic',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:11',
    role: 'Emergency Medical Supply & Ambulance Dispatch Gateway'
  },
  {
    id: 'shelter-a',
    name: 'Shelter A Terminal',
    device_type: 'Disaster Shelter',
    ip_address: '10.10.30.20/24',
    subnet: '10.10.30.0/24',
    vlan: 'VLAN 30 (PUBLIC)',
    location: 'Civic Center Relief Shelter',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:20',
    role: 'Displaced Persons Registration & Supply Monitor'
  },
  {
    id: 'shelter-b',
    name: 'Shelter B Terminal',
    device_type: 'Disaster Shelter',
    ip_address: '10.10.30.25/24',
    subnet: '10.10.30.0/24',
    vlan: 'VLAN 30 (PUBLIC)',
    location: 'High School Gymnasium Shelter',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:21',
    role: 'Evacuee Registry & Auxiliary Generator Telemetry'
  },
  {
    id: 'resp-net',
    name: 'Emergency Responder Network',
    device_type: 'Responder Network',
    ip_address: '10.10.10.5/24',
    subnet: '10.10.10.0/24',
    vlan: 'VLAN 10 (OPS)',
    location: 'Tactical Incident Perimeter',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:30',
    role: 'Priority Encrypted Wi-Fi AP for Deployed Field Radios'
  },
  {
    id: 'mcp-van',
    name: 'Mobile Command Post (MCP-1)',
    device_type: 'Mobile Command Post',
    ip_address: '10.10.10.10/24',
    subnet: '10.10.10.0/24',
    vlan: 'VLAN 10 (OPS)',
    location: 'Forward Command Van - Sector 4',
    status: 'Online',
    mac_address: '00:1A:2B:3C:4D:31',
    role: 'Field Incident Commander Tactical Station & Radio Relay'
  }
];

export const initialNetworkLinks = [
  {
    id: 'link-wan-primary',
    source_id: 'reg-rtr',
    target_id: 'eoc-core',
    link_type: 'Primary Communication Path (Fiber)',
    bandwidth: '1 Gbps',
    latency_ms: 2.2,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 10
  },
  {
    id: 'link-wan-backup',
    source_id: 'sat-gw',
    target_id: 'eoc-core',
    link_type: 'Backup Communication Path (Satellite/Radio)',
    bandwidth: '5 Mbps',
    latency_ms: 350.0,
    packet_loss_pct: 2.1,
    status: 'Standby',
    ospf_cost: 100
  },
  {
    id: 'link-sat-reg',
    source_id: 'sat-gw',
    target_id: 'reg-rtr',
    link_type: 'Satellite Ground Uplink',
    bandwidth: '50 Mbps',
    latency_ms: 12.0,
    packet_loss_pct: 0.1,
    status: 'Active',
    ospf_cost: 10
  },
  {
    id: 'link-core-l3',
    source_id: 'eoc-core',
    target_id: 'eoc-l3-sw',
    link_type: 'Core Backbone Trunk',
    bandwidth: '10 Gbps',
    latency_ms: 0.2,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 1
  },
  {
    id: 'link-l3-eoc-facility',
    source_id: 'eoc-l3-sw',
    target_id: 'eoc-core-dns',
    link_type: 'EOC Facility Link',
    bandwidth: '1 Gbps',
    latency_ms: 0.3,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 1
  },
  {
    id: 'link-l3-app',
    source_id: 'eoc-l3-sw',
    target_id: 'eoc-app-srv',
    link_type: 'Server LAN Access',
    bandwidth: '1 Gbps',
    latency_ms: 0.1,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 1
  },
  {
    id: 'link-l3-mon',
    source_id: 'eoc-l3-sw',
    target_id: 'eoc-mon-srv',
    link_type: 'Monitoring LAN Access',
    bandwidth: '1 Gbps',
    latency_ms: 0.1,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 1
  },
  {
    id: 'link-reg-hosp-a',
    source_id: 'reg-rtr',
    target_id: 'hosp-a',
    link_type: 'VLAN 20 (ADMIN)',
    bandwidth: '100 Mbps',
    latency_ms: 4.5,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 5
  },
  {
    id: 'link-reg-hosp-b',
    source_id: 'reg-rtr',
    target_id: 'hosp-b',
    link_type: 'VLAN 20 (ADMIN)',
    bandwidth: '100 Mbps',
    latency_ms: 6.1,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 5
  },
  {
    id: 'link-reg-shelter-a',
    source_id: 'reg-rtr',
    target_id: 'shelter-a',
    link_type: 'VLAN 30 (PUBLIC)',
    bandwidth: '100 Mbps',
    latency_ms: 7.2,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 5
  },
  {
    id: 'link-reg-shelter-b',
    source_id: 'reg-rtr',
    target_id: 'shelter-b',
    link_type: 'VLAN 30 (PUBLIC)',
    bandwidth: '100 Mbps',
    latency_ms: 8.4,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 5
  },
  {
    id: 'link-reg-resp',
    source_id: 'reg-rtr',
    target_id: 'resp-net',
    link_type: 'VLAN 10 (OPS)',
    bandwidth: '300 Mbps',
    latency_ms: 3.1,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 5
  },
  {
    id: 'link-reg-mcp',
    source_id: 'reg-rtr',
    target_id: 'mcp-van',
    link_type: 'VLAN 10 (OPS)',
    bandwidth: '1 Gbps',
    latency_ms: 1.8,
    packet_loss_pct: 0.0,
    status: 'Active',
    ospf_cost: 5
  }
];
