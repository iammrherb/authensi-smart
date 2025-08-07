-- Fix RLS policies and add configuration templates

-- First, let's just fix the RLS policies for existing tables
DROP POLICY IF EXISTS "Enhanced vendor viewing" ON vendor_library;
DROP POLICY IF EXISTS "Users can create vendors" ON vendor_library;
DROP POLICY IF EXISTS "Users can update vendors" ON vendor_library;

CREATE POLICY "Users can view all vendors" 
ON vendor_library 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage vendors" 
ON vendor_library 
FOR ALL 
USING (true);

-- Add comprehensive configuration templates
INSERT INTO configuration_templates (name, description, category, subcategory, configuration_type, template_content, complexity_level, template_variables, tags, validation_commands, best_practices, is_public) VALUES
('Cisco WLC 802.1X Configuration', 'Complete 802.1X configuration for Cisco Wireless LAN Controller', '802.1X', 'Wireless', 'authentication', 
'! Cisco WLC 802.1X Configuration
! RADIUS Server Configuration
config radius auth add 1 {{radius_server_ip}} 1812 ascii {{shared_secret}}
config radius auth mgmt-type radius-with-coa enable 1

! WLAN Configuration  
config wlan create {{wlan_id}} {{ssid_name}}
config wlan security wpa akm 802.1x enable {{wlan_id}}
config wlan security wpa akm psk disable {{wlan_id}}
config wlan security encryption-type aes enable {{wlan_id}}
config wlan radius_server auth add {{wlan_id}} 1
config wlan enable {{wlan_id}}',
'intermediate',
'{"radius_server_ip": "192.168.1.100", "shared_secret": "your_shared_secret", "wlan_id": "1", "ssid_name": "SecureWiFi"}',
'["802.1X", "Wireless", "RADIUS", "WLC"]',
'["show radius summary", "show wlan summary", "show client summary"]',
'["Test RADIUS connectivity before deploying", "Use monitor sessions for troubleshooting", "Implement gradual rollout"]',
true),

('Aruba Switch 802.1X Configuration', 'Complete 802.1X port-based authentication for Aruba switches', '802.1X', 'Wired', 'authentication',
'! Aruba Switch 802.1X Configuration
! RADIUS Configuration
radius-server host {{radius_server_ip}} key {{shared_secret}}
aaa authentication port-access dot1x authenticator radius
aaa authentication port-access mac-auth radius

! Global 802.1X Settings
aaa port-access authenticator enable
aaa port-access mac-auth enable
aaa port-access client-limit 8

! Interface Configuration
interface {{interface_range}}
   aaa port-access authenticator
   aaa port-access authenticator client-limit 2
   aaa port-access mac-auth
   aaa port-access mac-auth addr-format no-delimiter upper-case',
'intermediate',
'{"radius_server_ip": "192.168.1.100", "shared_secret": "your_shared_secret", "interface_range": "1/1/1-1/1/48"}',
'["802.1X", "Wired", "RADIUS", "Port-based"]',
'["show port-access clients", "show radius statistics", "show aaa authentication port-access"]',
'["Configure backup authentication methods", "Use MAC authentication for IoT devices", "Monitor authentication logs"]',
true),

('Fortinet FortiGate RADIUS Integration', 'FortiGate firewall integration with RADIUS for user authentication', 'Security', 'Firewall', 'authentication',
'# FortiGate RADIUS Configuration
config user radius
    edit "{{radius_server_name}}"
        set server "{{radius_server_ip}}"
        set secret {{shared_secret}}
        set auth-type auto
        set rsso enable
        set sso-attribute-key "User-Name"
    next
end

config user group
    edit "{{user_group_name}}"
        set member "{{radius_server_name}}"
    next
end

config authentication policy
    edit 1
        set name "RADIUS_Auth"
        set srcintf "{{source_interface}}"
        set srcaddr "all"
        set dstintf "{{dest_interface}}"
        set dstaddr "all"
        set groups "{{user_group_name}}"
        set schedule "always"
        set service "ALL"
        set action accept
    next
end',
'advanced',
'{"radius_server_name": "RADIUS-Server", "radius_server_ip": "192.168.1.100", "shared_secret": "fortinet_secret", "user_group_name": "Authenticated_Users", "source_interface": "internal", "dest_interface": "wan1"}',
'["RADIUS", "Firewall", "Authentication", "RSSO"]',
'["diagnose test authserver radius", "get user radius", "diagnose debug authd 8"]',
'["Test authentication before production", "Configure RSSO for Single Sign-On", "Monitor authentication logs"]',
true),

('Palo Alto Networks 802.1X Configuration', 'Comprehensive 802.1X configuration for Palo Alto Networks firewalls', 'Security', 'Firewall', 'authentication',
'# Palo Alto Networks 802.1X Configuration
set shared server-profile radius {{radius_profile_name}} protocol RADIUS server {{radius_server_ip}} secret {{shared_secret}} port 1812
set shared server-profile radius {{radius_profile_name}} protocol RADIUS timeout 3
set shared server-profile radius {{radius_profile_name}} protocol RADIUS retries 3

set shared authentication-profile {{auth_profile_name}} method radius
set shared authentication-profile {{auth_profile_name}} server-profile {{radius_profile_name}}

set network interface ethernet {{interface_name}} layer3 ip {{interface_ip}}/{{subnet_mask}}
set network interface ethernet {{interface_name}} layer3 interface-management-profile allow-radius

set device-group {{device_group}} devices {{device_serial}}',
'advanced',
'{"radius_profile_name": "RADIUS-Profile", "radius_server_ip": "192.168.1.100", "shared_secret": "palo_secret", "auth_profile_name": "Auth-Profile", "interface_name": "ethernet1/1", "interface_ip": "192.168.100.1", "subnet_mask": "24", "device_group": "Device-Group", "device_serial": "123456789"}',
'["RADIUS", "802.1X", "Firewall", "Authentication"]',
'["show authentication-profile", "show server-profile", "test authentication authentication-profile"]',
'["Verify RADIUS connectivity", "Configure backup authentication", "Test with known good credentials"]',
true),

('Splunk Universal Forwarder Config', 'Universal forwarder configuration for sending data to Splunk indexers', 'Monitoring', 'SIEM', 'logging',
'# Splunk Universal Forwarder Configuration
# inputs.conf
[monitor://{{log_directory}}]
disabled = false
index = {{index_name}}
sourcetype = {{sourcetype}}

[monitor://{{radius_log_path}}]
disabled = false  
index = radius
sourcetype = radius:auth

# outputs.conf
[tcpout]
defaultGroup = primary_indexers

[tcpout:primary_indexers]
server = {{indexer_ip}}:9997
compressed = true',
'beginner',
'{"log_directory": "/var/log/portnox", "index_name": "network_auth", "sourcetype": "portnox:auth", "radius_log_path": "/var/log/radius/radius.log", "indexer_ip": "192.168.1.200"}',
'["Splunk", "Logging", "Forwarder", "SIEM"]',
'["./splunk list forward-server", "./splunk list monitor", "./splunk list index"]',
'["Test connectivity to indexers", "Monitor forwarder performance", "Use appropriate sourcetypes"]',
true),

('QRadar DSM Configuration', 'QRadar Device Support Module configuration for network authentication logs', 'Monitoring', 'SIEM', 'logging',
'# QRadar DSM Configuration for Network Authentication
# Log Source Configuration
Log Source Name: {{device_name}}
Log Source Type: {{device_type}}
Protocol: Syslog
Log Source Identifier: {{device_ip}}

# Event Parsing Rules
<14>{{timestamp}} {{hostname}} {{process}}: Authentication {{status}} for user {{username}} from {{client_ip}} using {{auth_method}}

# Property Mapping
sourceip={{client_ip}}
destinationip={{server_ip}}
username={{username}}
eventname=Authentication {{status}}
category={{auth_category}}',
'intermediate',
'{"device_name": "Portnox-CLEAR", "device_type": "Portnox Network Access Control", "device_ip": "192.168.1.150", "timestamp": "timestamp", "hostname": "hostname", "process": "process", "status": "status", "username": "username", "client_ip": "client_ip", "auth_method": "method", "server_ip": "server_ip", "auth_category": "1003"}',
'["QRadar", "DSM", "SIEM", "Authentication"]',
'["Test Event Processing", "View Event Details", "Check Custom Properties"]',
'["Validate log format", "Test with sample events", "Monitor parsing performance"]',
true);

-- Update RLS policies for config templates
DROP POLICY IF EXISTS "Public config templates are readable by authenticated users" ON configuration_templates;
DROP POLICY IF EXISTS "Users can create config templates" ON configuration_templates;
DROP POLICY IF EXISTS "Users can delete their own config templates" ON configuration_templates;
DROP POLICY IF EXISTS "Users can update their own config templates" ON configuration_templates;

CREATE POLICY "Users can view all config templates" 
ON configuration_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage config templates" 
ON configuration_templates 
FOR ALL 
USING (true);