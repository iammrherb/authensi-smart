-- First, let's add comprehensive vendors using the correct vendor_library schema
-- Insert comprehensive vendor data with proper conflict handling
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, integration_notes, supported_models, created_by) 
VALUES 
-- Network Infrastructure - Wired Switches
('Cisco', 'wired_switches', 'native_full', 'Full native integration with comprehensive 802.1X policy enforcement and RADIUS accounting', '["Catalyst 2960", "Catalyst 3850", "Catalyst 9300", "Nexus 7000", "Meraki MS"]', null),
('Aruba (HPE)', 'wired_switches', 'native_full', 'Native integration with ClearPass and standalone deployments supporting dynamic segmentation', '["CX 6000", "CX 8000", "ProCurve 2920", "Mobility Access Switch"]', null),
('Juniper Networks', 'wired_switches', 'native_full', 'Full RADIUS integration with Junos Space management and virtual chassis support', '["EX 2300", "EX 4300", "QFX 5000", "MX Series"]', null),
('Extreme Networks', 'wired_switches', 'certified', 'Certified integration with policy enforcement and fabric attach capabilities', '["X440", "X460", "Summit X440", "VDX 6740"]', null),
('Dell EMC', 'wired_switches', 'basic', 'Basic RADIUS integration with standard 802.1X authentication support', '["N1500", "S4100", "Z9100", "S3100"]', null),
('Huawei', 'wired_switches', 'basic', 'Basic RADIUS support with custom policy implementation through security zones', '["S5700", "S6720", "CloudEngine 6800", "S12700"]', null),
('D-Link', 'wired_switches', 'basic', 'Basic RADIUS authentication with limited policy enforcement features', '["DGS-1210", "DXS-3600", "DGS-3120", "DXS-1210"]', null),
('Netgear', 'wired_switches', 'basic', 'Standard RADIUS integration for SMB deployments with basic VLAN support', '["GS724T", "M4300", "XS712T", "GS748T"]', null),
('TP-Link', 'wired_switches', 'basic', 'Entry-level RADIUS support with basic 802.1X authentication capabilities', '["T2600G", "T1600G", "SG3428", "TL-SG3424"]', null),
('Ubiquiti', 'wired_switches', 'basic', 'UniFi Controller integration with basic policy enforcement through VLANs', '["UniFi Switch 24", "UniFi Switch Pro 48", "EdgeSwitch 24"]', null),
('Meraki', 'wired_switches', 'native_full', 'Cloud-native integration with comprehensive policy control and zero-touch deployment', '["MS120", "MS210", "MS350", "MS425"]', null),
('Brocade', 'wired_switches', 'certified', 'Legacy support with RADIUS integration for existing deployments', '["ICX 6450", "ICX 7450", "VDX 6740"]', null),
('Allied Telesis', 'wired_switches', 'basic', 'Standard RADIUS authentication with VLAN assignment capabilities', '["x930", "x510", "GS980M", "IE200"]', null),
('Alcatel-Lucent Enterprise', 'wired_switches', 'certified', 'Enterprise-grade RADIUS integration with advanced policy features', '["AOS-W", "AOS-CX", "OmniSwitch 6900"]', null),

-- Wireless Infrastructure
('Cisco Meraki', 'wireless_aps', 'native_full', 'Cloud-native integration with comprehensive policy control and guest portal management', '["MR33", "MR44", "MR55", "MR84", "MR86"]', null),
('Aruba (HPE)', 'wireless_aps', 'native_full', 'Native integration with ClearPass supporting dynamic segmentation and Airwave management', '["AP-515", "AP-535", "AP-635", "AP-655", "Instant On"]', null),
('Ubiquiti', 'wireless_aps', 'basic', 'UniFi Controller integration with basic RADIUS and guest network support', '["U6-Pro", "U6-Enterprise", "U6-Mesh", "nanoHD", "AC-Pro"]', null),
('Ruckus (CommScope)', 'wireless_aps', 'certified', 'SmartZone integration with advanced RF optimization and policy enforcement', '["R350", "R550", "R650", "R750", "R850"]', null),
('Extreme Networks', 'wireless_aps', 'certified', 'WiNG integration with fabric attach and policy-based VLAN assignment', '["AP3935i", "AP4000", "AP305C", "AP410C"]', null),
('Fortinet', 'wireless_aps', 'certified', 'FortiGate integration with security fabric and RADIUS authentication', '["FAP-221E", "FAP-431F", "FAP-433F", "FAP-832F"]', null),
('SonicWall', 'wireless_aps', 'basic', 'Basic RADIUS integration with SonicOS wireless management', '["SonicWave 231c", "SonicWave 432i", "SonicWave 641"]', null),
('Cambium Networks', 'wireless_aps', 'basic', 'cnMaestro integration with RADIUS authentication for enterprise deployments', '["XV2-2", "XV3-8", "e410", "e502S", "e600"]', null),

-- Routers
('Cisco', 'routers', 'native_full', 'Comprehensive IOS/IOS-XE integration with advanced routing and security features', '["ISR 4000", "ASR 1000", "CSR 1000v", "ISR 1100"]', null),
('Juniper Networks', 'routers', 'native_full', 'Junos OS integration with advanced MPLS and security routing capabilities', '["MX204", "MX480", "MX960", "SRX300", "vMX"]', null),
('Huawei', 'routers', 'basic', 'VRP integration with basic RADIUS authentication and routing features', '["NE20E", "NE40E", "AR1220", "AR2220", "AR3200"]', null),
('Mikrotik', 'routers', 'basic', 'RouterOS integration with hotspot system and user manager capabilities', '["CCR1009", "CCR1036", "RB4011", "hEX S", "CRS317"]', null),
('Ubiquiti', 'routers', 'basic', 'EdgeOS and UniFi integration with basic routing and firewall features', '["Dream Machine", "EdgeRouter 4", "EdgeRouter 6P", "USG Pro"]', null),
('Fortinet', 'routers', 'certified', 'FortiOS integration with SD-WAN and comprehensive security features', '["FortiGate 60F", "FortiGate 100F", "FortiGate 200F", "FortiGate 600E"]', null),
('SonicWall', 'routers', 'basic', 'SonicOS integration with basic routing and VPN capabilities', '["TZ370", "TZ470", "TZ570", "NSa 2700"]', null),
('pfSense', 'routers', 'basic', 'Open-source firewall with RADIUS integration and extensive customization', '["SG-1100", "SG-3100", "SG-5100", "XG-1537"]', null),

-- Security Infrastructure - Firewalls
('Palo Alto Networks', 'firewalls', 'native_full', 'Native User-ID integration with App-ID and comprehensive threat prevention', '["PA-220", "PA-850", "PA-3220", "PA-5220", "VM-Series"]', null),
('Fortinet', 'firewalls', 'certified', 'FortiOS integration with security fabric and SD-WAN capabilities', '["FortiGate 60F", "FortiGate 100F", "FortiGate 400F", "FortiGate 1500D"]', null),
('Check Point', 'firewalls', 'certified', 'Identity Awareness integration with comprehensive threat prevention and management', '["1570", "3200", "5800", "15600", "CloudGuard"]', null),
('Cisco ASA/FTD', 'firewalls', 'native_full', 'ASA and FTD integration with advanced threat detection and VPN capabilities', '["ASA 5506-X", "ASA 5516-X", "FTD 1140", "FTD 2130"]', null),
('SonicWall', 'firewalls', 'basic', 'SonicOS integration with threat prevention and SSL VPN features', '["TZ370", "TZ570", "NSa 2700", "NSa 4700", "NSa 6700"]', null),
('Juniper SRX', 'firewalls', 'certified', 'Junos integration with advanced threat prevention and SD-WAN', '["SRX300", "SRX1500", "SRX4600", "vSRX"]', null),
('pfSense', 'firewalls', 'basic', 'Open-source firewall with extensive customization and VPN capabilities', '["SG-1100", "SG-3100", "SG-5100", "XG-1540"]', null),
('WatchGuard', 'firewalls', 'basic', 'Fireware OS integration with threat detection and VPN features', '["T20", "T40", "T80", "M370", "M470"]', null),
('Barracuda', 'firewalls', 'basic', 'CloudGen Firewall integration with cloud-native security features', '["F18", "F80", "F200", "F400", "F900"]', null),
('Sophos', 'firewalls', 'certified', 'XG Firewall integration with synchronized security and endpoint protection', '["XG 106", "XG 136", "XG 230", "XG 330", "XG 450"]', null),

-- VPN Solutions
('Cisco AnyConnect', 'vpn_solutions', 'native_full', 'Comprehensive SSL VPN with posture assessment and certificate authentication', '["AnyConnect 4.x", "AnyConnect Plus", "AnyConnect Apex"]', null),
('Palo Alto GlobalProtect', 'vpn_solutions', 'native_full', 'Integrated VPN with User-ID and HIP (Host Information Profile) checking', '["GlobalProtect 5.x", "GlobalProtect 6.x", "Prisma Access"]', null),
('Fortinet FortiClient', 'vpn_solutions', 'certified', 'Security Fabric integration with endpoint protection and VPN capabilities', '["FortiClient 6.x", "FortiClient 7.x", "FortiClient EMS"]', null),
('Pulse Secure', 'vpn_solutions', 'certified', 'Connect Secure integration with host checker and certificate-based authentication', '["Connect Secure 9.x", "Policy Secure", "Virtual Traffic Manager"]', null),
('OpenVPN', 'vpn_solutions', 'basic', 'Open-source VPN with RADIUS integration and certificate management', '["OpenVPN Access Server", "OpenVPN Community", "CloudConnexa"]', null),
('WireGuard', 'vpn_solutions', 'basic', 'Modern VPN protocol with simple configuration and high performance', '["WireGuard", "Tailscale", "NetBird"]', null),
('NordLayer', 'vpn_solutions', 'basic', 'Cloud-based business VPN with RADIUS integration and team management', '["NordLayer Business", "NordLayer Enterprise"]', null),

-- EDR/XDR Solutions
('CrowdStrike Falcon', 'edr_xdr', 'api_integration', 'API integration for device trust scoring and threat intelligence sharing', '["Falcon Prevent", "Falcon Complete", "Falcon X"]', null),
('Microsoft Defender for Endpoint', 'edr_xdr', 'api_integration', 'Microsoft Graph API integration with Azure AD and threat intelligence', '["Defender for Endpoint P1", "Defender for Endpoint P2"]', null),
('SentinelOne', 'edr_xdr', 'api_integration', 'Management API integration with autonomous response and threat hunting', '["Singularity Core", "Singularity Complete", "Singularity Control"]', null),
('Carbon Black', 'edr_xdr', 'api_integration', 'VMware integration with behavioral analytics and threat hunting', '["CB Defense", "CB Response", "CB ThreatSight"]', null),
('Cortex XDR', 'edr_xdr', 'api_integration', 'Palo Alto integration with machine learning analytics and response automation', '["Cortex XDR Pro", "Cortex XDR Prevent", "Cortex XSOAR"]', null),

-- SIEM/MDR Solutions
('Splunk Enterprise Security', 'siem_mdr', 'log_integration', 'Comprehensive log forwarding with correlation rules and threat intelligence', '["Splunk Enterprise", "Splunk Cloud", "Phantom SOAR"]', null),
('IBM QRadar', 'siem_mdr', 'log_integration', 'Enterprise SIEM with flow analysis and advanced threat detection', '["QRadar SIEM", "QRadar SOAR", "QRadar UBA"]', null),
('Microsoft Sentinel', 'siem_mdr', 'api_integration', 'Cloud-native SIEM with Azure integration and machine learning analytics', '["Microsoft Sentinel", "Azure Monitor", "Log Analytics"]', null),
('ArcSight (Micro Focus)', 'siem_mdr', 'log_integration', 'Traditional SIEM with correlation engine and compliance reporting', '["ArcSight ESM", "ArcSight Logger", "ArcSight Intelligence"]', null),
('LogRhythm', 'siem_mdr', 'log_integration', 'Unified SIEM platform with behavioral analytics and response automation', '["LogRhythm NextGen SIEM", "LogRhythm UEBA", "LogRhythm SOAR"]', null)

ON CONFLICT (vendor_name, category) 
DO UPDATE SET
  portnox_integration_level = EXCLUDED.portnox_integration_level,
  integration_notes = EXCLUDED.integration_notes,
  supported_models = EXCLUDED.supported_models,
  updated_at = now();

-- Add comprehensive authentication methods (avoiding duplicates)
INSERT INTO authentication_methods (name, method_type, description, security_level, configuration_complexity, portnox_integration, vendor_support, documentation_links) VALUES
('OAuth 2.0', 'federation', 'Open Authorization 2.0 framework for delegated access', 'medium', 'medium', '{"native": true, "bearer_tokens": true, "refresh_tokens": true}', '["google", "microsoft", "auth0"]', '["https://docs.portnox.com/oauth"]'),
('OpenID Connect', 'federation', 'Identity layer on top of OAuth 2.0 protocol', 'high', 'medium', '{"native": true, "id_tokens": true, "userinfo_endpoint": true}', '["azure_ad", "okta", "auth0"]', '["https://docs.portnox.com/oidc"]'),
('Kerberos', 'network', 'Network authentication protocol using tickets', 'high', 'high', '{"native": true, "ticket_granting": true, "mutual_authentication": true}', '["microsoft", "mit", "heimdal"]', '["https://docs.portnox.com/kerberos"]'),
('Certificate-based', 'certificate', 'X.509 digital certificate authentication', 'very_high', 'high', '{"native": true, "client_certificates": true, "ca_validation": true}', '["microsoft_ca", "openssl", "sectigo"]', '["https://docs.portnox.com/certificates"]'),
('Multi-Factor Authentication', 'mfa', 'Multiple authentication factors for enhanced security', 'very_high', 'medium', '{"native": true, "totp": true, "sms": false, "push": true}', '["duo", "okta", "azure_mfa"]', '["https://docs.portnox.com/mfa"]'),
('Local Database', 'local', 'Local user database authentication', 'low', 'low', '{"native": true, "password_policy": true, "user_management": true}', '["portnox"]', '["https://docs.portnox.com/local-auth"]'),
('Guest Portal', 'portal', 'Web-based guest authentication portal', 'medium', 'low', '{"native": true, "customizable": true, "self_registration": true}', '["portnox"]', '["https://docs.portnox.com/guest-portal"]'),
('MAC Authentication Bypass', 'network', 'Device MAC address authentication bypass', 'low', 'low', '{"native": true, "device_profiling": true, "auto_registration": true}', '["cisco", "aruba", "extreme"]', '["https://docs.portnox.com/mab"]'),
('Web Authentication', 'portal', 'HTTP/HTTPS captive portal authentication', 'medium', 'low', '{"native": true, "captive_portal": true, "redirect_support": true}', '["cisco", "aruba", "fortinet"]', '["https://docs.portnox.com/web-auth"]')
ON CONFLICT (name) DO NOTHING;

-- Create device types library with comprehensive device categories
CREATE TABLE IF NOT EXISTS public.device_types_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  typical_os_versions jsonb DEFAULT '[]'::jsonb,
  network_requirements jsonb DEFAULT '{}'::jsonb,
  security_considerations jsonb DEFAULT '[]'::jsonb,
  authentication_methods jsonb DEFAULT '[]'::jsonb,
  deployment_considerations jsonb DEFAULT '[]'::jsonb,
  monitoring_requirements jsonb DEFAULT '[]'::jsonb,
  compliance_requirements jsonb DEFAULT '[]'::jsonb,
  vendor_specific_notes jsonb DEFAULT '{}'::jsonb,
  risk_level text DEFAULT 'medium',
  management_complexity text DEFAULT 'medium',
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS and create policies for device_types_library
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'device_types_library'
  ) THEN
    ALTER TABLE public.device_types_library ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Resource library readable by authenticated users" ON public.device_types_library
      FOR SELECT USING (true);
    
    CREATE POLICY "Users can create device types" ON public.device_types_library
      FOR INSERT WITH CHECK (true);
    
    CREATE POLICY "Users can update device types" ON public.device_types_library
      FOR UPDATE USING (true);
  END IF;
END $$;

-- Add updated_at trigger for device_types_library
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_device_types_library_updated_at'
  ) THEN
    CREATE TRIGGER update_device_types_library_updated_at
      BEFORE UPDATE ON public.device_types_library
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Insert comprehensive device types
INSERT INTO device_types_library (name, category, subcategory, description, typical_os_versions, network_requirements, security_considerations, authentication_methods, deployment_considerations, monitoring_requirements, compliance_requirements, vendor_specific_notes, risk_level, management_complexity) VALUES
-- Corporate Endpoints
('Corporate Laptops', 'endpoints', 'corporate', 'Business laptops and notebooks for corporate users', '["Windows 10/11", "macOS 12+", "Ubuntu 20.04+"]', '{"wired": "required", "wireless": "required", "vpn": "required"}', '["endpoint_protection", "full_disk_encryption", "secure_boot", "tpm_enabled"]', '["802.1x", "certificate_based", "active_directory", "smart_card"]', '["automated_imaging", "domain_join", "group_policy_deployment", "software_deployment"]', '["asset_tracking", "compliance_monitoring", "performance_monitoring", "security_posture"]', '["hipaa", "pci_dss", "sox", "gdpr"]', '{"dell": "latitude_business_class", "hp": "elitebook_series", "lenovo": "thinkpad_series", "apple": "macbook_pro_enterprise"}', 'medium', 'medium'),

('Desktop Workstations', 'endpoints', 'corporate', 'Fixed desktop computers for office environments', '["Windows 10/11 Pro", "Windows 11 Enterprise", "macOS", "Linux Desktop"]', '{"wired": "required", "wireless": "optional", "display_port": "required"}', '["endpoint_protection", "full_disk_encryption", "physical_security_lock", "bios_protection"]', '["802.1x", "certificate_based", "active_directory", "local_authentication"]', '["automated_imaging", "domain_join", "kiosk_mode_option", "peripheral_management"]', '["asset_tracking", "compliance_monitoring", "usage_analytics"]', '["hipaa", "pci_dss", "data_classification"]', '{"dell": "optiplex_business", "hp": "prodesk_elite", "lenovo": "thinkcentre_series"}', 'low', 'low'),

('Executive Devices', 'endpoints', 'executive', 'High-priority devices for C-level and senior management', '["Windows 11 Enterprise", "macOS latest", "iOS latest", "iPadOS latest"]', '{"wired": "required", "wireless": "required", "5g_cellular": "optional", "satellite": "optional"}', '["advanced_threat_protection", "dlp_enforcement", "full_encryption", "remote_wipe", "biometric_auth"]', '["certificate_based", "mfa_required", "biometric", "smart_card", "yubikey"]', '["white_glove_setup", "priority_support", "executive_onboarding", "travel_configuration"]', '["enhanced_monitoring", "executive_dashboards", "usage_analytics", "security_alerts"]', '["all_compliance_frameworks", "executive_privacy", "board_governance"]', '{"apple": "business_premium_support", "dell": "latitude_premium", "microsoft": "surface_enterprise"}', 'high', 'high'),

-- Mobile Devices
('Smartphones', 'mobile', 'phone', 'Corporate and BYOD smartphones for business use', '["iOS 16+", "iPadOS 16+", "Android 12+ Enterprise"]', '{"wireless": "required", "cellular": "required", "wifi_calling": "optional"}', '["mdm_enrollment", "app_wrapping", "containerization", "remote_wipe", "jailbreak_detection"]', '["certificate_based", "pin_policy", "biometric_required", "app_based_auth"]', '["mdm_deployment", "app_catalog_access", "byod_policy_enforcement", "carrier_integration"]', '["location_tracking_opt", "app_usage_analytics", "security_posture_monitoring", "compliance_reporting"]', '["privacy_regulations", "data_residency_requirements", "byod_governance"]', '{"apple": "dep_enrollment_vpp", "samsung": "knox_platform_workspace", "google": "android_enterprise_zero_touch"}', 'high', 'high'),

('Tablets', 'mobile', 'tablet', 'Business tablets and iPads for field work and presentations', '["iOS 16+", "iPadOS 16+", "Android 12+", "Windows 11 Pro"]', '{"wireless": "required", "cellular": "optional", "bluetooth": "required"}', '["mdm_enrollment", "app_management", "content_filtering", "supervised_mode"]', '["certificate_based", "pin_policy", "face_recognition", "guided_access"]', '["kiosk_mode_deployment", "shared_device_config", "user_assignment_rotation", "apple_school_manager"]', '["usage_analytics", "content_compliance", "device_health_monitoring"]', '["privacy_regulations", "education_compliance_coppa"]', '{"apple": "shared_ipad_classroom", "samsung": "knox_configure_kiosk", "microsoft": "surface_management_intune"}', 'medium', 'medium'),

-- Printers and Scanners
('Network Printers', 'peripherals', 'printer', 'Standard office printers with network connectivity', '["Embedded Linux", "Printer Firmware", "PostScript", "PCL"]', '{"ethernet": "required", "wireless": "optional", "usb": "optional"}', '["print_job_encryption", "user_authentication", "audit_logging", "secure_erase"]', '["active_directory_integration", "card_reader_auth", "pin_authentication", "ldap"]', '["driver_deployment_gpo", "print_queue_setup", "cost_center_assignment"]', '["print_volume_tracking", "supply_level_monitoring", "error_tracking", "maintenance_alerts"]', '["document_security_classification", "privacy_regulations_gdpr"]', '{"hp": "jetdirect_secure", "canon": "imagerunner_advance", "xerox": "connectkey_technology", "ricoh": "smartoperation_panel"}', 'medium', 'low'),

('Zebra Scanners', 'specialized', 'data_capture', 'Zebra branded barcode and RFID scanners for enterprise use', '["Link-OS", "Android Enterprise", "Scanner Firmware", "EMDK"]', '{"wireless": "preferred", "ethernet": "backup", "bluetooth": "required", "usb": "optional"}', '["data_encryption_aes", "device_authentication", "audit_logging", "tamper_detection"]', '["worker_badge_auth", "device_pairing_nfc", "app_based_authentication", "certificate_auth"]', '["staging_net_provisioning", "barcode_application_integration", "worker_training_programs", "device_lifecycle_management"]', '["scan_accuracy_metrics", "battery_life_monitoring", "productivity_analytics", "device_utilization"]', '["data_privacy_gdpr", "inventory_audit_requirements", "warehouse_safety_regulations"]', '{"zebra": "enterprise_mobility_developer_kit", "zebra_link_os": "api_integration", "zebra_savanna": "cloud_platform"}', 'low', 'low'),

-- Security Infrastructure
('IP Cameras', 'security', 'surveillance', 'Network-connected security cameras for facility monitoring', '["Embedded Linux", "Custom Firmware", "ONVIF Compliant"]', '{"ethernet": "preferred", "wifi": "optional", "poe_plus": "preferred", "fiber": "optional"}', '["video_stream_encryption", "secure_streaming_protocols", "firmware_integrity_checking", "tamper_detection"]', '["certificate_based_auth", "digest_authentication", "onvif_authentication", "radius_integration"]', '["professional_mounting", "network_configuration", "recording_server_setup", "analytics_calibration"]', '["video_analytics_alerts", "motion_detection_zones", "storage_monitoring", "bandwidth_utilization"]', '["privacy_regulations_surveillance", "data_retention_policies", "surveillance_disclosure_laws"]', '{"axis": "vapix_api_integration", "hikvision": "sadp_tool_config", "dahua": "smartpss_management", "avigilon": "appearance_search"}', 'medium', 'medium'),

-- Communications
('VoIP Desk Phones', 'communications', 'telephony', 'Traditional desk-based VoIP phones for office use', '["SIP Firmware", "H.323", "Proprietary OS", "WebRTC"]', '{"ethernet": "required", "poe": "preferred", "wifi": "optional"}', '["sip_over_tls", "srtp_encryption", "secure_provisioning", "call_encryption"]', '["sip_digest_auth", "certificate_based", "ldap_integration", "radius_auth"]', '["auto_provisioning_dhcp", "pbx_integration", "feature_programming", "firmware_management"]', '["call_quality_monitoring", "registration_status", "feature_utilization", "codec_performance"]', '["telecommunications_recording_regulations", "call_privacy_laws"]', '{"cisco": "unified_ip_phone", "polycom": "soundpoint_trio", "yealink": "sip_t_series", "avaya": "j100_series"}', 'low', 'low'),

-- Medical Devices  
('Patient Monitors', 'medical', 'monitoring', 'Bedside patient monitoring equipment for healthcare facilities', '["Medical Grade Firmware", "Real-time OS", "IEC 62304 Compliant"]', '{"ethernet": "required", "wireless": "backup", "medical_grade_isolation": "required"}', '["patient_data_encryption_aes256", "hipaa_compliance_controls", "device_authentication", "audit_logging"]', '["certificate_based_device_auth", "unique_device_identification", "secure_pairing_protocols"]', '["clinical_workflow_validation", "hl7_integration_testing", "biomedical_engineering_approval", "staff_competency_training"]', '["patient_vital_signs", "device_operational_status", "alarm_management_systems", "connectivity_monitoring"]', '["hipaa_compliance", "fda_medical_device_regulations", "iec_62304_software_lifecycle", "iso_14155_clinical_investigation"]', '{"philips": "intellivue_patient_monitoring", "ge_healthcare": "carescape_monitoring", "mindray": "umic_series_monitors"}', 'very_high', 'high'),

-- Industrial Controls
('PLCs', 'industrial', 'control', 'Programmable Logic Controllers for industrial automation', '["Ladder Logic Programming", "Function Block Diagrams", "Structured Text", "Sequential Function Charts"]', '{"ethernet_industrial": "required", "fieldbus_protocols": "required", "redundant_networks": "recommended"}', '["functional_safety_sil", "secure_communication_protocols", "change_control_procedures", "access_control_strict"]', '["engineer_certificate_auth", "role_based_access_control", "dual_approval_safety", "smart_card_authentication"]', '["safety_integrity_validation", "hazop_commissioning", "operator_training_certification", "maintenance_procedures"]', '["process_data_historians", "safety_system_monitoring", "performance_kpi_tracking", "predictive_maintenance"]', '["iec_61508_functional_safety", "iec_62443_cybersecurity", "nist_cybersecurity_framework", "nerc_cip_compliance"]', '{"rockwell_automation": "controllogix_guardlogix", "siemens": "s7_1500_safety", "schneider_electric": "modicon_m580_safety"}', 'high', 'very_high'),

-- POS Systems
('POS Terminals', 'pos', 'retail', 'Point of sale terminals for retail transactions', '["Windows 10 IoT Enterprise", "Android POS", "Linux POS", "Embedded POS OS"]', '{"ethernet": "required", "wifi": "backup", "cellular": "backup", "bluetooth": "payment_devices"}', '["payment_data_encryption", "pci_dss_compliance", "transaction_security", "end_to_end_encryption"]', '["employee_authentication", "manager_override_auth", "card_reader_integration", "biometric_optional"]', '["payment_processor_integration", "inventory_system_sync", "staff_training_pos", "compliance_auditing"]', '["transaction_volume_analytics", "inventory_levels_realtime", "performance_metrics", "fraud_detection"]', '["pci_dss_level_1", "payment_card_regulations", "consumer_privacy_laws", "tax_compliance"]', '{"ncr": "aloha_pos_system", "oracle": "micros_simphony", "square": "terminal_api", "toast": "restaurant_pos"}', 'high', 'medium'),

-- IoT and Smart Devices
('Smart Sensors', 'iot', 'environmental', 'Environmental and monitoring sensors for facility management', '["Custom Embedded OS", "Linux IoT", "FreeRTOS", "Zephyr RTOS"]', '{"wireless_protocols": "required", "low_power_networking": "required", "mesh_networking": "optional"}', '["device_identity_unique", "encrypted_communication", "secure_provisioning", "ota_security"]', '["certificate_based_device", "pre_shared_keys", "device_id_authentication", "network_authentication"]', '["bulk_provisioning_tools", "ota_update_management", "device_lifecycle_tracking", "remote_configuration"]', '["telemetry_data_collection", "anomaly_detection_ml", "sensor_health_monitoring", "environmental_alerting"]', '["iot_security_frameworks", "environmental_regulations", "building_automation_standards"]', '{"bosch": "sensortec_environmental", "honeywell": "industrial_sensing", "siemens": "building_automation_sensors", "schneider": "ecostruxure_sensors"}', 'medium', 'low')

ON CONFLICT (name, category) DO UPDATE SET
  description = EXCLUDED.description,
  typical_os_versions = EXCLUDED.typical_os_versions,
  network_requirements = EXCLUDED.network_requirements,
  security_considerations = EXCLUDED.security_considerations,
  authentication_methods = EXCLUDED.authentication_methods,
  deployment_considerations = EXCLUDED.deployment_considerations,
  monitoring_requirements = EXCLUDED.monitoring_requirements,
  compliance_requirements = EXCLUDED.compliance_requirements,
  vendor_specific_notes = EXCLUDED.vendor_specific_notes,
  risk_level = EXCLUDED.risk_level,
  management_complexity = EXCLUDED.management_complexity,
  updated_at = now();