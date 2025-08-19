-- Add more comprehensive configuration templates for additional vendors

-- Meraki MX Security Appliance
INSERT INTO configuration_templates (
  name, 
  description, 
  category, 
  subcategory,
  configuration_type,
  complexity_level,
  template_content,
  template_variables,
  supported_scenarios,
  authentication_methods,
  required_features,
  network_requirements,
  security_features,
  best_practices,
  troubleshooting_guide,
  validation_commands,
  tags,
  is_public,
  is_validated,
  template_structure,
  wizard_parameters
) VALUES (
  'Meraki MX 802.1X Configuration',
  'Complete 802.1X authentication setup for Cisco Meraki MX Security Appliances with RADIUS integration',
  'security',
  'network_access_control',
  'device_configuration',
  'intermediate',
  '# Meraki MX 802.1X Configuration
# Configure RADIUS authentication for network access control

# Network Settings
network_access_control:
  enabled: true
  mode: "802.1x"
  authentication_method: "eap-tls"

# RADIUS Configuration
radius_servers:
  - server: "{{radius_primary_server}}"
    port: {{radius_port}}
    secret: "{{radius_shared_secret}}"
    timeout: {{radius_timeout}}
  - server: "{{radius_secondary_server}}"
    port: {{radius_port}}
    secret: "{{radius_shared_secret}}"
    timeout: {{radius_timeout}}

# Security Policy
security_policy:
  guest_vlan: {{guest_vlan_id}}
  auth_vlan: {{authenticated_vlan_id}}
  quarantine_vlan: {{quarantine_vlan_id}}
  
# Advanced Settings
advanced_settings:
  mac_bypass: {{enable_mac_bypass}}
  captive_portal: {{enable_captive_portal}}
  certificate_validation: {{validate_certificates}}',
  '{
    "radius_primary_server": {"type": "string", "required": true, "description": "Primary RADIUS server IP"},
    "radius_secondary_server": {"type": "string", "required": false, "description": "Secondary RADIUS server IP"},
    "radius_port": {"type": "number", "default": 1812, "description": "RADIUS authentication port"},
    "radius_shared_secret": {"type": "string", "required": true, "description": "RADIUS shared secret"},
    "radius_timeout": {"type": "number", "default": 5, "description": "RADIUS timeout in seconds"},
    "guest_vlan_id": {"type": "number", "required": true, "description": "Guest VLAN ID"},
    "authenticated_vlan_id": {"type": "number", "required": true, "description": "Authenticated users VLAN ID"},
    "quarantine_vlan_id": {"type": "number", "required": true, "description": "Quarantine VLAN ID"},
    "enable_mac_bypass": {"type": "boolean", "default": false, "description": "Enable MAC address bypass"},
    "enable_captive_portal": {"type": "boolean", "default": true, "description": "Enable captive portal"},
    "validate_certificates": {"type": "boolean", "default": true, "description": "Validate client certificates"}
  }',
  '["enterprise_network", "byod", "guest_access", "iot_segmentation"]',
  '["eap-tls", "eap-ttls", "peap"]',
  '["radius_server", "certificate_authority", "vlan_segmentation"]',
  '{
    "network_topology": "switched",
    "vlan_support": true,
    "dhcp_required": true,
    "dns_required": true
  }',
  '["802.1x_authentication", "vlan_assignment", "mac_bypass", "captive_portal"]',
  '[
    "Use certificate-based authentication for highest security",
    "Implement VLAN segmentation for network isolation",
    "Configure fallback authentication methods",
    "Monitor authentication logs regularly",
    "Test with different device types during deployment"
  ]',
  '[
    {
      "issue": "Authentication failures",
      "symptoms": ["Devices unable to connect", "Timeout errors"],
      "solutions": ["Check RADIUS server connectivity", "Verify shared secret", "Review certificate validity"]
    },
    {
      "issue": "VLAN assignment problems",
      "symptoms": ["Users in wrong VLAN", "No network access"],
      "solutions": ["Verify RADIUS attributes", "Check VLAN configuration", "Review policy assignments"]
    }
  ]',
  '["show radius-server status", "show authentication sessions", "show vlan summary"]',
  '["meraki", "mx", "802.1x", "radius", "security", "enterprise"]',
  true,
  true,
  '{
    "sections": {
      "network_access_control": "Core 802.1X settings",
      "radius_servers": "RADIUS server configuration",
      "security_policy": "VLAN and access policies",
      "advanced_settings": "Additional security features"
    }
  }',
  '{
    "steps": ["network_setup", "radius_config", "vlan_assignment", "testing"],
    "estimated_time": "45 minutes",
    "complexity_factors": ["certificate_management", "vlan_design", "policy_creation"]
  }'
),

-- SonicWall Firewall
(
  'SonicWall NSA Series 802.1X Configuration',
  'Enterprise 802.1X setup for SonicWall NSA series firewalls with zone-based security',
  'security',
  'firewall',
  'device_configuration',
  'advanced',
  '# SonicWall NSA 802.1X Configuration
# Configure 802.1X authentication with zone-based security

# Interface Configuration
interface {{wan_interface}}:
  zone: WAN
  security_service: enabled
  
interface {{lan_interface}}:
  zone: LAN
  security_service: enabled
  dot1x_enabled: true

# 802.1X Global Settings
dot1x_global:
  enabled: true
  authentication_mode: "eap"
  reauthentication_period: {{reauth_period}}
  quiet_period: {{quiet_period}}
  tx_period: {{tx_period}}

# RADIUS Configuration
radius_server primary:
  address: {{radius_primary_ip}}
  port: {{radius_auth_port}}
  shared_secret: "{{radius_secret}}"
  timeout: {{radius_timeout}}
  retries: {{radius_retries}}

radius_server secondary:
  address: {{radius_secondary_ip}}
  port: {{radius_auth_port}}
  shared_secret: "{{radius_secret}}"
  timeout: {{radius_timeout}}
  retries: {{radius_retries}}

# Zone Configuration
zone LAN:
  security_level: trusted
  dot1x_enforcement: enabled
  
zone GUEST:
  security_level: limited
  dot1x_enforcement: optional

# Access Rules
access_rule authenticated_users:
  from: LAN
  to: WAN
  action: allow
  users: authenticated
  
access_rule guest_users:
  from: GUEST
  to: WAN
  action: allow
  service: http_https_only

# Certificate Management
certificate_authority:
  ca_certificate: "{{ca_cert_path}}"
  server_certificate: "{{server_cert_path}}"
  certificate_validation: {{cert_validation}}',
  '{
    "wan_interface": {"type": "string", "default": "X1", "description": "WAN interface identifier"},
    "lan_interface": {"type": "string", "default": "X0", "description": "LAN interface identifier"},
    "reauth_period": {"type": "number", "default": 3600, "description": "Re-authentication period in seconds"},
    "quiet_period": {"type": "number", "default": 60, "description": "Quiet period after failed authentication"},
    "tx_period": {"type": "number", "default": 30, "description": "Transmission period for EAP packets"},
    "radius_primary_ip": {"type": "string", "required": true, "description": "Primary RADIUS server IP"},
    "radius_secondary_ip": {"type": "string", "required": false, "description": "Secondary RADIUS server IP"},
    "radius_auth_port": {"type": "number", "default": 1812, "description": "RADIUS authentication port"},
    "radius_secret": {"type": "string", "required": true, "description": "RADIUS shared secret"},
    "radius_timeout": {"type": "number", "default": 5, "description": "RADIUS timeout in seconds"},
    "radius_retries": {"type": "number", "default": 3, "description": "RADIUS retry attempts"},
    "ca_cert_path": {"type": "string", "required": true, "description": "CA certificate file path"},
    "server_cert_path": {"type": "string", "required": true, "description": "Server certificate file path"},
    "cert_validation": {"type": "boolean", "default": true, "description": "Enable certificate validation"}
  }',
  '["enterprise_security", "guest_access", "zone_protection", "threat_prevention"]',
  '["eap-tls", "eap-ttls", "peap-mschapv2"]',
  '["radius_server", "pki_infrastructure", "zone_configuration"]',
  '{
    "network_topology": "zone_based",
    "high_availability": true,
    "vpn_support": true,
    "content_filtering": true
  }',
  '["zone_based_security", "deep_packet_inspection", "intrusion_prevention", "anti_malware"]',
  '[
    "Implement zone-based security policies",
    "Use certificate-based authentication for critical users",
    "Configure high availability for RADIUS servers",
    "Enable logging and monitoring for security events",
    "Regular security policy reviews and updates"
  ]',
  '[
    {
      "issue": "Zone policy conflicts",
      "symptoms": ["Access denied errors", "Policy violations"],
      "solutions": ["Review zone configurations", "Check access rule priorities", "Verify user group assignments"]
    },
    {
      "issue": "Certificate authentication failures",
      "symptoms": ["Certificate errors", "Authentication timeouts"],
      "solutions": ["Verify CA certificate installation", "Check certificate validity periods", "Review PKI infrastructure"]
    }
  ]',
  '["show dot1x interface", "show radius-server status", "show zone", "show access-rule"]',
  '["sonicwall", "nsa", "firewall", "802.1x", "zone_security", "enterprise"]',
  true,
  true,
  '{
    "sections": {
      "interface": "Interface and zone configuration",
      "dot1x_global": "Global 802.1X settings",
      "radius_server": "RADIUS server configuration",
      "zone": "Security zone setup",
      "access_rule": "Traffic access policies",
      "certificate": "PKI and certificate management"
    }
  }',
  '{
    "steps": ["interface_config", "radius_setup", "zone_config", "policy_creation", "certificate_install", "testing"],
    "estimated_time": "90 minutes",
    "complexity_factors": ["zone_design", "policy_hierarchy", "certificate_management", "ha_configuration"]
  }'
),

-- Dell Networking (Force10)
(
  'Dell Networking 802.1X Configuration',
  'Complete 802.1X authentication setup for Dell Networking switches with VLAN assignment',
  'network',
  'switching',
  'device_configuration',
  'intermediate',
  '# Dell Networking 802.1X Configuration
# Configure port-based and dynamic VLAN assignment

# Global 802.1X Configuration
dot1x system-auth-control

# RADIUS Configuration
radius-server host {{radius_primary_ip}} key {{radius_secret}}
radius-server host {{radius_secondary_ip}} key {{radius_secret}}
radius-server timeout {{radius_timeout}}
radius-server retransmit {{radius_retries}}

# AAA Configuration
aaa authentication dot1x default group radius
aaa accounting dot1x default start-stop group radius

# Interface Configuration Template
interface range {{interface_range}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 dot1x port-control auto
 dot1x host-mode {{host_mode}}
 dot1x timeout tx-period {{tx_period}}
 dot1x timeout supp-timeout {{supp_timeout}}
 dot1x max-req {{max_requests}}
 spanning-tree portfast
 spanning-tree bpduguard enable

# Guest VLAN Configuration
interface vlan {{guest_vlan}}
 name "Guest Network"
 ip address {{guest_gateway}} {{guest_netmask}}
 
# Authenticated VLAN Configuration  
interface vlan {{auth_vlan}}
 name "Authenticated Users"
 ip address {{auth_gateway}} {{auth_netmask}}

# MAC Authentication Bypass
dot1x mac-auth-bypass
mac-auth-bypass eap-request

# Logging Configuration
logging buffered 32768
logging level dot1x info
logging level radius info

# Monitor Configuration
monitor session 1 source interface {{monitor_interface}}
monitor session 1 destination interface {{monitor_destination}}',
  '{
    "radius_primary_ip": {"type": "string", "required": true, "description": "Primary RADIUS server IP address"},
    "radius_secondary_ip": {"type": "string", "required": false, "description": "Secondary RADIUS server IP address"},
    "radius_secret": {"type": "string", "required": true, "description": "RADIUS shared secret"},
    "radius_timeout": {"type": "number", "default": 5, "description": "RADIUS timeout in seconds"},
    "radius_retries": {"type": "number", "default": 3, "description": "RADIUS retry attempts"},
    "interface_range": {"type": "string", "default": "tengigabitethernet 1/1-48", "description": "Interface range for 802.1X"},
    "default_vlan": {"type": "number", "default": 1, "description": "Default VLAN for unauthenticated users"},
    "guest_vlan": {"type": "number", "required": true, "description": "Guest VLAN ID"},
    "auth_vlan": {"type": "number", "required": true, "description": "Authenticated users VLAN ID"},
    "host_mode": {"type": "string", "default": "single-host", "description": "Host mode (single-host, multi-host, multi-domain)"},
    "tx_period": {"type": "number", "default": 30, "description": "Transmission period for EAP packets"},
    "supp_timeout": {"type": "number", "default": 30, "description": "Supplicant timeout period"},
    "max_requests": {"type": "number", "default": 2, "description": "Maximum EAP requests"},
    "guest_gateway": {"type": "string", "required": true, "description": "Guest VLAN gateway IP"},
    "guest_netmask": {"type": "string", "required": true, "description": "Guest VLAN netmask"},
    "auth_gateway": {"type": "string", "required": true, "description": "Authenticated VLAN gateway IP"},
    "auth_netmask": {"type": "string", "required": true, "description": "Authenticated VLAN netmask"},
    "monitor_interface": {"type": "string", "required": false, "description": "Interface to monitor"},
    "monitor_destination": {"type": "string", "required": false, "description": "Monitor destination interface"}
  }',
  '["enterprise_access", "byod", "guest_networking", "iot_devices"]',
  '["eap-md5", "eap-tls", "eap-ttls", "peap", "mac_bypass"]',
  '["radius_server", "vlan_configuration", "spanning_tree"]',
  '{
    "network_topology": "layer2_switching",
    "vlan_support": true,
    "qos_support": true,
    "monitoring_capability": true
  }',
  '["port_security", "dynamic_vlan_assignment", "mac_authentication", "accounting"]',
  '[
    "Configure STP portfast on 802.1X ports to reduce connection time",
    "Use BPDU guard to prevent loops on access ports", 
    "Implement proper VLAN design for security segmentation",
    "Monitor authentication logs for security events",
    "Test failover scenarios with secondary RADIUS server"
  ]',
  '[
    {
      "issue": "Slow authentication",
      "symptoms": ["Long connection times", "Timeout errors"],
      "solutions": ["Enable spanning-tree portfast", "Adjust EAP timers", "Check RADIUS server response time"]
    },
    {
      "issue": "VLAN assignment failures", 
      "symptoms": ["Users in wrong VLAN", "No DHCP response"],
      "solutions": ["Verify RADIUS attributes", "Check VLAN configuration", "Review DHCP relay settings"]
    }
  ]',
  '["show dot1x", "show dot1x interface", "show radius-server", "show vlan", "show authentication sessions"]',
  '["dell", "force10", "switching", "802.1x", "vlan", "enterprise"]',
  true,
  true,
  '{
    "sections": {
      "global": "Global 802.1X and RADIUS configuration",
      "aaa": "Authentication, authorization, and accounting",
      "interface": "Per-interface 802.1X settings",
      "vlan": "VLAN configuration and assignment",
      "monitoring": "Logging and monitoring setup"
    }
  }',
  '{
    "steps": ["global_config", "radius_setup", "vlan_creation", "interface_config", "testing"],
    "estimated_time": "60 minutes",
    "complexity_factors": ["vlan_design", "interface_count", "monitoring_requirements"]
  }'
);

-- Add configuration template categories for better organization
INSERT INTO config_template_categories (
  name,
  description,
  category_type,
  icon_name,
  color_scheme,
  display_order,
  ai_priority_weight
) VALUES 
('Security Appliances', 'Firewall and security device configurations', 'vendor', 'Shield', 'red', 1, 1.2),
('Cloud-Managed', 'Cloud-managed network device configurations', 'deployment', 'Cloud', 'blue', 2, 1.1),
('Enterprise Switching', 'Enterprise-grade switch configurations', 'function', 'Network', 'green', 3, 1.0),
('Wireless Controllers', 'Wireless LAN controller configurations', 'function', 'Wifi', 'purple', 4, 1.0),
('Authentication Servers', 'RADIUS and authentication server setups', 'function', 'Key', 'orange', 5, 1.3);