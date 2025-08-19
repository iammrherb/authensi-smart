-- Seed configuration templates from unified template library
-- This will populate the configuration_templates table with templates from all vendors

-- Insert Fortinet templates
INSERT INTO public.configuration_templates (
  name, description, category, subcategory, configuration_type, complexity_level,
  template_content, template_variables, supported_scenarios, security_features,
  troubleshooting_guide, validation_commands, compatibility_matrix,
  is_validated, is_public, tags, template_source
) VALUES 
-- Fortinet Basic 802.1X
(
  'Basic 802.1X Authentication - Fortinet',
  'Basic FortiSwitch 802.1X configuration with single VLAN',
  'Authentication',
  'Basic Access Control',
  'CLI',
  'basic',
  'config system global
    set 802-1x enable
end

config switch-controller global
    set allow-multiple-interfaces enable
end

config user radius
    edit "radius-server"
        set server "{{radius_server_ip}}"
        set secret "{{radius_secret}}"
    next
end

config switch-controller 802-1x-settings
    edit "default"
        set tx-period 30
        set eap-reauth-intv 3600
        set max-reauth-attempt 3
    next
end',
  '{"radius_server_ip": {"type": "string", "description": "IP address of the RADIUS server", "required": true}, "radius_secret": {"type": "string", "description": "Shared secret for RADIUS authentication", "required": true}}',
  '["802.1X Authentication", "Basic Network Access Control"]',
  '["authentication", "802.1x", "radius", "basic"]',
  '["Check RADIUS server connectivity", "Verify shared secret configuration", "Check switch-controller global settings"]',
  '["diagnose switch-controller 802-1x status", "get user radius"]',
  '[{"model": "FortiSwitch", "firmware_min": "6.0.0", "tested_versions": ["6.0.0", "6.2.0", "6.4.0", "7.0.0"]}]',
  true,
  true,
  '["fortinet", "fortiswitch", "authentication", "802.1x", "radius", "basic"]',
  'library'
),
-- Cisco Basic 802.1X
(
  'Basic 802.1X Authentication - Cisco',
  'Basic Cisco switch 802.1X configuration with single VLAN',
  'Authentication',
  'Basic Access Control',
  'CLI',
  'basic',
  '! Basic 802.1X Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius

! RADIUS Server Configuration
radius-server host {{radius_server_ip}} auth-port 1812 acct-port 1813 key {{radius_secret}}
radius-server timeout 5
radius-server retransmit 3

! Global 802.1X Configuration
dot1x system-auth-control

! Interface Configuration
interface range {{interface_range}}
 description 802.1X Access Ports
 switchport mode access
 switchport access vlan {{access_vlan}}
 authentication host-mode single-host
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}
 spanning-tree portfast
 spanning-tree bpduguard enable',
  '{"radius_server_ip": {"type": "string", "description": "IP address of the RADIUS server", "required": true}, "radius_secret": {"type": "string", "description": "Shared secret for RADIUS authentication", "required": true}, "interface_range": {"type": "string", "description": "Interface range for 802.1X", "required": true, "default": "GigabitEthernet1/0/1-48"}, "access_vlan": {"type": "number", "description": "Default access VLAN", "required": true, "default": 100}, "reauth_timer": {"type": "number", "description": "Reauthentication timer in seconds", "required": false, "default": 3600}, "tx_period": {"type": "number", "description": "EAP transmission period in seconds", "required": false, "default": 30}}',
  '["802.1X Authentication", "Basic Network Access Control"]',
  '["authentication", "802.1x", "radius", "basic", "catalyst"]',
  '["Check RADIUS server connectivity with test aaa group radius", "Verify interface configuration with show dot1x interface", "Check authentication sessions with show authentication sessions"]',
  '["show dot1x all", "show authentication sessions", "show radius server-group all"]',
  '[{"model": "Catalyst 2960", "firmware_min": "15.0", "tested_versions": ["15.0", "15.2", "15.4"]}, {"model": "Catalyst 3560", "firmware_min": "15.0", "tested_versions": ["15.0", "15.2", "15.4"]}, {"model": "Catalyst 9300", "firmware_min": "16.6", "tested_versions": ["16.6", "16.9", "16.12"]}]',
  true,
  true,
  '["cisco", "catalyst", "authentication", "802.1x", "radius", "basic"]',
  'library'
),
-- Aruba Basic 802.1X
(
  'Basic 802.1X Authentication - Aruba',
  'Basic ArubaOS-Switch 802.1X configuration with single VLAN',
  'Authentication',
  'Basic Access Control',
  'CLI',
  'basic',
  '# Basic 802.1X Configuration for ArubaOS-Switch

# RADIUS Server Configuration
radius-server host {{radius_server_ip}} key {{radius_secret}}
radius-server timeout 5
radius-server retransmit 3

# AAA Configuration
aaa authentication port-access eap-radius
aaa authentication port-access chap-radius

# Global 802.1X Settings
aaa port-access authenticator active

# VLAN Configuration
vlan {{access_vlan}}
   name "USER_VLAN"
   untagged {{port_range}}
   exit

# Interface Configuration
interface {{port_range}}
   aaa port-access authenticator
   aaa port-access auth-mode port-based
   aaa port-access controlled-direction in
   exit',
  '{"radius_server_ip": {"type": "string", "description": "IP address of the RADIUS server", "required": true}, "radius_secret": {"type": "string", "description": "Shared secret for RADIUS authentication", "required": true}, "access_vlan": {"type": "number", "description": "VLAN ID for authenticated users", "required": true, "default": 100}, "port_range": {"type": "string", "description": "Port range for 802.1X authentication", "required": true, "default": "1-24"}}',
  '["802.1X Authentication", "Basic Network Access Control"]',
  '["authentication", "802.1x", "radius", "basic", "aruba"]',
  '["Check RADIUS connectivity with test aaa radius", "Verify port configuration with show port-access authenticator", "Check client authentication status"]',
  '["show port-access authenticator", "show port-access clients", "show radius server-group"]',
  '[{"model": "ArubaOS-Switch 2540", "firmware_min": "16.04", "tested_versions": ["16.04", "16.05", "16.06"]}, {"model": "ArubaOS-Switch 2930F", "firmware_min": "16.04", "tested_versions": ["16.04", "16.05", "16.06"]}, {"model": "ArubaOS-Switch 3810M", "firmware_min": "16.04", "tested_versions": ["16.04", "16.05", "16.06"]}]',
  true,
  true,
  '["aruba", "arubaos-switch", "authentication", "802.1x", "radius", "basic"]',
  'library'
);