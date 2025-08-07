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
end',
'advanced',
'{"radius_server_name": "RADIUS-Server", "radius_server_ip": "192.168.1.100", "shared_secret": "fortinet_secret", "user_group_name": "Authenticated_Users"}',
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
set network interface ethernet {{interface_name}} layer3 interface-management-profile allow-radius',
'advanced',
'{"radius_profile_name": "RADIUS-Profile", "radius_server_ip": "192.168.1.100", "shared_secret": "palo_secret", "auth_profile_name": "Auth-Profile", "interface_name": "ethernet1/1", "interface_ip": "192.168.100.1", "subnet_mask": "24"}',
'["RADIUS", "802.1X", "Firewall", "Authentication"]',
'["show authentication-profile", "show server-profile", "test authentication authentication-profile"]',
'["Verify RADIUS connectivity", "Configure backup authentication", "Test with known good credentials"]',
true),

('CrowdStrike Falcon Integration', 'CrowdStrike Falcon EDR integration with network access control', 'Security', 'EDR', 'integration',
'# CrowdStrike Falcon EDR Integration
# API Configuration for Real-time Device Trust
api_endpoint: "https://api.crowdstrike.com"
api_version: "v1"
client_id: "{{falcon_client_id}}"
client_secret: "{{falcon_client_secret}}"

# Device Trust Policy
device_trust_policy:
  enabled: true
  trust_levels:
    - high: "device_healthy"
    - medium: "device_suspicious"
    - low: "device_quarantine"
  
# Real-time Assessment
assessment_frequency: "real-time"
threat_detection: true
behavioral_analysis: true',
'advanced',
'{"falcon_client_id": "your_client_id", "falcon_client_secret": "your_client_secret", "organization_id": "your_org_id"}',
'["EDR", "CrowdStrike", "Device Trust", "Real-time"]',
'["curl -X GET api.crowdstrike.com/devices/queries/devices/v1", "verify threat detection"]',
'["Test API connectivity first", "Monitor device trust scores", "Set up real-time alerts for threats"]',
true),

('Okta SAML SSO Configuration', 'Complete SAML Single Sign-On configuration for Okta identity provider', 'Identity', 'SSO', 'authentication',
'# Okta SAML SSO Configuration
# Identity Provider Settings
idp_entity_id: "http://www.okta.com/{{okta_app_id}}"
idp_sso_url: "https://{{okta_domain}}.okta.com/app/{{okta_app_name}}/{{okta_app_id}}/sso/saml"
idp_logout_url: "https://{{okta_domain}}.okta.com/app/{{okta_app_name}}/{{okta_app_id}}/slo/saml"

# Certificate Configuration
x509_certificate: "{{saml_certificate}}"

# Attribute Mapping
attribute_mapping:
  email: "user.email"
  first_name: "user.firstName"
  last_name: "user.lastName"
  groups: "user.groups"',
'intermediate',
'{"okta_domain": "your-domain", "okta_app_id": "app_id", "okta_app_name": "app_name", "saml_certificate": "certificate_content"}',
'["SAML", "SSO", "Okta", "Identity"]',
'["curl -X POST okta.com/api/v1/sessions", "verify SAML response"]',
'["Test SAML flow in staging", "Configure attribute mapping correctly", "Set up group-based access"]',
true)

ON CONFLICT (name) DO NOTHING;