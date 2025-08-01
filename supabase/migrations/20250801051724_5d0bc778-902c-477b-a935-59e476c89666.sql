-- Clean up duplicate vendors (keeping the first entry of each duplicate)
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY vendor_name, category ORDER BY created_at) as rn
  FROM vendor_library
)
DELETE FROM vendor_library 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Standardize category naming conventions
UPDATE vendor_library SET category = 'network_switches' WHERE category IN ('wired_switches', 'Network Switches', 'Switching & Routing');
UPDATE vendor_library SET category = 'wireless_access_points' WHERE category IN ('wireless_aps', 'Wireless Infrastructure');
UPDATE vendor_library SET category = 'network_routers' WHERE category IN ('routers');
UPDATE vendor_library SET category = 'network_firewalls' WHERE category IN ('firewalls', 'firewall', 'Security Appliances');
UPDATE vendor_library SET category = 'vpn_solutions' WHERE category = 'vpn_solutions';
UPDATE vendor_library SET category = 'endpoint_detection_response' WHERE category = 'edr_xdr';
UPDATE vendor_library SET category = 'siem_security_monitoring' WHERE category = 'siem_mdr';
UPDATE vendor_library SET category = 'network_monitoring' WHERE category = 'monitoring_tools';
UPDATE vendor_library SET category = 'device_inventory_management' WHERE category = 'device_inventory';
UPDATE vendor_library SET category = 'network_access_control' WHERE category IN ('nac', 'NAC', 'NAC Solutions');
UPDATE vendor_library SET category = 'radius_authentication' WHERE category = 'radius';
UPDATE vendor_library SET category = 'identity_providers' WHERE category = 'Identity Providers';
UPDATE vendor_library SET category = 'mobile_device_management' WHERE category = 'MDM Solutions';
UPDATE vendor_library SET category = 'ai_ml_analytics' WHERE category = 'AI/ML Analytics';
UPDATE vendor_library SET category = 'virtualization_platforms' WHERE category = 'Virtualization';
UPDATE vendor_library SET category = 'wireless_infrastructure' WHERE category = 'wireless';
UPDATE vendor_library SET category = 'network_infrastructure' WHERE category IN ('network', 'wired');
UPDATE vendor_library SET category = 'security_solutions' WHERE category = 'security';

-- Add comprehensive configuration templates for AI-powered generation
INSERT INTO configuration_templates (
  name, description, category, subcategory, configuration_type, 
  template_content, template_variables, ai_generated, is_public,
  supported_scenarios, authentication_methods, required_features,
  network_requirements, security_features, best_practices,
  troubleshooting_guide, validation_commands, tags, created_by
) VALUES 
-- 802.1X Templates
('802.1X Wired Authentication - Basic', 
 'Basic 802.1X configuration for wired network authentication with RADIUS',
 '802.1X Authentication', 'Wired', 'authentication',
 'interface {{interface_range}}
 authentication event fail action next-method
 authentication event server dead action authorize vlan {{auth_fail_vlan}}
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 authentication violation restrict
 mab
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}',
 '{"interface_range": "GigabitEthernet1/0/1-48", "auth_fail_vlan": "999", "reauth_timer": "3600", "tx_period": "30"}',
 true, true,
 '["wired_authentication", "employee_access", "guest_access"]',
 '["802.1X", "MAB", "RADIUS"]',
 '["dynamic_vlan_assignment", "accounting", "coa"]',
 '{"radius_server": "required", "dhcp_server": "required", "dns_server": "required"}',
 '["dynamic_vlan_assignment", "reauthentication", "session_timeout"]',
 '["Use multi-auth for multiple devices per port", "Enable MAB as fallback", "Configure proper timeout values"]',
 '["Check RADIUS connectivity", "Verify certificate trust", "Monitor authentication logs"]',
 '["show authentication sessions", "show dot1x all", "show radius statistics"]',
 '["802.1x", "wired", "authentication", "radius", "basic"]',
 null),

('802.1X Wireless Authentication - Enterprise', 
 'Enterprise-grade 802.1X wireless authentication with advanced security',
 '802.1X Authentication', 'Wireless', 'authentication',
 'wlan {{wlan_name}} {{wlan_id}} {{ssid}}
 client vlan {{client_vlan}}
 security wpa akm dot1x
 security wpa wpa2 ciphers aes
 security pmf required
 no security wpa wpa2 ciphers tkip
 session-timeout {{session_timeout}}
 radius authentication {{radius_server_group}}
 radius accounting {{radius_server_group}}
 no shutdown',
 '{"wlan_name": "ENTERPRISE", "wlan_id": "10", "ssid": "Corporate-WiFi", "client_vlan": "100", "session_timeout": "3600", "radius_server_group": "RADIUS_SERVERS"}',
 true, true,
 '["wireless_authentication", "enterprise_security", "certificate_based"]',
 '["EAP-TLS", "PEAP", "EAP-TTLS"]',
 '["wpa3_support", "pmf_protection", "fast_transition"]',
 '{"radius_server": "required", "certificate_authority": "required", "wireless_controller": "required"}',
 '["wpa3_encryption", "pmf_mandatory", "certificate_validation"]',
 '["Use WPA3 when possible", "Enable PMF for security", "Implement certificate-based auth"]',
 '["Verify RADIUS reachability", "Check certificate validity", "Monitor roaming events"]',
 '["show wlan summary", "show client summary", "show radius summary"]',
 '["802.1x", "wireless", "wpa3", "enterprise", "certificates"]',
 null),

-- Network Segmentation Templates
('VLAN Segmentation - Corporate', 
 'Corporate network VLAN segmentation with security controls',
 'Network Segmentation', 'VLAN', 'network',
 'vlan {{corporate_vlan}}
 name {{corporate_name}}
 
vlan {{guest_vlan}}
 name {{guest_name}}
 
vlan {{iot_vlan}}
 name {{iot_name}}
 
vlan {{server_vlan}}
 name {{server_name}}

interface vlan {{corporate_vlan}}
 ip address {{corporate_gateway}} {{corporate_mask}}
 ip helper-address {{dhcp_server}}
 
interface vlan {{guest_vlan}}
 ip address {{guest_gateway}} {{guest_mask}}
 ip helper-address {{dhcp_server}}',
 '{"corporate_vlan": "100", "corporate_name": "CORPORATE", "corporate_gateway": "192.168.100.1", "corporate_mask": "255.255.255.0", "guest_vlan": "200", "guest_name": "GUEST", "guest_gateway": "192.168.200.1", "guest_mask": "255.255.255.0", "iot_vlan": "300", "iot_name": "IOT", "server_vlan": "10", "server_name": "SERVERS", "dhcp_server": "10.1.1.10"}',
 true, true,
 '["network_segmentation", "access_control", "corporate_environment"]',
 '["VLAN_based", "port_based"]',
 '["inter_vlan_routing", "dhcp_relay", "access_control"]',
 '{"layer3_switch": "required", "dhcp_server": "required", "firewall": "recommended"}',
 '["vlan_isolation", "inter_vlan_filtering", "broadcast_control"]',
 '["Separate critical systems", "Implement least privilege", "Monitor inter-VLAN traffic"]',
 '["Check VLAN membership", "Verify routing tables", "Monitor DHCP assignments"]',
 '["show vlan brief", "show ip route", "show interfaces trunk"]',
 '["vlan", "segmentation", "corporate", "security"]',
 null),

-- NAC Policy Templates  
('NAC Device Profiling - Comprehensive', 
 'Comprehensive NAC device profiling with automated classification',
 'Network Access Control', 'Device Profiling', 'nac_policy',
 'device-profiling rule {{rule_name}}
 description "{{rule_description}}"
 match {{match_criteria}}
 action assign-profile {{device_profile}}
 action assign-vlan {{assigned_vlan}}
 priority {{rule_priority}}

device-profile {{device_profile}}
 description "{{profile_description}}"
 attributes
  device-type {{device_type}}
  os-family {{os_family}}
  compliance-status {{compliance_status}}
 policies
  bandwidth-limit {{bandwidth_limit}}
  session-timeout {{session_timeout}}
  access-control-list {{acl_name}}',
 '{"rule_name": "CORPORATE_WINDOWS", "rule_description": "Corporate Windows devices", "match_criteria": "dhcp-vendor-class contains Microsoft", "device_profile": "CORP_WINDOWS", "assigned_vlan": "100", "rule_priority": "10", "profile_description": "Corporate Windows workstations", "device_type": "workstation", "os_family": "windows", "compliance_status": "compliant", "bandwidth_limit": "100Mbps", "session_timeout": "28800", "acl_name": "CORPORATE_ACL"}',
 true, true,
 '["device_profiling", "automated_classification", "policy_enforcement"]',
 '["fingerprinting", "dhcp_analysis", "certificate_based"]',
 '["automated_profiling", "dynamic_policy", "compliance_checking"]',
 '{"nac_server": "required", "dhcp_monitoring": "required", "certificate_authority": "optional"}',
 '["device_fingerprinting", "behavioral_analysis", "compliance_enforcement"]',
 '["Profile unknown devices", "Implement quarantine policies", "Monitor device behavior"]',
 '["Check profiling accuracy", "Verify policy application", "Monitor quarantine events"]',
 '["show device-profiling status", "show policy summary", "show compliance status"]',
 '["nac", "device_profiling", "automated", "policy_enforcement"]',
 null),

-- Firewall Templates
('Firewall Segmentation - Zone Based', 
 'Zone-based firewall configuration for network segmentation',
 'Firewall Configuration', 'Zone Based', 'firewall',
 'zone security {{internal_zone}}
 description "{{internal_description}}"
 
zone security {{dmz_zone}}
 description "{{dmz_description}}"
 
zone security {{external_zone}}
 description "{{external_description}}"

policy-map type inspect {{policy_name}}
 class type inspect {{internal_to_external}}
  inspect
 class type inspect {{dmz_to_external}}
  inspect
 class class-default
  drop

zone-pair security {{internal_to_external}} source {{internal_zone}} destination {{external_zone}}
 service-policy type inspect {{policy_name}}

zone-pair security {{dmz_to_external}} source {{dmz_zone}} destination {{external_zone}}
 service-policy type inspect {{policy_name}}',
 '{"internal_zone": "INTERNAL", "internal_description": "Internal corporate network", "dmz_zone": "DMZ", "dmz_description": "Demilitarized zone", "external_zone": "EXTERNAL", "external_description": "External internet", "policy_name": "ZONE_POLICY", "internal_to_external": "INTERNAL_TO_EXTERNAL", "dmz_to_external": "DMZ_TO_EXTERNAL"}',
 true, true,
 '["network_segmentation", "zone_based_firewall", "security_policy"]',
 '["zone_based", "stateful_inspection"]',
 '["stateful_inspection", "application_awareness", "logging"]',
 '{"firewall": "required", "routing": "required", "monitoring": "recommended"}',
 '["zone_isolation", "stateful_inspection", "application_control"]',
 '["Define clear zone boundaries", "Implement least privilege", "Enable comprehensive logging"]',
 '["Verify zone assignments", "Check policy hits", "Monitor blocked traffic"]',
 '["show zone security", "show policy-map type inspect", "show zone-pair security"]',
 '["firewall", "zone_based", "segmentation", "security_policy"]',
 null),

-- VPN Templates
('Site-to-Site VPN - IPSec', 
 'IPSec site-to-site VPN configuration for secure connectivity',
 'VPN Configuration', 'Site-to-Site', 'vpn',
 'crypto isakmp policy {{isakmp_policy}}
 encr {{encryption}}
 hash {{hash_algorithm}}
 authentication {{auth_method}}
 group {{dh_group}}
 lifetime {{sa_lifetime}}

crypto isakmp key {{preshared_key}} address {{remote_peer}}

crypto ipsec transform-set {{transform_set}} {{transform_encryption}} {{transform_hash}}
 mode {{ipsec_mode}}

crypto map {{crypto_map}} {{sequence}} ipsec-isakmp
 set peer {{remote_peer}}
 set transform-set {{transform_set}}
 match address {{crypto_acl}}

interface {{outside_interface}}
 crypto map {{crypto_map}}

ip access-list extended {{crypto_acl}}
 permit ip {{local_network}} {{local_mask}} {{remote_network}} {{remote_mask}}',
 '{"isakmp_policy": "10", "encryption": "aes 256", "hash_algorithm": "sha256", "auth_method": "pre-share", "dh_group": "14", "sa_lifetime": "86400", "preshared_key": "SecureKey123!", "remote_peer": "203.0.113.1", "transform_set": "SITE_TO_SITE", "transform_encryption": "esp-aes 256", "transform_hash": "esp-sha256-hmac", "ipsec_mode": "tunnel", "crypto_map": "SITE_VPN", "sequence": "10", "outside_interface": "GigabitEthernet0/1", "crypto_acl": "VPN_TRAFFIC", "local_network": "192.168.1.0", "local_mask": "0.0.0.255", "remote_network": "192.168.2.0", "remote_mask": "0.0.0.255"}',
 true, true,
 '["site_to_site", "secure_connectivity", "branch_office"]',
 '["ipsec", "preshared_key", "certificate_based"]',
 '["encryption", "authentication", "integrity"]',
 '{"internet_connectivity": "required", "static_ip": "required", "firewall_rules": "required"}',
 '["aes_encryption", "sha_authentication", "perfect_forward_secrecy"]',
 '["Use strong encryption", "Implement redundancy", "Monitor tunnel status"]',
 '["Verify phase 1/2 establishment", "Check routing", "Monitor bandwidth"]',
 '["show crypto isakmp sa", "show crypto ipsec sa", "show crypto map"]',
 '["vpn", "ipsec", "site_to_site", "secure_connectivity"]',
 null),

-- Monitoring Templates
('Network Monitoring - SNMP', 
 'Comprehensive SNMP monitoring configuration for network devices',
 'Network Monitoring', 'SNMP', 'monitoring',
 'snmp-server community {{ro_community}} RO {{snmp_acl}}
snmp-server community {{rw_community}} RW {{snmp_acl}}
snmp-server location {{device_location}}
snmp-server contact {{admin_contact}}
snmp-server chassis-id {{chassis_id}}

snmp-server enable traps {{trap_types}}
snmp-server host {{nms_server}} version {{snmp_version}} {{trap_community}}

ip access-list standard {{snmp_acl}}
 permit {{nms_subnet}} {{nms_wildcard}}
 permit {{admin_subnet}} {{admin_wildcard}}
 deny any log

snmp-server trap-source {{management_interface}}
snmp-server source-interface informs {{management_interface}}',
 '{"ro_community": "public_ro", "rw_community": "private_rw", "snmp_acl": "SNMP_ACCESS", "device_location": "Data Center Rack 42", "admin_contact": "admin@company.com", "chassis_id": "DC-SW-001", "trap_types": "config-change entity-state", "nms_server": "10.1.1.100", "snmp_version": "2c", "trap_community": "trap_community", "nms_subnet": "10.1.1.0", "nms_wildcard": "0.0.0.255", "admin_subnet": "10.1.2.0", "admin_wildcard": "0.0.0.255", "management_interface": "Vlan1"}',
 true, true,
 '["network_monitoring", "device_management", "alerting"]',
 '["snmp_v2c", "snmp_v3"]',
 '["trap_generation", "polling", "access_control"]',
 '{"nms_server": "required", "network_connectivity": "required", "time_sync": "recommended"}',
 '["community_strings", "access_lists", "trap_authentication"]',
 '["Use SNMPv3 when possible", "Implement access controls", "Monitor trap generation"]',
 '["Verify SNMP connectivity", "Check trap delivery", "Monitor polling intervals"]',
 '["show snmp", "show snmp community", "show access-lists"]',
 '["snmp", "monitoring", "network_management", "alerting"]',
 null),

-- Advanced Security Templates
('Zero Trust Network Access', 
 'Zero Trust network access implementation with micro-segmentation',
 'Zero Trust Security', 'Micro-segmentation', 'security',
 '! Identity-based microsegmentation
device-tracking policy {{tracking_policy}}
 no protocol dhcp6
 no protocol ndp
 tracking enable

interface {{interface_range}}
 device-tracking attach-policy {{tracking_policy}}
 ip access-group {{dynamic_acl}} in
 authentication event server dead action authorize vlan {{quarantine_vlan}}
 authentication event server alive action reinitialize
 authentication host-mode multi-domain
 authentication order dot1x mab webauth
 authentication priority dot1x mab webauth
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 mab eap
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}

! Dynamic ACL template
ip access-list extended {{dynamic_acl}}
 remark === DYNAMIC AUTHORIZATION ===
 permit ip any any log
 
! Quarantine VLAN for non-compliant devices  
vlan {{quarantine_vlan}}
 name QUARANTINE
 
interface vlan {{quarantine_vlan}}
 ip address {{quarantine_gateway}} {{quarantine_mask}}
 ip access-group QUARANTINE_ACL in',
 '{"tracking_policy": "IPDT_POLICY", "interface_range": "range GigabitEthernet1/0/1-48", "dynamic_acl": "DYNAMIC_AUTHZ", "quarantine_vlan": "999", "reauth_timer": "3600", "tx_period": "30", "quarantine_gateway": "192.168.999.1", "quarantine_mask": "255.255.255.0"}',
 true, true,
 '["zero_trust", "micro_segmentation", "continuous_verification"]',
 '["identity_based", "device_based", "continuous_authentication"]',
 '["micro_segmentation", "continuous_monitoring", "adaptive_access"]',
 '{"ise_server": "required", "certificate_authority": "required", "siem_integration": "recommended"}',
 '["continuous_verification", "least_privilege", "adaptive_policies"]',
 '["Verify identity continuously", "Implement least privilege", "Monitor all traffic"]',
 '["Check authentication status", "Verify policy application", "Monitor access patterns"]',
 '["show device-tracking database", "show authentication sessions", "show ip access-lists"]',
 '["zero_trust", "micro_segmentation", "continuous_verification", "adaptive_security"]',
 null);

-- Add more vendor-specific configurations and AI optimization rules
UPDATE configuration_templates 
SET ai_optimization_rules = '{
  "performance_optimization": {
    "enabled": true,
    "rules": [
      {
        "condition": "high_device_count",
        "action": "optimize_timers",
        "parameters": {"reauth_timer": "7200", "tx_period": "60"}
      },
      {
        "condition": "wireless_environment", 
        "action": "enable_fast_transition",
        "parameters": {"ft_enabled": true, "ft_over_ds": true}
      }
    ]
  },
  "security_optimization": {
    "enabled": true,
    "rules": [
      {
        "condition": "high_security_environment",
        "action": "enforce_certificates",
        "parameters": {"certificate_required": true, "mab_disabled": true}
      }
    ]
  },
  "compliance_optimization": {
    "enabled": true,
    "rules": [
      {
        "condition": "pci_dss_required",
        "action": "enhance_logging",
        "parameters": {"detailed_logging": true, "log_retention": "365"}
      }
    ]
  }
}'
WHERE ai_generated = true;