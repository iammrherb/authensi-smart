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
    model_data.supported_features::jsonb,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('Catalyst 9300', 'Catalyst 9300 Series', '["16.12.04", "17.03.04", "17.06.03"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-52", "mgmt_port": "gi0/0"}', '["802.1X", "MAB", "WebAuth", "DACL", "VLAN Assignment"]', '[]', 'Supports full 802.1X with dynamic VLAN assignment'),
    ('Catalyst 9200', 'Catalyst 9200 Series', '["16.12.04", "17.03.04"]', '{"ports": "24/48", "poe": "370W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-52"}', '["802.1X", "MAB", "WebAuth", "DACL"]', '[]', 'Entry-level with basic 802.1X support'),
    ('Catalyst 9400', 'Catalyst 9400 Series', '["16.12.04", "17.03.04", "17.06.03"]', '{"ports": "modular", "poe": "up to 6kW", "chassis": "4-13 slots"}', '{"line_cards": "various", "supervisor": "required"}', '["802.1X", "MAB", "WebAuth", "DACL", "VLAN Assignment", "SGT"]', '[]', 'Modular chassis with advanced security features'),
    ('Catalyst 9500', 'Catalyst 9500 Series', '["16.12.04", "17.03.04", "17.06.03"]', '{"ports": "modular", "poe": "up to 12kW", "chassis": "4-16 slots"}', '{"line_cards": "various", "supervisor": "dual"}', '["802.1X", "MAB", "WebAuth", "DACL", "VLAN Assignment", "SGT", "MACsec"]', '[]', 'High-end modular with full security suite'),
    ('Catalyst 3850', 'Catalyst 3850 Series', '["16.12.04", "16.09.08"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-52"}', '["802.1X", "MAB", "WebAuth", "DACL", "VLAN Assignment"]', '[]', 'Legacy model with good 802.1X support'),
    ('ISR 4000', 'ISR 4000 Series', '["16.12.04", "17.03.04"]', '{"wan_ports": "2-4", "lan_ports": "4-8", "modules": "NIM slots"}', '{"wan": "GE/10GE", "lan": "GE", "usb": "2x USB"}', '["802.1X", "FlexVPN", "ZBFW"]', '[]', 'Integrated services router with 802.1X client support'),
    ('ASR 1000', 'ASR 1000 Series', '["16.12.04", "17.03.04"]', '{"throughput": "2.5-200 Gbps", "ports": "modular", "redundancy": "dual RP"}', '{"spa_bays": "2-12", "route_processor": "dual"}', '["802.1X Client", "FlexVPN", "MACsec"]', '[]', 'Aggregation router with 802.1X client capabilities')
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
    model_data.supported_features::jsonb,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('CX 6300', 'CX 6300 Series', '["10.09", "10.10", "10.11"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "1/1/1-48", "uplink_ports": "1/1/49-52"}', '["802.1X", "MAC Authentication", "Web Authentication", "DPSK"]', '[]', 'Advanced switch with full NAC integration'),
    ('CX 6200', 'CX 6200 Series', '["10.09", "10.10"]', '{"ports": "24/48", "poe": "370W", "stacking": true}', '{"access_ports": "1/1/1-48", "uplink_ports": "1/1/49-52"}', '["802.1X", "MAC Authentication", "Web Authentication"]', '[]', 'Mid-range with standard 802.1X support'),
    ('CX 8300', 'CX 8300 Series', '["10.09", "10.10", "10.11"]', '{"ports": "modular", "poe": "up to 4kW", "chassis": "6-8 slots"}', '{"line_cards": "various", "management": "dual"}', '["802.1X", "MAC Authentication", "Web Authentication", "DPSK", "Tunnel forwarding"]', '[]', 'Modular chassis with advanced security'),
    ('2930F', '2930F Series', '["16.10", "16.11"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-52"}', '["802.1X", "MAC Authentication", "Web Authentication"]', '[]', 'Legacy ProCurve with 802.1X support'),
    ('5400R', '5400R Series', '["16.10", "16.11"]', '{"ports": "modular", "poe": "up to 2.4kW", "chassis": "4-8 slots"}', '{"line_cards": "various", "management": "dual"}', '["802.1X", "MAC Authentication", "Web Authentication", "VLAN Assignment"]', '[]', 'Modular switch with enterprise features')
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
    model_data.supported_features::jsonb,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('EX4300', 'EX4300 Series', '["20.4R3", "21.4R3", "22.4R1"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "ge-0/0/0-47", "uplink_ports": "xe-0/1/0-3"}', '["802.1X", "MAC RADIUS", "Captive Portal", "DHCP Snooping"]', '[]', 'Enterprise access switch with comprehensive 802.1X'),
    ('EX4400', 'EX4400 Series', '["20.4R3", "21.4R3", "22.4R1"]', '{"ports": "24/48", "poe": "950W", "stacking": true}', '{"access_ports": "ge-0/0/0-47", "uplink_ports": "xe-0/1/0-3"}', '["802.1X", "MAC RADIUS", "Captive Portal", "DHCP Snooping", "MACsec"]', '[]', 'Next-gen access with enhanced security'),
    ('EX4600', 'EX4600 Series', '["20.4R3", "21.4R3"]', '{"ports": "24/48", "poe": "1440W", "stacking": true}', '{"access_ports": "xe-0/0/0-47", "uplink_ports": "et-0/1/0-3"}', '["802.1X", "MAC RADIUS", "Captive Portal", "MACsec", "Encrypted Control Protocol"]', '[]', 'High-density 10GbE access switch'),
    ('QFX5100', 'QFX5100 Series', '["20.4R3", "21.4R3"]', '{"ports": "48x10GbE + 6x40GbE", "poe": "none", "form_factor": "1RU"}', '{"access_ports": "xe-0/0/0-47", "uplink_ports": "et-0/0/48-53"}', '["802.1X", "MAC RADIUS"]', '[]', 'Top-of-rack switch with basic 802.1X')
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
    model_data.supported_features::jsonb,
    model_data.documentation_links::jsonb,
    model_data.configuration_notes
FROM vendor_library vl,
(VALUES
    ('X435', 'X435 Series', '["32.3", "32.4", "32.5"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-54"}', '["802.1X", "MAC Authentication", "Web-based Authentication", "NEAP"]', '[]', 'Enterprise access with advanced NAC'),
    ('X440-G2', 'X440-G2 Series', '["32.3", "32.4"]', '{"ports": "24/48", "poe": "740W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-54"}', '["802.1X", "MAC Authentication", "Web-based Authentication"]', '[]', 'Reliable access switch with 802.1X'),
    ('X590', 'X590 Series', '["32.3", "32.4", "32.5"]', '{"ports": "48x1GbE + 8x10GbE", "poe": "none", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-56"}', '["802.1X", "MAC Authentication"]', '[]', 'Aggregation switch with basic 802.1X'),
    ('X465', 'X465 Series', '["32.4", "32.5"]', '{"ports": "24/48", "poe": "950W", "stacking": true}', '{"access_ports": "1-48", "uplink_ports": "49-56"}', '["802.1X", "MAC Authentication", "Web-based Authentication", "NEAP"]', '[]', 'Latest generation with full security features')
) AS model_data(model_name, model_series, firmware_versions, hardware_specs, port_configurations, supported_features, documentation_links, configuration_notes)
WHERE vl.vendor_name = 'Extreme Networks';