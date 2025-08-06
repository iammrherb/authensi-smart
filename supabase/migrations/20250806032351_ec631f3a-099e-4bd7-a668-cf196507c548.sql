-- Add comprehensive vendor and model data with extensive firmware support

-- First, let's add the new major vendors to the vendor_library table
INSERT INTO vendor_library (
  id,
  vendor_name, 
  vendor_type,
  category, 
  portnox_integration_level,
  integration_methods,
  supported_protocols,
  known_limitations,
  firmware_requirements,
  documentation_links,
  configuration_templates,
  support_level,
  last_tested_date,
  status,
  created_by
) VALUES 
-- Palo Alto Networks
(
  gen_random_uuid(),
  'Palo Alto Networks',
  'firewall',
  'Next-Generation Firewall',
  'full',
  '["User-ID Integration", "GlobalProtect VPN", "Dynamic Address Groups", "Security Policies"]'::jsonb,
  '["RADIUS", "LDAP", "SAML", "Kerberos", "Certificate-based"]'::jsonb,
  '["Requires User-ID agent for AD integration", "GlobalProtect license needed for VPN"]'::jsonb,
  '{"minimum": "9.1", "recommended": "11.1.3", "latest": "11.1.3"}'::jsonb,
  '[{"title": "User-ID Configuration Guide", "url": "https://docs.paloaltonetworks.com"}, {"title": "NAC Integration Best Practices", "url": "https://docs.paloaltonetworks.com"}]'::jsonb,
  '{"basic_auth": "Basic User-ID authentication template", "advanced_segmentation": "Advanced microsegmentation template"}'::jsonb,
  'full',
  '2024-01-15',
  'active',
  null
),
-- Dell Technologies  
(
  gen_random_uuid(),
  'Dell Technologies',
  'switch',
  'Enterprise Networking',
  'full', 
  '["OS10 CLI", "REST API", "NETCONF", "OpenFlow"]'::jsonb,
  '["802.1X", "RADIUS", "TACACS+", "MAB", "Dynamic VLAN"]'::jsonb,
  '["OS10 required for full feature support", "Legacy Force10 has limited NAC support"]'::jsonb,
  '{"minimum": "10.5.0", "recommended": "10.5.6.0", "latest": "10.5.6.0"}'::jsonb,
  '[{"title": "OS10 802.1X Configuration", "url": "https://www.dell.com/support"}, {"title": "Campus Fabric Guide", "url": "https://www.dell.com/support"}]'::jsonb,
  '{"campus_fabric": "Dell Campus Fabric 802.1X template", "basic_access": "Basic access layer template"}'::jsonb,
  'full',
  '2024-01-20',
  'active',
  null
),
-- SonicWall
(
  gen_random_uuid(),
  'SonicWall',
  'firewall',
  'Network Security',
  'full',
  '["SonicOS API", "RADIUS Integration", "LDAP", "Single Sign-On"]'::jsonb,
  '["RADIUS", "LDAP", "Local Users", "SSO", "Certificate"]'::jsonb,
  '["Limited 802.1X switch integration", "Requires SonicOS 7.0+ for advanced features"]'::jsonb,
  '{"minimum": "6.5.4", "recommended": "7.0.1-5035", "latest": "7.0.1-5035"}'::jsonb,
  '[{"title": "SonicOS Authentication Guide", "url": "https://www.sonicwall.com/support"}, {"title": "RADIUS Configuration", "url": "https://www.sonicwall.com/support"}]'::jsonb,
  '{"firewall_auth": "Basic firewall authentication template", "vpn_integration": "SSL VPN with RADIUS template"}'::jsonb,
  'full',
  '2024-01-10',
  'active',
  null
),
-- Cisco Meraki
(
  gen_random_uuid(),
  'Cisco Meraki',
  'cloud-managed',
  'Cloud-Managed Networking',
  'full',
  '["Meraki Dashboard API", "Cloud RADIUS", "Systems Manager"]'::jsonb,
  '["802.1X", "PSK", "Cloud RADIUS", "Active Directory", "LDAP"]'::jsonb,
  '["Requires cloud connectivity", "Limited on-premises RADIUS integration"]'::jsonb,
  '{"cloud_managed": "true", "auto_update": "true"}'::jsonb,
  '[{"title": "Meraki 802.1X Configuration", "url": "https://documentation.meraki.com"}, {"title": "Systems Manager Integration", "url": "https://documentation.meraki.com"}]'::jsonb,
  '{"cloud_auth": "Cloud-based 802.1X template", "byod": "BYOD with Systems Manager template"}'::jsonb,
  'full',
  '2024-01-25',
  'active',
  null
),
-- Ubiquiti
(
  gen_random_uuid(),
  'Ubiquiti',
  'enterprise',
  'UniFi Enterprise',
  'partial',
  '["UniFi Controller", "RADIUS", "VLAN Assignment"]'::jsonb,
  '["802.1X", "RADIUS", "Dynamic VLAN", "Guest Portal"]'::jsonb,
  '["Limited enterprise features", "Basic RADIUS integration", "No advanced policy enforcement"]'::jsonb,
  '{"controller": "6.5.59", "firmware": "varies by model"}'::jsonb,
  '[{"title": "UniFi RADIUS Configuration", "url": "https://help.ui.com"}, {"title": "VLAN Configuration Guide", "url": "https://help.ui.com"}]'::jsonb,
  '{"basic_enterprise": "Basic enterprise 802.1X template", "guest_access": "Guest network template"}'::jsonb,
  'partial',
  '2024-01-05',
  'active',
  null
);

-- Now add detailed models for each vendor to vendor_models table
-- This will significantly expand the model database with comprehensive firmware versions

-- Palo Alto Networks Models
INSERT INTO vendor_models (
  vendor_id,
  model_name,
  model_series,
  firmware_versions,
  hardware_specs,
  port_configurations,
  supported_features,
  eol_date,
  eos_date,
  documentation_links,
  configuration_notes,
  created_by
) 
SELECT 
  vl.id as vendor_id,
  model_data.model_name,
  model_data.model_series,
  model_data.firmware_versions::jsonb,
  model_data.hardware_specs::jsonb,
  model_data.port_configurations::jsonb,
  model_data.supported_features::jsonb,
  model_data.eol_date::date,
  model_data.eos_date::date,
  model_data.documentation_links::jsonb,
  model_data.configuration_notes,
  null
FROM vendor_library vl,
(VALUES
  -- Palo Alto PA-220 Series
  ('PA-220', '220 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11", "10.0.12"]', '{"ports": "8x GbE", "throughput": "940 Mbps", "sessions": "64000"}', '{"management": "1x Console, 1x USB", "data": "8x GbE RJ45"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "VPN"]', null, null, '[{"title": "PA-220 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'Entry-level desktop firewall for small offices'),
  ('PA-415', '400 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "16x GbE + 4x SFP", "throughput": "1.5 Gbps", "sessions": "200000"}', '{"management": "1x Console, 1x USB", "data": "16x GbE + 4x SFP"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "SD-WAN", "ML-Powered"]', null, null, '[{"title": "PA-415 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'Branch firewall with ML-powered security'),
  ('PA-440', '400 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "16x GbE + 4x SFP", "throughput": "3.5 Gbps", "sessions": "300000"}', '{"management": "1x Console, 1x USB", "data": "16x GbE + 4x SFP"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "SD-WAN", "ML-Powered"]', null, null, '[{"title": "PA-440 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'High-performance branch firewall'),
  ('PA-820', '800 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "8x GbE + 8x SFP", "throughput": "1.9 Gbps", "sessions": "250000"}', '{"management": "1x Console, 1x USB", "data": "8x GbE + 8x SFP"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "VPN", "SD-WAN"]', null, null, '[{"title": "PA-820 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'Mid-range branch firewall'),
  ('PA-850', '800 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "8x GbE + 8x SFP", "throughput": "2.5 Gbps", "sessions": "350000"}', '{"management": "1x Console, 1x USB", "data": "8x GbE + 8x SFP"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "VPN", "SD-WAN"]', null, null, '[{"title": "PA-850 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'High-performance branch firewall'),
  ('PA-3220', '3200 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "16x GbE + 4x SFP+", "throughput": "5.5 Gbps", "sessions": "750000"}', '{"management": "1x Console, 1x USB", "data": "16x GbE + 4x SFP+"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering"]', null, null, '[{"title": "PA-3220 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'Enterprise firewall with HA support'),
  ('PA-3260', '3200 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "16x GbE + 4x SFP+", "throughput": "10 Gbps", "sessions": "2000000"}', '{"management": "1x Console, 1x USB", "data": "16x GbE + 4x SFP+"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering"]', null, null, '[{"title": "PA-3260 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'High-performance enterprise firewall'),
  ('PA-5220', '5200 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "16x SFP+ + 4x QSFP+", "throughput": "14.3 Gbps", "sessions": "4000000"}', '{"management": "1x Console, 1x USB", "data": "16x SFP+ + 4x QSFP+"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering", "WildFire"]', null, null, '[{"title": "PA-5220 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'Data center firewall with advanced threat protection'),
  ('PA-5260', '5200 Series', '["11.1.3", "11.0.4", "10.2.9", "10.1.11"]', '{"ports": "16x SFP+ + 4x QSFP+", "throughput": "24.5 Gbps", "sessions": "8000000"}', '{"management": "1x Console, 1x USB", "data": "16x SFP+ + 4x QSFP+"}', '["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering", "WildFire"]', null, null, '[{"title": "PA-5260 Admin Guide", "url": "https://docs.paloaltonetworks.com"}]', 'High-end data center firewall')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, eol_date, eos_date, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Palo Alto Networks';

-- Add HP Aruba Models
INSERT INTO vendor_models (
  vendor_id,
  model_name,
  model_series, 
  firmware_versions,
  hardware_specs,
  port_configurations,
  supported_features,
  eol_date,
  eos_date,
  documentation_links,
  configuration_notes,
  created_by
)
SELECT 
  vl.id as vendor_id,
  model_data.model_name,
  model_data.model_series,
  model_data.firmware_versions::jsonb,
  model_data.hardware_specs::jsonb,
  model_data.port_configurations::jsonb,
  model_data.supported_features::jsonb,
  model_data.eol_date::date,
  model_data.eos_date::date,
  model_data.documentation_links::jsonb,
  model_data.configuration_notes,
  null
FROM vendor_library vl,
(VALUES
  -- HP Aruba Access Points
  ('AP-505', '500 Series', '["8.11.2.2", "8.10.0.8", "8.9.0.5", "10.4.1.0"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE+"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x GbE"}', '["Wi-Fi 6", "4x4 MIMO", "PoE+", "BLE", "IoT Ready"]', null, null, '[{"title": "AP-505 Installation Guide", "url": "https://www.arubanetworks.com"}]', 'Wi-Fi 6 indoor access point'),
  ('AP-515', '500 Series', '["8.11.2.2", "8.10.0.8", "8.9.0.5", "10.4.1.0"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE+", "antenna": "External"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x GbE"}', '["Wi-Fi 6", "4x4 MIMO", "PoE+", "BLE", "IoT Ready", "External Antenna"]', null, null, '[{"title": "AP-515 Installation Guide", "url": "https://www.arubanetworks.com"}]', 'Wi-Fi 6 outdoor access point with external antennas'),
  ('AP-555', '500 Series', '["8.11.2.2", "8.10.0.8", "8.9.0.5", "10.4.1.0"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE++"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x mGbE"}', '["Wi-Fi 6", "4x4 MIMO", "PoE++", "BLE", "IoT Ready", "High Density"]', null, null, '[{"title": "AP-555 Installation Guide", "url": "https://www.arubanetworks.com"}]', 'High-density Wi-Fi 6 access point'),
  ('AP-635', '600 Series', '["8.11.2.2", "8.10.0.8", "10.4.1.0"]', '{"radio": "Wi-Fi 6E", "mimo": "4x4", "power": "PoE++", "bands": "2.4/5/6 GHz"}', '{"wireless": "2.4/5/6 GHz", "ethernet": "1x mGbE"}', '["Wi-Fi 6E", "4x4 MIMO", "6GHz", "PoE++", "BLE", "Zigbee"]', null, null, '[{"title": "AP-635 Installation Guide", "url": "https://www.arubanetworks.com"}]', 'Wi-Fi 6E tri-band access point'),
  ('AP-655', '600 Series', '["8.11.2.2", "8.10.0.8", "10.4.1.0"]', '{"radio": "Wi-Fi 6E", "mimo": "4x4", "power": "PoE++", "bands": "2.4/5/6 GHz"}', '{"wireless": "2.4/5/6 GHz", "ethernet": "1x mGbE"}', '["Wi-Fi 6E", "4x4 MIMO", "6GHz", "PoE++", "BLE", "Zigbee", "High Density"]', null, null, '[{"title": "AP-655 Installation Guide", "url": "https://www.arubanetworks.com"}]', 'High-density Wi-Fi 6E access point'),
  ('AP-675', '670 Series', '["8.11.2.2", "8.10.0.8", "10.4.1.0"]', '{"radio": "Wi-Fi 6E", "mimo": "4x4", "power": "PoE++", "antenna": "External"}', '{"wireless": "2.4/5/6 GHz", "ethernet": "1x mGbE"}', '["Wi-Fi 6E", "4x4 MIMO", "6GHz", "PoE++", "BLE", "Zigbee", "External Antenna"]', null, null, '[{"title": "AP-675 Installation Guide", "url": "https://www.arubanetworks.com"}]', 'Wi-Fi 6E outdoor access point'),
  -- Aruba Controllers
  ('7005', '7000 Series', '["8.11.2.2", "8.10.0.8", "8.9.0.5"]', '{"capacity": "128 APs", "throughput": "8 Gbps", "users": "8000"}', '{"data": "8x GbE", "management": "1x Console"}', '["128 APs", "AirMatch", "ClientMatch", "Adaptive Radio Management"]', null, null, '[{"title": "7005 Configuration Guide", "url": "https://www.arubanetworks.com"}]', 'Small to medium enterprise controller'),
  ('7010', '7000 Series', '["8.11.2.2", "8.10.0.8", "8.9.0.5"]', '{"capacity": "512 APs", "throughput": "16 Gbps", "users": "16000"}', '{"data": "16x GbE", "management": "1x Console"}', '["512 APs", "AirMatch", "ClientMatch", "Adaptive Radio Management", "Redundancy"]', null, null, '[{"title": "7010 Configuration Guide", "url": "https://www.arubanetworks.com"}]', 'Medium enterprise controller with redundancy'),
  ('7030', '7000 Series', '["8.11.2.2", "8.10.0.8", "8.9.0.5"]', '{"capacity": "2048 APs", "throughput": "64 Gbps", "users": "64000"}', '{"data": "24x GbE + 4x 10GbE", "management": "1x Console"}', '["2048 APs", "AirMatch", "ClientMatch", "Adaptive Radio Management", "Clustering"]', null, null, '[{"title": "7030 Configuration Guide", "url": "https://www.arubanetworks.com"}]', 'Large enterprise controller with clustering')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, eol_date, eos_date, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Aruba (HPE)';

-- Add Dell Models
INSERT INTO vendor_models (
  vendor_id,
  model_name,
  model_series,
  firmware_versions,
  hardware_specs,
  port_configurations,
  supported_features,
  eol_date,
  eos_date,
  documentation_links,
  configuration_notes,
  created_by
)
SELECT 
  vl.id as vendor_id,
  model_data.model_name,
  model_data.model_series,
  model_data.firmware_versions::jsonb,
  model_data.hardware_specs::jsonb,
  model_data.port_configurations::jsonb,
  model_data.supported_features::jsonb,
  model_data.eol_date::date,
  model_data.eos_date::date,
  model_data.documentation_links::jsonb,
  model_data.configuration_notes,
  null
FROM vendor_library vl,
(VALUES
  -- Dell PowerSwitch N1100 Series
  ('N1108T-ON', 'N1100 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "8x GbE + 2x SFP+", "forwarding": "13.1 Mpps", "switching": "17.6 Gbps"}', '{"data": "8x GbE RJ45 + 2x SFP+", "management": "1x Console, 1x USB"}', '["802.1X", "VLAN", "QoS", "LLDP", "ONIE"]', null, null, '[{"title": "N1100 Configuration Guide", "url": "https://www.dell.com/support"}]', 'Compact access switch with ONIE support'),
  ('N1124T-ON', 'N1100 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "24x GbE + 4x SFP+", "forwarding": "41.7 Mpps", "switching": "56 Gbps"}', '{"data": "24x GbE RJ45 + 4x SFP+", "management": "1x Console, 1x USB"}', '["802.1X", "VLAN", "QoS", "LLDP", "ONIE", "Multi-Auth"]', null, null, '[{"title": "N1100 Configuration Guide", "url": "https://www.dell.com/support"}]', 'Access switch with multi-auth support'),
  ('N1148T-ON', 'N1100 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "48x GbE + 4x SFP+", "forwarding": "77.4 Mpps", "switching": "104 Gbps"}', '{"data": "48x GbE RJ45 + 4x SFP+", "management": "1x Console, 1x USB"}', '["802.1X", "VLAN", "QoS", "LLDP", "ONIE", "Multi-Auth"]', null, null, '[{"title": "N1100 Configuration Guide", "url": "https://www.dell.com/support"}]', 'High-density access switch'),
  -- Dell PowerSwitch N2200 Series
  ('N2224PX-ON', 'N2200 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "24x GbE + 4x SFP+", "forwarding": "41.7 Mpps", "switching": "56 Gbps", "poe": "370W"}', '{"data": "24x GbE PoE+ + 4x SFP+", "management": "1x Console, 1x USB", "stacking": "2x Stack"}', '["802.1X", "VLT", "PoE+", "Stacking", "Multi-Auth", "Campus Fabric"]', null, null, '[{"title": "N2200 Configuration Guide", "url": "https://www.dell.com/support"}]', 'PoE+ access switch with VLT'),
  ('N2248PX-ON', 'N2200 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "48x GbE + 4x SFP+", "forwarding": "77.4 Mpps", "switching": "104 Gbps", "poe": "740W"}', '{"data": "48x GbE PoE+ + 4x SFP+", "management": "1x Console, 1x USB", "stacking": "2x Stack"}', '["802.1X", "VLT", "PoE+", "Stacking", "Multi-Auth", "Campus Fabric"]', null, null, '[{"title": "N2200 Configuration Guide", "url": "https://www.dell.com/support"}]', 'High-density PoE+ access switch'),
  -- Dell PowerSwitch N3200 Series
  ('N3224T-ON', 'N3200 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "24x GbE + 4x 10GbE SFP+", "forwarding": "71.4 Mpps", "switching": "96 Gbps"}', '{"data": "24x GbE + 4x 10GbE SFP+", "management": "1x Console, 1x USB", "stacking": "2x Stack"}', '["802.1X", "VLT", "L3", "BGP", "OSPF", "Multi-Auth", "Campus Fabric"]', null, null, '[{"title": "N3200 Configuration Guide", "url": "https://www.dell.com/support"}]', 'Distribution switch with L3 routing'),
  ('N3248TE-ON', 'N3200 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"]', '{"ports": "48x GbE + 4x 10GbE SFP+", "forwarding": "119 Mpps", "switching": "160 Gbps"}', '{"data": "48x GbE + 4x 10GbE SFP+", "management": "1x Console, 1x USB", "stacking": "2x Stack"}', '["802.1X", "VLT", "L3", "BGP", "OSPF", "Multi-Auth", "Campus Fabric"]', null, null, '[{"title": "N3200 Configuration Guide", "url": "https://www.dell.com/support"}]', 'High-density distribution switch'),
  -- Dell PowerSwitch Z9100 Series
  ('Z9100-ON', 'Z9100 Series', '["10.5.6.0", "10.5.5.0", "10.5.4.0"]', '{"ports": "32x 100GbE QSFP28", "forwarding": "4800 Mpps", "switching": "6.4 Tbps"}', '{"data": "32x 100GbE QSFP28", "management": "1x Console, 1x USB", "redundancy": "1+1 PSU"}', '["802.1X", "VLT", "L3", "BGP", "EVPN", "VXLAN", "Data Center Fabric"]', null, null, '[{"title": "Z9100 Configuration Guide", "url": "https://www.dell.com/support"}]', 'Data center spine/leaf switch')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, eol_date, eos_date, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Dell Technologies';

-- Add SonicWall Models
INSERT INTO vendor_models (
  vendor_id,
  model_name,
  model_series,
  firmware_versions,
  hardware_specs,
  port_configurations,
  supported_features,
  eol_date,
  eos_date,
  documentation_links,
  configuration_notes,
  created_by
)
SELECT 
  vl.id as vendor_id,
  model_data.model_name,
  model_data.model_series,
  model_data.firmware_versions::jsonb,
  model_data.hardware_specs::jsonb,
  model_data.port_configurations::jsonb,
  model_data.supported_features::jsonb,
  model_data.eol_date::date,
  model_data.eos_date::date,
  model_data.documentation_links::jsonb,
  model_data.configuration_notes,
  null
FROM vendor_library vl,
(VALUES
  -- SonicWall TZ Series
  ('TZ270', 'TZ Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "5x GbE", "throughput": "750 Mbps", "connections": "750"}', '{"wan": "1x GbE", "lan": "4x GbE", "management": "1x Console"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering"]', null, null, '[{"title": "TZ270 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'Desktop firewall for small offices'),
  ('TZ370', 'TZ Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "5x GbE", "throughput": "1 Gbps", "connections": "1000"}', '{"wan": "1x GbE", "lan": "4x GbE", "wireless": "Wi-Fi 5", "management": "1x Console"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering", "Wi-Fi"]', null, null, '[{"title": "TZ370 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'Desktop firewall with integrated Wi-Fi'),
  ('TZ470', 'TZ Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "8x GbE", "throughput": "1.5 Gbps", "connections": "1500"}', '{"wan": "2x GbE", "lan": "6x GbE", "poe": "60W", "management": "1x Console"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering", "PoE"]', null, null, '[{"title": "TZ470 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'Desktop firewall with PoE support'),
  ('TZ570', 'TZ Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "8x GbE + 2x SFP", "throughput": "2 Gbps", "connections": "2000"}', '{"wan": "2x GbE", "lan": "6x GbE", "fiber": "2x SFP", "poe": "90W"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering", "PoE+"]', null, null, '[{"title": "TZ570 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'High-performance desktop firewall'),
  -- SonicWall NSa Series
  ('NSa2700', 'NSa Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "8x GbE + 2x SFP+", "throughput": "2.6 Gbps", "connections": "15000"}', '{"wan": "2x GbE", "lan": "6x GbE", "fiber": "2x SFP+", "management": "1x Console"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering"]', null, null, '[{"title": "NSa2700 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'Branch firewall with high availability'),
  ('NSa3700', 'NSa Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "16x GbE + 4x SFP+", "throughput": "3.5 Gbps", "connections": "25000"}', '{"wan": "4x GbE", "lan": "12x GbE", "fiber": "4x SFP+", "management": "1x Console"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering"]', null, null, '[{"title": "NSa3700 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'Medium enterprise firewall'),
  ('NSa4700', 'NSa Series', '["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"]', '{"ports": "16x GbE + 4x SFP+", "throughput": "5.5 Gbps", "connections": "50000"}', '{"wan": "4x GbE", "lan": "12x GbE", "fiber": "4x SFP+", "management": "1x Console"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering", "Advanced Threat Protection"]', null, null, '[{"title": "NSa4700 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'Enterprise firewall with advanced threat protection'),
  -- SonicWall NSsp Series
  ('NSsp12400', 'NSsp Series', '["7.0.1-5035", "7.0.1-5030"]', '{"ports": "24x SFP+ + 2x QSFP+", "throughput": "11 Gbps", "connections": "1000000"}', '{"data": "24x 10GbE SFP+ + 2x 40GbE QSFP+", "management": "1x Console, 1x USB"}', '["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering", "Real-Time Deep Memory Inspection"]', null, null, '[{"title": "NSsp12400 Configuration Guide", "url": "https://www.sonicwall.com/support"}]', 'High-performance data center firewall')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, eol_date, eos_date, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'SonicWall';

-- Add Cisco Meraki Models
INSERT INTO vendor_models (
  vendor_id,
  model_name,
  model_series,
  firmware_versions,
  hardware_specs,
  port_configurations,
  supported_features,
  eol_date,
  eos_date,
  documentation_links,
  configuration_notes,
  created_by
)
SELECT 
  vl.id as vendor_id,
  model_data.model_name,
  model_data.model_series,
  model_data.firmware_versions::jsonb,
  model_data.hardware_specs::jsonb,
  model_data.port_configurations::jsonb,
  model_data.supported_features::jsonb,
  model_data.eol_date::date,
  model_data.eos_date::date,
  model_data.documentation_links::jsonb,
  model_data.configuration_notes,
  null
FROM vendor_library vl,
(VALUES
  -- Cisco Meraki MS Series Switches
  ('MS120-24', 'MS120 Series', '["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"]', '{"ports": "24x GbE + 4x SFP", "forwarding": "41.7 Mpps", "switching": "56 Gbps"}', '{"data": "24x GbE + 4x SFP", "management": "Cloud-managed", "stacking": "8 units"}', '["802.1X", "Cloud Managed", "Stacking", "Dynamic VLAN", "Multi-Auth"]', null, null, '[{"title": "MS120 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'Cloud-managed access switch with stacking'),
  ('MS120-48', 'MS120 Series', '["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"]', '{"ports": "48x GbE + 4x SFP", "forwarding": "77.4 Mpps", "switching": "104 Gbps"}', '{"data": "48x GbE + 4x SFP", "management": "Cloud-managed", "stacking": "8 units"}', '["802.1X", "Cloud Managed", "Stacking", "Dynamic VLAN", "Multi-Auth"]', null, null, '[{"title": "MS120 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'High-density cloud-managed access switch'),
  ('MS125-24', 'MS125 Series', '["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"]', '{"ports": "24x GbE + 4x SFP+", "forwarding": "59.5 Mpps", "switching": "80 Gbps", "poe": "370W"}', '{"data": "24x GbE PoE+ + 4x SFP+", "management": "Cloud-managed", "stacking": "8 units"}', '["802.1X", "Cloud Managed", "PoE+", "Stacking", "Dynamic VLAN", "Multi-Auth"]', null, null, '[{"title": "MS125 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'PoE+ access switch with cloud management'),
  ('MS125-48', 'MS125 Series', '["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"]', '{"ports": "48x GbE + 4x SFP+", "forwarding": "119 Mpps", "switching": "160 Gbps", "poe": "740W"}', '{"data": "48x GbE PoE+ + 4x SFP+", "management": "Cloud-managed", "stacking": "8 units"}', '["802.1X", "Cloud Managed", "PoE+", "Stacking", "Dynamic VLAN", "Multi-Auth"]', null, null, '[{"title": "MS125 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'High-density PoE+ access switch'),
  -- Cisco Meraki MR Series Access Points
  ('MR36', 'MR30 Series', '["MR.28.7", "MR.27.7", "MR.26.8"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE+", "bands": "2.4/5 GHz"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x GbE", "management": "Cloud"}', '["Wi-Fi 6", "4x4 MIMO", "Cloud Managed", "Location Analytics", "Air Marshal"]', null, null, '[{"title": "MR36 Deployment Guide", "url": "https://documentation.meraki.com"}]', 'Wi-Fi 6 indoor access point with location analytics'),
  ('MR46', 'MR40 Series', '["MR.28.7", "MR.27.7", "MR.26.8"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE+", "bands": "2.4/5 GHz"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x mGbE", "management": "Cloud", "ble": "Yes"}', '["Wi-Fi 6", "4x4 MIMO", "Cloud Managed", "BLE", "Location Analytics"]', null, null, '[{"title": "MR46 Deployment Guide", "url": "https://documentation.meraki.com"}]', 'Wi-Fi 6 access point with BLE beacon'),
  ('MR56', 'MR50 Series', '["MR.28.7", "MR.27.7"]', '{"radio": "Wi-Fi 6E", "mimo": "4x4", "power": "PoE++", "bands": "2.4/5/6 GHz"}', '{"wireless": "2.4/5/6 GHz", "ethernet": "1x mGbE", "management": "Cloud", "iot": "Yes"}', '["Wi-Fi 6E", "4x4 MIMO", "6GHz", "Cloud Managed", "BLE", "IoT Radio"]', null, null, '[{"title": "MR56 Deployment Guide", "url": "https://documentation.meraki.com"}]', 'Wi-Fi 6E tri-band access point with IoT radio'),
  -- Cisco Meraki MX Series Security Appliances
  ('MX67', 'MX60 Series', '["MX.17.10.2", "MX.16.16", "MX.15.44"]', '{"ports": "12x GbE", "throughput": "450 Mbps", "vpn": "100 tunnels"}', '{"wan": "2x GbE", "lan": "10x GbE", "management": "Cloud"}', '["SD-WAN", "Advanced Security", "Auto VPN", "Content Filtering", "IPS"]', null, null, '[{"title": "MX67 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'Branch security appliance with SD-WAN'),
  ('MX75', 'MX70 Series', '["MX.17.10.2", "MX.16.16", "MX.15.44"]', '{"ports": "12x GbE + 2x SFP", "throughput": "750 Mbps", "vpn": "200 tunnels"}', '{"wan": "2x GbE", "lan": "10x GbE", "fiber": "2x SFP", "management": "Cloud"}', '["SD-WAN", "Advanced Security", "Auto VPN", "Content Filtering", "IPS", "Advanced Malware Protection"]', null, null, '[{"title": "MX75 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'High-performance branch security appliance'),
  ('MX105', 'MX100 Series', '["MX.17.10.2", "MX.16.16", "MX.15.44"]', '{"ports": "8x GbE + 2x SFP+", "throughput": "1.5 Gbps", "vpn": "500 tunnels"}', '{"wan": "2x GbE", "lan": "6x GbE", "fiber": "2x SFP+", "management": "Cloud"}', '["SD-WAN", "Advanced Security", "Auto VPN", "Content Filtering", "IPS", "Advanced Malware Protection", "HA"]', null, null, '[{"title": "MX105 Configuration Guide", "url": "https://documentation.meraki.com"}]', 'Enterprise security appliance with high availability')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, eol_date, eos_date, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Cisco Meraki';

-- Add Ubiquiti Models
INSERT INTO vendor_models (
  vendor_id,
  model_name,
  model_series,
  firmware_versions,
  hardware_specs,
  port_configurations,
  supported_features,
  eol_date,
  eos_date,
  documentation_links,
  configuration_notes,
  created_by
)
SELECT 
  vl.id as vendor_id,
  model_data.model_name,
  model_data.model_series,
  model_data.firmware_versions::jsonb,
  model_data.hardware_specs::jsonb,
  model_data.port_configurations::jsonb,
  model_data.supported_features::jsonb,
  model_data.eol_date::date,
  model_data.eos_date::date,
  model_data.documentation_links::jsonb,
  model_data.configuration_notes,
  null
FROM vendor_library vl,
(VALUES
  -- Ubiquiti UniFi Switch Enterprise
  ('USW-Enterprise-24-PoE', 'Enterprise Series', '["6.5.59", "6.2.26", "6.0.45"]', '{"ports": "24x GbE + 2x SFP+", "forwarding": "41.7 Mpps", "switching": "56 Gbps", "poe": "400W"}', '{"data": "24x GbE PoE++ + 2x SFP+", "management": "UniFi Controller"}', '["802.1X", "VLAN", "PoE++", "UniFi Controller", "Multi-Auth"]', null, null, '[{"title": "USW-Enterprise Configuration", "url": "https://help.ui.com"}]', 'Enterprise PoE++ switch with advanced 802.1X'),
  ('USW-Enterprise-48-PoE', 'Enterprise Series', '["6.5.59", "6.2.26", "6.0.45"]', '{"ports": "48x GbE + 4x SFP+", "forwarding": "77.4 Mpps", "switching": "104 Gbps", "poe": "800W"}', '{"data": "48x GbE PoE++ + 4x SFP+", "management": "UniFi Controller"}', '["802.1X", "VLAN", "PoE++", "UniFi Controller", "Multi-Auth"]', null, null, '[{"title": "USW-Enterprise Configuration", "url": "https://help.ui.com"}]', 'High-density enterprise PoE++ switch'),
  -- Ubiquiti UniFi Switch Pro
  ('USW-Pro-24', 'Pro Series', '["6.5.59", "6.2.26", "6.0.45"]', '{"ports": "24x GbE + 2x SFP+", "forwarding": "41.7 Mpps", "switching": "56 Gbps"}', '{"data": "24x GbE + 2x SFP+", "management": "UniFi Controller", "layer3": "Yes"}', '["802.1X", "VLAN", "L3", "UniFi Controller"]', null, null, '[{"title": "USW-Pro Configuration", "url": "https://help.ui.com"}]', 'Layer 3 managed switch with 802.1X'),
  ('USW-Pro-48', 'Pro Series', '["6.5.59", "6.2.26", "6.0.45"]', '{"ports": "48x GbE + 4x SFP+", "forwarding": "77.4 Mpps", "switching": "104 Gbps"}', '{"data": "48x GbE + 4x SFP+", "management": "UniFi Controller", "layer3": "Yes"}', '["802.1X", "VLAN", "L3", "UniFi Controller"]', null, null, '[{"title": "USW-Pro Configuration", "url": "https://help.ui.com"}]', 'High-density Layer 3 switch'),
  -- Ubiquiti UniFi Access Points
  ('U6-Enterprise', 'WiFi 6 Series', '["6.5.59", "6.2.26", "6.0.45"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE++", "bands": "2.4/5 GHz"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x 2.5GbE", "management": "UniFi Controller"}', '["Wi-Fi 6", "4x4 MIMO", "2.5GbE", "PoE++", "UniFi Controller"]', null, null, '[{"title": "U6-Enterprise Setup", "url": "https://help.ui.com"}]', 'High-performance Wi-Fi 6 access point'),
  ('U6-Pro', 'WiFi 6 Series', '["6.5.59", "6.2.26", "6.0.45"]', '{"radio": "Wi-Fi 6", "mimo": "4x4", "power": "PoE+", "bands": "2.4/5 GHz"}', '{"wireless": "2.4/5 GHz", "ethernet": "1x 2.5GbE", "management": "UniFi Controller"}', '["Wi-Fi 6", "4x4 MIMO", "2.5GbE", "PoE+", "UniFi Controller"]', null, null, '[{"title": "U6-Pro Setup", "url": "https://help.ui.com"}]', 'Professional Wi-Fi 6 access point'),
  -- Ubiquiti UniFi Dream Machine
  ('UDM-Pro', 'Dream Machine', '["3.2.9", "3.1.15", "2.4.27"]', '{"ports": "8x GbE + 2x SFP+", "throughput": "3.5 Gbps", "ram": "4GB"}', '{"wan": "1x GbE/SFP+", "lan": "7x GbE + 1x SFP+", "management": "Built-in Controller"}', '["Firewall", "IPS", "DPI", "VPN", "UniFi Controller", "Protect"]', null, null, '[{"title": "UDM-Pro Configuration", "url": "https://help.ui.com"}]', 'All-in-one security gateway with UniFi controller'),
  ('UDM-Pro-Max', 'Dream Machine', '["3.2.9", "3.1.15"]', '{"ports": "8x GbE + 2x SFP+", "throughput": "3.5 Gbps", "ram": "6GB", "poe": "196W"}', '{"wan": "1x GbE/SFP+", "lan": "7x GbE PoE++ + 1x SFP+", "management": "Built-in Controller"}', '["Firewall", "IPS", "DPI", "VPN", "UniFi Controller", "Protect", "PoE++"]', null, null, '[{"title": "UDM-Pro-Max Configuration", "url": "https://help.ui.com"}]', 'Advanced security gateway with PoE++ and built-in NVR')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, eol_date, eos_date, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Ubiquiti';