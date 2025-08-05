-- Insert comprehensive FortiSwitch Multi-Auth configuration templates for all firmware versions

-- FortiSwitchOS 3.x Series (Legacy) Template
INSERT INTO configuration_templates (
  name,
  description,
  vendor_id,
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
  is_validated
) VALUES (
  'FortiSwitch 3.x Multi-Auth Basic Configuration',
  'Basic 802.1X configuration with limited multi-host support for FortiSwitchOS 3.x series. Legacy firmware with basic multi-authentication capabilities.',
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
  'Network Access Control',
  'Multi-Authentication',
  '802.1X Multi-Auth',
  'intermediate',
  '# Global 802.1X Configuration
config switch global
    set radius-server-auth enable
end

config switch dot1x
    set status enable
    set reauth-period {{reauth_period}}
end

# Port Configuration - Limited Multi-Auth
config switch interface
    edit "{{port_name}}"
        set dot1x-mode auto
        set dot1x-max-supplicant {{max_devices}}     # Maximum devices
        set dot1x-mac-auth-bypass {{mab_enable}}
    next
end',
  jsonb_build_object(
    'port_name', jsonb_build_object('type', 'string', 'default', 'port1', 'description', 'Port to configure'),
    'reauth_period', jsonb_build_object('type', 'number', 'default', 3600, 'description', 'Reauthentication period in seconds'),
    'max_devices', jsonb_build_object('type', 'number', 'default', 4, 'description', 'Maximum number of devices allowed'),
    'mab_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable MAC authentication bypass')
  ),
  ARRAY['Conference rooms with IP phones', 'Basic multi-device access', 'Legacy switch environments'],
  ARRAY['802.1X', 'MAC Authentication Bypass'],
  ARRAY['RADIUS server', 'FortiSwitchOS 3.x firmware'],
  jsonb_build_object(
    'radius_server', jsonb_build_object('ip', 'Required', 'shared_secret', 'Required'),
    'vlan_support', 'Basic VLAN assignment',
    'max_concurrent_sessions', '4 devices per port'
  ),
  ARRAY['Basic 802.1X authentication', 'Limited multi-host support', 'MAC bypass authentication'],
  ARRAY['Keep max devices under 4', 'Use VLANs for device segregation', 'Monitor performance impact', 'Regular firmware updates recommended'],
  ARRAY[
    jsonb_build_object('issue', 'Authentication not working', 'solution', 'Check RADIUS connectivity and verify dot1x-mode is set to auto'),
    jsonb_build_object('issue', 'Multiple devices failing', 'solution', 'Verify dot1x-max-supplicant is configured correctly'),
    jsonb_build_object('issue', 'MAB not working', 'solution', 'Ensure dot1x-mac-auth-bypass is enabled')
  ],
  ARRAY['get switch interface port1', 'diagnose switch dot1x status'],
  ARRAY['fortinet', 'fortiswitch', 'multi-auth', '802.1x', 'legacy', '3.x', 'basic'],
  true,
  true
);

-- FortiSwitchOS 6.0.x - 6.2.x Template
INSERT INTO configuration_templates (
  name,
  description,
  vendor_id,
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
  is_validated
) VALUES (
  'FortiSwitch 6.0-6.2 Multi-Auth with Port Security',
  'Enhanced multi-authentication configuration for FortiSwitchOS 6.0.x - 6.2.x with introduction of port-security modes and improved RADIUS integration.',
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
  'Network Access Control',
  'Multi-Authentication',
  '802.1X Multi-Auth',
  'intermediate',
  '# Global Configuration
config switch global
    set radius-server-auth enable
    set radius-server-acct enable
end

# RADIUS Configuration
config user radius
    edit "{{radius_name}}"
        set server "{{radius_server}}"
        set secret ENC {{radius_secret}}
        set acct-server "{{radius_server}}"
    next
end

# Port Configuration
config switch interface
    edit "{{port_name}}"
        set port-security enable
        set port-security-mode 802.1X
        set port-security-mac-auth-bypass {{mab_enable}}
        set port-security-max-mac {{max_mac_addresses}}
        # Multi-auth options
        set security-mode multiple     # Key setting for multi-auth
    next
end',
  jsonb_build_object(
    'port_name', jsonb_build_object('type', 'string', 'default', 'port1', 'description', 'Port to configure'),
    'radius_name', jsonb_build_object('type', 'string', 'default', 'RADIUS1', 'description', 'RADIUS server name'),
    'radius_server', jsonb_build_object('type', 'string', 'default', '192.168.1.100', 'description', 'RADIUS server IP address'),
    'radius_secret', jsonb_build_object('type', 'string', 'default', 'your-radius-secret', 'description', 'RADIUS shared secret'),
    'max_mac_addresses', jsonb_build_object('type', 'number', 'default', 8, 'description', 'Maximum MAC addresses allowed'),
    'mab_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable MAC authentication bypass')
  ),
  ARRAY['Conference rooms with multiple devices', 'Desk areas with computers and phones', 'Areas with hubs or unmanaged switches'],
  ARRAY['802.1X', 'MAC Authentication Bypass', 'RADIUS Authentication'],
  ARRAY['RADIUS server', 'Port security support', 'FortiSwitchOS 6.0-6.2'],
  jsonb_build_object(
    'radius_server', jsonb_build_object('ip', 'Required', 'shared_secret', 'Required', 'accounting', 'Supported'),
    'vlan_support', 'Enhanced VLAN assignment via RADIUS',
    'max_concurrent_sessions', '8 devices per port'
  ),
  ARRAY['Port-based security modes', 'Enhanced MAC bypass', 'RADIUS accounting support'],
  ARRAY['Set max-mac conservatively (under 10)', 'Use VLANs for device segregation', 'Monitor performance impact', 'Enable RADIUS accounting for audit trails'],
  ARRAY[
    jsonb_build_object('issue', 'Security mode not working', 'solution', 'Verify security-mode is set to multiple for multi-auth'),
    jsonb_build_object('issue', 'RADIUS not responding', 'solution', 'Check RADIUS server configuration and network connectivity'),
    jsonb_build_object('issue', 'Port security violations', 'solution', 'Increase port-security-max-mac value or check for unauthorized devices')
  ],
  ARRAY['diagnose switch 802.1x status', 'diagnose switch 802.1x session list', 'get switch interface port1'],
  ARRAY['fortinet', 'fortiswitch', 'multi-auth', '802.1x', '6.0', '6.2', 'port-security'],
  true,
  true
);

-- FortiSwitchOS 6.4.x Template
INSERT INTO configuration_templates (
  name,
  description,
  vendor_id,
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
  is_validated
) VALUES (
  'FortiSwitch 6.4 Enhanced Multi-Auth with Guest VLAN',
  'Advanced multi-authentication configuration for FortiSwitchOS 6.4.x with enhanced syntax, guest VLAN support, and comprehensive authentication failure handling.',
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
  'Network Access Control',
  'Multi-Authentication',
  '802.1X Multi-Auth',
  'advanced',
  '# Global 802.1X Settings
config switch global
    set radius-server-auth enable
    set radius-server-acct enable
    set max-radius-server-attempt {{max_radius_attempts}}
end

# 802.1X Configuration
config switch dot1x
    set status enable
    set reauth-period {{reauth_period}}
    set max-reauth-attempt {{max_reauth_attempts}}
    set link-down-auth retain-auth    # New option
end

# Port Configuration with Multi-Auth
config switch interface
    edit "{{port_name}}"
        # Basic port security
        set port-security-mode 802.1X-mac-based    # Key for multi-auth
        set port-security-mac-auth-bypass {{mab_enable}}
        set port-security-guest-vlan {{guest_vlan_enable}}
        set port-security-guest-vlanid {{guest_vlan_id}}
        set port-security-max-mac {{max_mac_addresses}}
        
        # Advanced options
        set port-security-auth-fail-vlan {{auth_fail_vlan_enable}}
        set port-security-auth-fail-vlanid {{auth_fail_vlan_id}}
        set port-security-mab-eapol {{mab_eapol_enable}}
    next
end',
  jsonb_build_object(
    'port_name', jsonb_build_object('type', 'string', 'default', 'port1', 'description', 'Port to configure'),
    'max_radius_attempts', jsonb_build_object('type', 'number', 'default', 3, 'description', 'Maximum RADIUS server attempts'),
    'reauth_period', jsonb_build_object('type', 'number', 'default', 3600, 'description', 'Reauthentication period in seconds'),
    'max_reauth_attempts', jsonb_build_object('type', 'number', 'default', 3, 'description', 'Maximum reauthentication attempts'),
    'max_mac_addresses', jsonb_build_object('type', 'number', 'default', 10, 'description', 'Maximum MAC addresses allowed'),
    'guest_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable guest VLAN'),
    'guest_vlan_id', jsonb_build_object('type', 'number', 'default', 100, 'description', 'Guest VLAN ID'),
    'auth_fail_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable auth failure VLAN'),
    'auth_fail_vlan_id', jsonb_build_object('type', 'number', 'default', 99, 'description', 'Auth failure VLAN ID'),
    'mab_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable MAC authentication bypass'),
    'mab_eapol_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable MAB EAPOL')
  ),
  ARRAY['Enterprise conference rooms', 'Multi-device workstations', 'Guest access areas', 'Mixed authenticated/unauthenticated environments'],
  ARRAY['802.1X', 'MAC Authentication Bypass', 'Guest access', 'Authentication failure handling'],
  ARRAY['RADIUS server', 'Guest VLAN support', 'Auth failure VLAN', 'FortiSwitchOS 6.4'],
  jsonb_build_object(
    'radius_server', jsonb_build_object('ip', 'Required', 'shared_secret', 'Required', 'accounting', 'Supported'),
    'vlan_support', 'Guest and auth failure VLANs',
    'max_concurrent_sessions', '10 devices per port',
    'guest_access', 'Automatic guest VLAN assignment'
  ),
  ARRAY['MAC-based authentication', 'Guest VLAN support', 'Authentication failure handling', 'Link-down authentication retention'],
  ARRAY['Configure guest VLAN for unauthenticated devices', 'Use auth failure VLAN for policy enforcement', 'Monitor authentication attempts', 'Enable MAB EAPOL for better compatibility'],
  ARRAY[
    jsonb_build_object('issue', 'Guest VLAN not working', 'solution', 'Verify guest VLAN is enabled and VLAN ID exists in switch configuration'),
    jsonb_build_object('issue', 'Auth failure VLAN issues', 'solution', 'Check auth-fail-vlan settings and ensure VLAN exists'),
    jsonb_build_object('issue', 'MAC-based auth problems', 'solution', 'Verify port-security-mode is set to 802.1X-mac-based')
  ],
  ARRAY['diagnose switch 802.1x status', 'diagnose switch 802.1x session list', 'diagnose switch mac-address port port1'],
  ARRAY['fortinet', 'fortiswitch', 'multi-auth', '802.1x', '6.4', 'guest-vlan', 'mac-based'],
  true,
  true
);

-- FortiSwitchOS 7.0.x - 7.2.x Template
INSERT INTO configuration_templates (
  name,
  description,
  vendor_id,
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
  is_validated
) VALUES (
  'FortiSwitch 7.0-7.2 Advanced Multi-Auth with Enhanced Security',
  'Modern multi-authentication configuration for FortiSwitchOS 7.0.x - 7.2.x with major syntax changes, enhanced security features, and advanced violation handling.',
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
  'Network Access Control',
  'Multi-Authentication',
  '802.1X Multi-Auth',
  'advanced',
  '# Global Configuration
config switch global
    set radius-server-auth enable
    set radius-server-acct enable
    set mac-auth-bypass-format {{mab_format}}    # New formatting option
end

# 802.1X Settings
config switch dot1x
    set status enable
    set reauth-period {{reauth_period}}
    set max-reauth-attempt {{max_reauth_attempts}}
    set tx-period {{tx_period}}
    set quiet-period {{quiet_period}}
end

# Multi-Auth Port Configuration
config switch interface
    edit "{{port_name}}"
        config port-security
            set port-security-mode 802.1X
            set auth-mode multi-auth        # Explicit multi-auth mode
            set max-mac-num {{max_mac_addresses}}              # Renamed parameter
            set mac-auth-bypass {{mab_enable}}
            set guest-vlan {{guest_vlan_enable}}
            set guest-vlanid {{guest_vlan_id}}
            set auth-fail-vlan {{auth_fail_vlan_enable}}
            set auth-fail-vlanid {{auth_fail_vlan_id}}
            set radius-timeout-overwrite {{radius_timeout_override}}
            set security-violation {{violation_action}}  # New violation handling
        end
    next
end',
  jsonb_build_object(
    'port_name', jsonb_build_object('type', 'string', 'default', 'port1', 'description', 'Port to configure'),
    'mab_format', jsonb_build_object('type', 'string', 'default', 'hyphen', 'description', 'MAC address format for MAB (hyphen, colon, none)'),
    'reauth_period', jsonb_build_object('type', 'number', 'default', 3600, 'description', 'Reauthentication period in seconds'),
    'max_reauth_attempts', jsonb_build_object('type', 'number', 'default', 3, 'description', 'Maximum reauthentication attempts'),
    'tx_period', jsonb_build_object('type', 'number', 'default', 30, 'description', 'EAP transmission period'),
    'quiet_period', jsonb_build_object('type', 'number', 'default', 60, 'description', 'Quiet period after auth failure'),
    'max_mac_addresses', jsonb_build_object('type', 'number', 'default', 15, 'description', 'Maximum MAC addresses allowed'),
    'guest_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable guest VLAN'),
    'guest_vlan_id', jsonb_build_object('type', 'number', 'default', 100, 'description', 'Guest VLAN ID'),
    'auth_fail_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable auth failure VLAN'),
    'auth_fail_vlan_id', jsonb_build_object('type', 'number', 'default', 99, 'description', 'Auth failure VLAN ID'),
    'mab_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable MAC authentication bypass'),
    'radius_timeout_override', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Override RADIUS timeout'),
    'violation_action', jsonb_build_object('type', 'string', 'default', 'shutdown', 'description', 'Security violation action (shutdown, restrict)')
  ),
  ARRAY['Enterprise multi-device environments', 'Advanced security requirements', 'High-density authentication scenarios', 'Compliance-driven deployments'],
  ARRAY['802.1X', 'MAC Authentication Bypass', 'Multi-domain authentication', 'Advanced violation handling'],
  ARRAY['RADIUS server', 'Enhanced timeout controls', 'Security violation handling', 'FortiSwitchOS 7.0-7.2'],
  jsonb_build_object(
    'radius_server', jsonb_build_object('ip', 'Required', 'shared_secret', 'Required', 'timeout_override', 'Supported'),
    'vlan_support', 'Enhanced VLAN management',
    'max_concurrent_sessions', '15 devices per port',
    'security_violations', 'Configurable violation actions'
  ),
  ARRAY['Explicit multi-auth mode', 'Enhanced security violation handling', 'Configurable MAC format for MAB', 'Advanced timeout controls'],
  ARRAY['Use explicit auth-mode multi-auth', 'Configure appropriate violation actions', 'Set proper quiet periods for failed authentications', 'Monitor security violations regularly'],
  ARRAY[
    jsonb_build_object('issue', 'Auth-mode not recognized', 'solution', 'Ensure using explicit auth-mode multi-auth syntax for 7.x firmware'),
    jsonb_build_object('issue', 'Parameter max-mac-num not found', 'solution', 'Use max-mac-num instead of port-security-max-mac in 7.x syntax'),
    jsonb_build_object('issue', 'Security violations', 'solution', 'Check security-violation setting and monitor for unauthorized devices')
  ],
  ARRAY['diagnose switch dot1x status', 'diagnose switch dot1x session list', 'diagnose switch dot1x interface port1', 'diagnose switch mac-auth session list'],
  ARRAY['fortinet', 'fortiswitch', 'multi-auth', '802.1x', '7.0', '7.2', 'enhanced-security'],
  true,
  true
);

-- FortiSwitchOS 7.4.x and Later Template
INSERT INTO configuration_templates (
  name,
  description,
  vendor_id,
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
  is_validated
) VALUES (
  'FortiSwitch 7.4+ Latest Multi-Auth with CoA and Critical VLAN',
  'Latest generation multi-authentication configuration for FortiSwitchOS 7.4.x and later with Change of Authorization (CoA), Critical VLAN support, and advanced session management.',
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
  'Network Access Control',
  'Multi-Authentication',
  '802.1X Multi-Auth',
  'expert',
  '# Global Settings
config switch global
    set radius-server-auth enable
    set radius-server-acct enable
    set radius-coa {{coa_enable}}               # Change of Authorization
    set radius-coa-port {{coa_port}}
end

# Enhanced 802.1X Configuration
config switch dot1x
    set status enable
    set reauth-period {{reauth_period}}
    set max-reauth-attempt {{max_reauth_attempts}}
    set supplicant-timeout {{supplicant_timeout}}
    set server-timeout {{server_timeout}}
    set auth-period {{auth_period}}
end

# Advanced Multi-Auth Configuration
config switch interface
    edit "{{port_name}}"
        config port-security
            set status enable
            set port-security-mode 802.1X
            
            # Multi-auth specific settings
            set auth-mode {{auth_mode}}        # multi-host, multi-domain, or multi-auth
            set max-allowed-mac {{max_mac_addresses}}          # Updated parameter name
            set mac-limit-action {{mac_limit_action}}   # Action when limit reached
            
            # Authentication options
            set mac-auth-bypass {{mab_enable}}
            set mab-priority {{mab_priority}}            # MAC bypass priority
            set guest-vlan {{guest_vlan_enable}}
            set guest-vlanid {{guest_vlan_id}}
            set auth-fail-vlan {{auth_fail_vlan_enable}}
            set auth-fail-vlanid {{auth_fail_vlan_id}}
            
            # Advanced features
            set critical-vlan {{critical_vlan_enable}}        # RADIUS server failure handling
            set critical-vlanid {{critical_vlan_id}}
            set open-auth {{open_auth_enable}}            # Monitor mode
            set radius-nas-ip-override "{{nas_ip_override}}"
            
            # Session management
            set session-timeout-from-radius {{session_timeout_radius}}
            set reauthentication {{reauthentication_enable}}
            set inactivity-timer {{inactivity_timeout}}
        end
    next
end',
  jsonb_build_object(
    'port_name', jsonb_build_object('type', 'string', 'default', 'port1', 'description', 'Port to configure'),
    'coa_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable Change of Authorization'),
    'coa_port', jsonb_build_object('type', 'number', 'default', 3799, 'description', 'CoA listening port'),
    'reauth_period', jsonb_build_object('type', 'number', 'default', 3600, 'description', 'Reauthentication period in seconds'),
    'max_reauth_attempts', jsonb_build_object('type', 'number', 'default', 3, 'description', 'Maximum reauthentication attempts'),
    'supplicant_timeout', jsonb_build_object('type', 'number', 'default', 30, 'description', 'Supplicant timeout'),
    'server_timeout', jsonb_build_object('type', 'number', 'default', 30, 'description', 'Server timeout'),
    'auth_period', jsonb_build_object('type', 'number', 'default', 60, 'description', 'Authentication period'),
    'auth_mode', jsonb_build_object('type', 'string', 'default', 'multi-host', 'description', 'Authentication mode (multi-host, multi-domain, multi-auth)'),
    'max_mac_addresses', jsonb_build_object('type', 'number', 'default', 20, 'description', 'Maximum allowed MAC addresses'),
    'mac_limit_action', jsonb_build_object('type', 'string', 'default', 'shutdown', 'description', 'Action when MAC limit reached'),
    'mab_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable MAC authentication bypass'),
    'mab_priority', jsonb_build_object('type', 'string', 'default', 'low', 'description', 'MAC bypass priority (low, high)'),
    'guest_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable guest VLAN'),
    'guest_vlan_id', jsonb_build_object('type', 'number', 'default', 100, 'description', 'Guest VLAN ID'),
    'auth_fail_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable auth failure VLAN'),
    'auth_fail_vlan_id', jsonb_build_object('type', 'number', 'default', 99, 'description', 'Auth failure VLAN ID'),
    'critical_vlan_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable critical VLAN'),
    'critical_vlan_id', jsonb_build_object('type', 'number', 'default', 200, 'description', 'Critical VLAN ID'),
    'open_auth_enable', jsonb_build_object('type', 'boolean', 'default', false, 'description', 'Enable open authentication (monitor mode)'),
    'nas_ip_override', jsonb_build_object('type', 'string', 'default', '10.1.1.1', 'description', 'NAS IP override'),
    'session_timeout_radius', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Use session timeout from RADIUS'),
    'reauthentication_enable', jsonb_build_object('type', 'boolean', 'default', true, 'description', 'Enable reauthentication'),
    'inactivity_timeout', jsonb_build_object('type', 'number', 'default', 300, 'description', 'Inactivity timer in seconds')
  ),
  ARRAY['Enterprise-grade deployments', 'Dynamic policy enforcement', 'High-availability environments', 'IoT device management', 'Zero-trust networking'],
  ARRAY['802.1X', 'MAC Authentication Bypass', 'Change of Authorization', 'Critical VLAN', 'Multi-domain authentication', 'Session management'],
  ARRAY['RADIUS server with CoA support', 'Critical VLAN configuration', 'Advanced session management', 'FortiSwitchOS 7.4+'],
  jsonb_build_object(
    'radius_server', jsonb_build_object('ip', 'Required', 'shared_secret', 'Required', 'coa_support', 'Required'),
    'vlan_support', 'Full VLAN management including critical VLAN',
    'max_concurrent_sessions', '20+ devices per port',
    'dynamic_policy', 'CoA-based policy updates',
    'high_availability', 'Critical VLAN for RADIUS failures'
  ),
  ARRAY['Change of Authorization support', 'Critical VLAN for server failures', 'Advanced session management', 'Open authentication monitoring', 'Enhanced MAC limit controls'],
  ARRAY['Implement Critical VLAN for redundancy', 'Use CoA for dynamic policy updates', 'Enable session monitoring and limits', 'Configure multi-domain for voice/data separation', 'Regular monitoring of authentication statistics'],
  ARRAY[
    jsonb_build_object('issue', 'CoA not working', 'solution', 'Verify radius-coa is enabled and correct port is configured'),
    jsonb_build_object('issue', 'Critical VLAN not activating', 'solution', 'Check RADIUS server connectivity and ensure critical VLAN exists'),
    jsonb_build_object('issue', 'Session management problems', 'solution', 'Review session timeout settings and inactivity timer configuration'),
    jsonb_build_object('issue', 'Max-allowed-mac parameter issues', 'solution', 'Use max-allowed-mac instead of older parameter names in 7.4+ firmware')
  ],
  ARRAY['diagnose switch dot1x status', 'diagnose switch dot1x session list interface port1', 'diagnose switch dot1x statistics interface port1', 'diagnose debug application dot1x -1', 'diagnose debug application radius -1'],
  ARRAY['fortinet', 'fortiswitch', 'multi-auth', '802.1x', '7.4', 'coa', 'critical-vlan', 'latest'],
  true,
  true
);

-- Insert FortiSwitch models and firmware compatibility matrix
INSERT INTO configuration_templates (
  name,
  description,
  vendor_id,
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
  is_validated
) VALUES (
  'FortiSwitch Model and Firmware Compatibility Matrix',
  'Comprehensive compatibility matrix for FortiSwitch models and firmware versions with multi-auth support capabilities and migration paths.',
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
  'Network Access Control',
  'Compatibility',
  'Compatibility Matrix',
  'reference',
  '# FortiSwitch Model and Firmware Compatibility Matrix

## FortiSwitchOS 3.x Series Support
### Supported Models:
- FortiSwitch 108D/E/F
- FortiSwitch 124D/E/F  
- FortiSwitch 148E/F
- FortiSwitch 224D/E
- FortiSwitch 248D/E
- FortiSwitch 424D/E
- FortiSwitch 448D/E

### Multi-Auth Capabilities:
- Basic multi-host (up to 4 devices)
- Limited VLAN assignment
- Basic MAC bypass

## FortiSwitchOS 6.0.x - 6.2.x Support
### Supported Models:
- FortiSwitch 108E/F
- FortiSwitch 124E/F
- FortiSwitch 148F
- FortiSwitch 224E/F
- FortiSwitch 248E/F
- FortiSwitch 424E/F  
- FortiSwitch 448E/F
- FortiSwitch 1024D/E
- FortiSwitch 1048E
- FortiSwitch 3032D/E

### Multi-Auth Capabilities:
- Enhanced multi-host (up to 8 devices)
- Port security modes
- RADIUS accounting
- Improved VLAN support

## FortiSwitchOS 6.4.x Support
### Supported Models:
- All 6.0-6.2 models plus:
- FortiSwitch 124F
- FortiSwitch 148F-FPOE
- FortiSwitch 248F-FPOE
- FortiSwitch 524D
- FortiSwitch 548D
- FortiSwitch 1024E
- FortiSwitch 1048E
- FortiSwitch 2024E
- FortiSwitch 3032E

### Multi-Auth Capabilities:
- MAC-based authentication
- Guest VLAN support
- Auth failure VLAN
- Up to 10 devices per port

## FortiSwitchOS 7.0.x - 7.2.x Support
### Supported Models:
- All previous models plus:
- FortiSwitch 148F-POE
- FortiSwitch 248F-POE
- FortiSwitch 424F
- FortiSwitch 448F
- FortiSwitch 1048F
- FortiSwitch M426F
- FortiSwitch M524D
- FortiSwitch M548D

### Multi-Auth Capabilities:
- Explicit multi-auth modes
- Enhanced security violations
- Configurable MAC formats
- Up to 15 devices per port

## FortiSwitchOS 7.4.x and Later Support
### Supported Models:
- All 7.0-7.2 models plus:
- FortiSwitch 148G
- FortiSwitch 248G
- FortiSwitch 148G-POE
- FortiSwitch 248G-POE
- FortiSwitch 424G
- FortiSwitch 448G
- FortiSwitch 1048G
- FortiSwitch M248F
- FortiSwitch M424F
- FortiSwitch M448F

### Multi-Auth Capabilities:
- Change of Authorization (CoA)
- Critical VLAN support
- Advanced session management
- Multi-domain authentication
- Up to 20+ devices per port

## Migration Path Commands

### 6.4 to 7.0 Migration:
```
# Remove old syntax
unset port-security-mode
unset port-security-max-mac

# Apply new syntax
config port-security
    set auth-mode multi-auth
    set max-mac-num 10
end
```

### 7.0 to 7.4 Migration:
```
# Update parameter names
set max-allowed-mac 15
set mac-limit-action shutdown
```

## Feature Support Matrix:

| Feature | 3.x | 6.0-6.2 | 6.4 | 7.0-7.2 | 7.4+ |
|---------|-----|---------|-----|---------|------|
| Basic Multi-Auth | Limited | Yes | Yes | Yes | Yes |
| MAC-based Auth | No | Yes | Yes | Yes | Yes |
| Multi-Domain | No | No | Limited | Yes | Yes |
| CoA Support | No | No | Limited | Yes | Yes |
| Critical VLAN | No | No | Yes | Yes | Yes |
| Open Auth Mode | No | No | No | Yes | Yes |
| Session Limits | Basic | Basic | Enhanced | Enhanced | Advanced |',
  jsonb_build_object(
    'firmware_version', jsonb_build_object('type', 'string', 'default', '7.4', 'description', 'Target firmware version'),
    'model_series', jsonb_build_object('type', 'string', 'default', '248F', 'description', 'FortiSwitch model series')
  ),
  ARRAY['Firmware planning', 'Model selection', 'Feature compatibility check', 'Migration planning'],
  ARRAY['Version compatibility', 'Feature matrix', 'Migration support'],
  ARRAY['Model identification', 'Firmware version check', 'Feature requirement analysis'],
  jsonb_build_object(
    'compatibility_check', 'Model and firmware verification required',
    'migration_support', 'Step-by-step migration commands provided',
    'feature_matrix', 'Complete feature support comparison'
  ),
  ARRAY['Model and firmware compatibility matrix', 'Migration path guidance', 'Feature support comparison'],
  ARRAY['Verify model compatibility before firmware upgrade', 'Plan migration path carefully', 'Test configurations in lab environment', 'Back up configurations before migration'],
  ARRAY[
    jsonb_build_object('issue', 'Model not supported', 'solution', 'Check compatibility matrix and consider hardware upgrade'),
    jsonb_build_object('issue', 'Feature not available', 'solution', 'Verify firmware version supports required features'),
    jsonb_build_object('issue', 'Migration syntax errors', 'solution', 'Use version-specific migration commands provided')
  ],
  ARRAY['get system interface physical', 'get system status', 'diagnose hardware deviceinfo nic'],
  ARRAY['fortinet', 'fortiswitch', 'compatibility', 'firmware', 'models', 'migration'],
  true,
  true
);