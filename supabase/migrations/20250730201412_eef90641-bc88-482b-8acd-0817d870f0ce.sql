-- Clear existing vendor models to avoid duplicates
DELETE FROM vendor_models WHERE vendor_id IN (
    SELECT id FROM vendor_library WHERE vendor_name IN ('Cisco Systems', 'Aruba Networks (HPE)', 'Juniper Networks', 'Extreme Networks', 'HPE Aruba Switching', 'Fortinet', 'Palo Alto Networks', 'Dell Technologies')
);

-- Cisco Systems Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('Catalyst 9300', 'Catalyst 9300 Series', '["16.12.04", "17.03.04", "17.06.03"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-52", "mgmt_port": "gi0/0"}'::text, ARRAY['802.1X', 'MAB', 'WebAuth', 'DACL', 'VLAN Assignment'], '[]'::text, 'Supports full 802.1X with dynamic VLAN assignment'),
    ('Catalyst 9200', 'Catalyst 9200 Series', '["16.12.04", "17.03.04"]'::text, '{"ports": "24/48", "poe": "370W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-52"}'::text, ARRAY['802.1X', 'MAB', 'WebAuth', 'DACL'], '[]'::text, 'Entry-level with basic 802.1X support'),
    ('Catalyst 9400', 'Catalyst 9400 Series', '["16.12.04", "17.03.04", "17.06.03"]'::text, '{"ports": "modular", "poe": "up to 6kW", "chassis": "4-13 slots"}'::text, '{"line_cards": "various", "supervisor": "required"}'::text, ARRAY['802.1X', 'MAB', 'WebAuth', 'DACL', 'VLAN Assignment', 'SGT'], '[]'::text, 'Modular chassis with advanced security features'),
    ('Catalyst 9500', 'Catalyst 9500 Series', '["16.12.04", "17.03.04", "17.06.03"]'::text, '{"ports": "modular", "poe": "up to 12kW", "chassis": "4-16 slots"}'::text, '{"line_cards": "various", "supervisor": "dual"}'::text, ARRAY['802.1X', 'MAB', 'WebAuth', 'DACL', 'VLAN Assignment', 'SGT', 'MACsec'], '[]'::text, 'High-end modular with full security suite'),
    ('Catalyst 3850', 'Catalyst 3850 Series', '["16.12.04", "16.09.08"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-52"}'::text, ARRAY['802.1X', 'MAB', 'WebAuth', 'DACL', 'VLAN Assignment'], '[]'::text, 'Legacy model with good 802.1X support'),
    ('ISR 4000', 'ISR 4000 Series', '["16.12.04", "17.03.04"]'::text, '{"wan_ports": "2-4", "lan_ports": "4-8", "modules": "NIM slots"}'::text, '{"wan": "GE/10GE", "lan": "GE", "usb": "2x USB"}'::text, ARRAY['802.1X', 'FlexVPN', 'ZBFW'], '[]'::text, 'Integrated services router with 802.1X client support'),
    ('ASR 1000', 'ASR 1000 Series', '["16.12.04", "17.03.04"]'::text, '{"throughput": "2.5-200 Gbps", "ports": "modular", "redundancy": "dual RP"}'::text, '{"spa_bays": "2-12", "route_processor": "dual"}'::text, ARRAY['802.1X Client', 'FlexVPN', 'MACsec'], '[]'::text, 'Aggregation router with 802.1X client capabilities')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Cisco Systems';

-- Aruba/HPE Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('CX 6300', 'CX 6300 Series', '["10.09", "10.10", "10.11"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "1/1/1-48", "uplink_ports": "1/1/49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication', 'DPSK'], '[]'::text, 'Advanced switch with full NAC integration'),
    ('CX 6200', 'CX 6200 Series', '["10.09", "10.10"]'::text, '{"ports": "24/48", "poe": "370W", "stacking": true}'::text, '{"access_ports": "1/1/1-48", "uplink_ports": "1/1/49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication'], '[]'::text, 'Mid-range with standard 802.1X support'),
    ('CX 8300', 'CX 8300 Series', '["10.09", "10.10", "10.11"]'::text, '{"ports": "modular", "poe": "up to 4kW", "chassis": "6-8 slots"}'::text, '{"line_cards": "various", "management": "dual"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication', 'DPSK', 'Tunnel forwarding'], '[]'::text, 'Modular chassis with advanced security'),
    ('2930F', '2930F Series', '["16.10", "16.11"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication'], '[]'::text, 'Legacy ProCurve with 802.1X support'),
    ('5400R', '5400R Series', '["16.10", "16.11"]'::text, '{"ports": "modular", "poe": "up to 2.4kW", "chassis": "4-8 slots"}'::text, '{"line_cards": "various", "management": "dual"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication', 'VLAN Assignment'], '[]'::text, 'Modular switch with enterprise features')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name IN ('Aruba Networks (HPE)', 'HPE Aruba Switching');

-- Juniper Networks Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('EX4300', 'EX4300 Series', '["20.4R3", "21.4R3", "22.4R1"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "ge-0/0/0-47", "uplink_ports": "xe-0/1/0-3"}'::text, ARRAY['802.1X', 'MAC RADIUS', 'Captive Portal', 'DHCP Snooping'], '[]'::text, 'Enterprise access switch with comprehensive 802.1X'),
    ('EX4400', 'EX4400 Series', '["20.4R3", "21.4R3", "22.4R1"]'::text, '{"ports": "24/48", "poe": "950W", "stacking": true}'::text, '{"access_ports": "ge-0/0/0-47", "uplink_ports": "xe-0/1/0-3"}'::text, ARRAY['802.1X', 'MAC RADIUS', 'Captive Portal', 'DHCP Snooping', 'MACsec'], '[]'::text, 'Next-gen access with enhanced security'),
    ('EX4600', 'EX4600 Series', '["20.4R3", "21.4R3"]'::text, '{"ports": "24/48", "poe": "1440W", "stacking": true}'::text, '{"access_ports": "xe-0/0/0-47", "uplink_ports": "et-0/1/0-3"}'::text, ARRAY['802.1X', 'MAC RADIUS', 'Captive Portal', 'MACsec', 'Encrypted Control Protocol'], '[]'::text, 'High-density 10GbE access switch'),
    ('QFX5100', 'QFX5100 Series', '["20.4R3", "21.4R3"]'::text, '{"ports": "48x10GbE + 6x40GbE", "poe": "none", "form_factor": "1RU"}'::text, '{"access_ports": "xe-0/0/0-47", "uplink_ports": "et-0/0/48-53"}'::text, ARRAY['802.1X', 'MAC RADIUS'], '[]'::text, 'Top-of-rack switch with basic 802.1X')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Juniper Networks';

-- Extreme Networks Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('X435', 'X435 Series', '["32.3", "32.4", "32.5"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-54"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web-based Authentication', 'NEAP'], '[]'::text, 'Enterprise access with advanced NAC'),
    ('X440-G2', 'X440-G2 Series', '["32.3", "32.4"]'::text, '{"ports": "24/48", "poe": "740W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-54"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web-based Authentication'], '[]'::text, 'Reliable access switch with 802.1X'),
    ('X590', 'X590 Series', '["32.3", "32.4", "32.5"]'::text, '{"ports": "48x1GbE + 8x10GbE", "poe": "none", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-56"}'::text, ARRAY['802.1X', 'MAC Authentication'], '[]'::text, 'Aggregation switch with basic 802.1X'),
    ('X465', 'X465 Series', '["32.4", "32.5"]'::text, '{"ports": "24/48", "poe": "950W", "stacking": true}'::text, '{"access_ports": "1-48", "uplink_ports": "49-56"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web-based Authentication', 'NEAP'], '[]'::text, 'Latest generation with full security features')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Extreme Networks';

-- Fortinet Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('FortiGate 60F', 'FortiGate 60 Series', '["7.0.12", "7.2.6", "7.4.1"]'::text, '{"wan_ports": 2, "lan_ports": 5, "wifi": "802.11ac"}'::text, '{"wan": "wan1, wan2", "lan": "internal1-5", "dmz": "dmz"}'::text, ARRAY['802.1X Authenticator', 'RADIUS Client', 'LDAP Authentication'], '[]'::text, 'SOHO firewall with 802.1X support'),
    ('FortiGate 100F', 'FortiGate 100 Series', '["7.0.12", "7.2.6", "7.4.1"]'::text, '{"wan_ports": 2, "lan_ports": 14, "expansion": "2x SFP"}'::text, '{"wan": "wan1, wan2", "lan": "internal1-14", "expansion": "2x SFP"}'::text, ARRAY['802.1X Authenticator', 'RADIUS Client', 'LDAP Authentication', 'FortiAuthenticator Integration'], '[]'::text, 'SMB firewall with enhanced authentication'),
    ('FortiGate 200F', 'FortiGate 200 Series', '["7.0.12", "7.2.6", "7.4.1"]'::text, '{"wan_ports": 2, "lan_ports": 16, "expansion": "4x SFP+"}'::text, '{"wan": "wan1, wan2", "lan": "internal1-16", "expansion": "4x SFP+"}'::text, ARRAY['802.1X Authenticator', 'RADIUS Client', 'LDAP Authentication', 'FortiAuthenticator Integration'], '[]'::text, 'Mid-range with comprehensive NAC features'),
    ('FortiSwitch 148F-POE', 'FortiSwitch 100 Series', '["7.0.6", "7.2.3"]'::text, '{"ports": "48x1GbE + 4x10GbE SFP+", "poe": "740W", "managed_by": "FortiGate"}'::text, '{"access_ports": "1-48", "uplink_ports": "49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'FortiLink'], '[]'::text, 'Managed switch with integrated 802.1X')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Fortinet';

-- Palo Alto Networks Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('PA-220', 'PA-200 Series', '["10.2.4", "11.0.1", "11.1.1"]'::text, '{"ports": "8x1GbE", "throughput": "1 Gbps", "form_factor": "desktop"}'::text, '{"zones": "trust, untrust, dmz", "interfaces": "ethernet1/1-8"}'::text, ARRAY['User-ID', 'RADIUS Authentication', 'LDAP', '802.1X Monitoring'], '[]'::text, 'Entry-level NGFW with 802.1X monitoring'),
    ('PA-820', 'PA-800 Series', '["10.2.4", "11.0.1", "11.1.1"]'::text, '{"ports": "8x1GbE + 2x10GbE SFP+", "throughput": "2 Gbps", "form_factor": "1RU"}'::text, '{"zones": "configurable", "interfaces": "ethernet1/1-10"}'::text, ARRAY['User-ID', 'RADIUS Authentication', 'LDAP', '802.1X Monitoring', 'GlobalProtect'], '[]'::text, 'Branch office NGFW with User-ID'),
    ('PA-3220', 'PA-3200 Series', '["10.2.4", "11.0.1", "11.1.1"]'::text, '{"ports": "16x1GbE + 4x10GbE SFP+", "throughput": "5.5 Gbps", "form_factor": "2RU"}'::text, '{"zones": "configurable", "interfaces": "ethernet1/1-20"}'::text, ARRAY['User-ID', 'RADIUS Authentication', 'LDAP', '802.1X Monitoring', 'GlobalProtect', 'WildFire'], '[]'::text, 'Mid-range NGFW with advanced threat protection'),
    ('PA-5220', 'PA-5200 Series', '["10.2.4", "11.0.1", "11.1.1"]'::text, '{"ports": "modular", "throughput": "52 Gbps", "form_factor": "3RU"}'::text, '{"zones": "configurable", "interfaces": "modular"}'::text, ARRAY['User-ID', 'RADIUS Authentication', 'LDAP', '802.1X Monitoring', 'GlobalProtect', 'WildFire', 'Panorama'], '[]'::text, 'High-performance NGFW with centralized management')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Palo Alto Networks';

-- Dell Technologies Models
INSERT INTO vendor_models (vendor_id, model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
SELECT 
    vl.id,
    model_data.model_name,
    model_data.model_series,
    model_data.firmware_versions::jsonb,
    model_data.hardware_specs::jsonb,
    model_data.port_configurations::jsonb,
    model_data.supported_features,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('N1548P', 'N1500 Series', '["10.5.3", "10.5.4"]'::text, '{"ports": "48x1GbE + 4x10GbE SFP+", "poe": "740W", "stacking": false}'::text, '{"access_ports": "te1/0/1-48", "uplink_ports": "te1/0/49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication'], '[]'::text, 'Smart managed switch with 802.1X'),
    ('N2048P', 'N2000 Series', '["10.5.3", "10.5.4", "10.5.5"]'::text, '{"ports": "48x1GbE + 4x10GbE SFP+", "poe": "740W", "stacking": true}'::text, '{"access_ports": "te1/0/1-48", "uplink_ports": "te1/0/49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication', 'VLAN Assignment'], '[]'::text, 'Full managed with dynamic VLAN assignment'),
    ('N3248TE-ON', 'N3200 Series', '["10.5.3", "10.5.4", "10.5.5"]'::text, '{"ports": "48x1GbE + 4x10GbE SFP+", "poe": "none", "stacking": true}'::text, '{"access_ports": "te1/0/1-48", "uplink_ports": "te1/0/49-52"}'::text, ARRAY['802.1X', 'MAC Authentication', 'Web Authentication', 'VLAN Assignment'], '[]'::text, 'Enterprise switch with comprehensive NAC'),
    ('S4148T-ON', 'S4100 Series', '["10.5.3", "10.5.4", "10.5.5"]'::text, '{"ports": "48x1GbE + 6x100GbE QSFP28", "poe": "none", "stacking": true}'::text, '{"access_ports": "te1/0/1-48", "uplink_ports": "hundredGigE1/49-54"}'::text, ARRAY['802.1X', 'MAC Authentication', 'VLAN Assignment'], '[]'::text, 'High-density ToR with 802.1X support')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Dell Technologies';