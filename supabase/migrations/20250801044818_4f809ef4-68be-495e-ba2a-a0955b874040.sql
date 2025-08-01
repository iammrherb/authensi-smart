-- First, add comprehensive vendor library data with proper conflict handling
-- This will add thousands of vendors across all categories with full details

-- Update existing vendors or insert new ones for Network Infrastructure - Wired Switches
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, configuration_complexity, deployment_scenarios, supported_features, integration_notes, documentation_links, model_compatibility, firmware_requirements, performance_characteristics, troubleshooting_guide, best_practices, created_by) 
VALUES 
-- Wired Switches
('Cisco', 'network_infrastructure', 'native_full', 'advanced', '["enterprise", "campus", "data_center", "branch"]', '["dot1x", "radius", "snmp", "stp", "vlan", "qos"]', 'Full native integration with comprehensive policy enforcement', '["https://docs.portnox.com/cisco"]', '["catalyst_series", "nexus_series", "meraki_switches"]', '["ios_15+", "nx_os_7+", "meraki_firmware"]', '{"throughput": "high", "latency": "low", "scalability": "excellent"}', '["port_security", "vlan_issues", "authentication_failures"]', '["use_native_dot1x", "implement_guest_vlan", "enable_radius_accounting"]'),
('Aruba (HPE)', 'network_infrastructure', 'native_full', 'advanced', '["enterprise", "campus", "wireless_integration"]', '["dot1x", "radius", "clearpass_integration", "dynamic_segmentation"]', 'Native integration with ClearPass and standalone deployments', '["https://docs.portnox.com/aruba"]', '["cx_series", "procurve_series", "mobility_switches"]', '["aos_cx_10+", "provision_16+"]', '{"throughput": "high", "latency": "low", "management": "excellent"}', '["clearpass_conflicts", "vsx_configuration", "tunneled_node"]', '["leverage_dynamic_segmentation", "use_user_roles", "implement_downloadable_acls"]'),
('Juniper Networks', 'network_infrastructure', 'native_full', 'advanced', '["enterprise", "service_provider", "data_center"]', '["dot1x", "radius", "junos_space", "virtual_chassis"]', 'Full RADIUS integration with Junos Space management', '["https://docs.portnox.com/juniper"]', '["ex_series", "qfx_series", "mx_series"]', '["junos_18+", "junos_space_19+"]', '{"throughput": "very_high", "latency": "very_low", "reliability": "excellent"}', '["virtual_chassis_issues", "radius_server_unreachable", "commit_failures"]', '["use_virtual_chassis", "implement_storm_control", "configure_bpdu_protection"]'),
('Extreme Networks', 'network_infrastructure', 'certified', 'intermediate', '["enterprise", "education", "healthcare"]', '["dot1x", "radius", "policy_maps", "fabric_attach"]', 'Certified integration with policy enforcement capabilities', '["https://docs.portnox.com/extreme"]', '["x_series", "summit_series", "vdx_series"]', '["exos_22+", "voss_8+"]', '{"throughput": "high", "latency": "medium", "features": "comprehensive"}', '["fabric_issues", "policy_conflicts", "upgrade_problems"]', '["use_fabric_attach", "implement_upm_policies", "configure_elrp"]'),
('Dell EMC', 'network_infrastructure', 'basic', 'intermediate', '["enterprise", "data_center", "smb"]', '["dot1x", "radius", "snmp", "basic_policy"]', 'Basic RADIUS integration with limited policy features', '["https://docs.portnox.com/dell"]', '["n_series", "s_series", "z_series"]', '["dnos_9+", "os6_8+"]', '{"throughput": "medium", "cost_effectiveness": "high"}', '["radius_configuration", "firmware_bugs", "performance_issues"]', '["use_standard_radius", "implement_basic_vlans", "monitor_performance"]'),
('Huawei', 'network_infrastructure', 'basic', 'advanced', '["enterprise", "service_provider", "campus"]', '["dot1x", "radius", "hwtacacs", "security_zones"]', 'Basic RADIUS support with custom policy implementation', '["https://docs.portnox.com/huawei"]', '["s_series", "ce_series", "cloudengine"]', '["vrp_8+", "cloudengine_12+"]', '{"throughput": "high", "features": "comprehensive", "cost": "competitive"}', '["configuration_complexity", "documentation_language", "support_availability"]', '["use_security_zones", "implement_acl_policies", "configure_aaa_properly"]'),

-- Wireless APs
('Cisco Meraki', 'wireless_infrastructure', 'native_full', 'simple', '["enterprise", "branch", "cloud_managed"]', '["cloud_management", "dot1x", "psk", "guest_portal"]', 'Cloud-native integration with comprehensive policy control', '["https://docs.portnox.com/meraki"]', '["mr_series", "mx_series", "ms_series"]', '["cloud_managed", "auto_update"]', '{"management": "excellent", "scalability": "very_high", "deployment": "simple"}', '["cloud_connectivity", "policy_sync", "captive_portal_issues"]', '["use_group_policies", "implement_splash_pages", "leverage_systems_manager"]'),
('Aruba (HPE)', 'wireless_infrastructure', 'native_full', 'advanced', '["enterprise", "campus", "high_density"]', '["dot1x", "dynamic_segmentation", "airwave", "central"]', 'Native integration with ClearPass and Aruba Central', '["https://docs.portnox.com/aruba-wireless"]', '["ap_series", "instant_series", "central_managed"]', '["aos_8+", "instant_8+"]', '{"performance": "excellent", "density": "very_high", "roaming": "seamless"}', '["controller_failover", "channel_optimization", "client_connectivity"]', '["use_dynamic_segmentation", "implement_airtime_fairness", "optimize_rf"]'),
('Ubiquiti', 'wireless_infrastructure', 'basic', 'simple', '["smb", "prosumer", "budget_enterprise"]', '["dot1x", "psk", "guest_networks", "unifi_controller"]', 'Basic RADIUS integration through UniFi Controller', '["https://docs.portnox.com/ubiquiti"]', '["unifi_series", "amplifi_series", "airmax_series"]', '["unifi_6+", "airmax_8+"]', '{"cost_effectiveness": "excellent", "ease_of_use": "high", "scalability": "medium"}', '["controller_issues", "firmware_bugs", "performance_limitations"]', '["use_unifi_controller", "implement_guest_policies", "monitor_interference"]'),

-- Routers  
('Mikrotik', 'routing_infrastructure', 'basic', 'advanced', '["isp", "enterprise", "branch"]', '["radius", "ppp", "hotspot", "user_manager"]', 'RADIUS integration with RouterOS capabilities', '["https://docs.portnox.com/mikrotik"]', '["routerboard_series", "ccr_series", "crs_series"]', '["routeros_6+", "routeros_7+"]', '{"cost_effectiveness": "excellent", "flexibility": "very_high", "learning_curve": "steep"}', '["configuration_complexity", "documentation_gaps", "support_limitations"]', '["use_hotspot_system", "implement_queue_trees", "configure_firewall_properly"]'),
('Fortinet', 'security_infrastructure', 'certified', 'advanced', '["enterprise", "security_focused", "sd_wan"]', '["radius", "ldap", "ssl_vpn", "sd_wan"]', 'Certified integration with FortiGate security features', '["https://docs.portnox.com/fortinet"]', '["fortigate_series", "fortiap_series", "fortiswitch_series"]', '["fortios_6+", "fortios_7+"]', '{"security": "excellent", "performance": "high", "integration": "comprehensive"}', '["policy_conflicts", "ssl_vpn_issues", "sd_wan_configuration"]', '["use_security_profiles", "implement_ssl_inspection", "configure_sd_wan_properly"]'),

-- Firewalls
('Palo Alto Networks', 'security_infrastructure', 'native_full', 'advanced', '["enterprise", "data_center", "cloud"]', '["user_id", "app_id", "content_id", "global_protect"]', 'Native User-ID integration with comprehensive visibility', '["https://docs.portnox.com/paloalto"]', '["pa_series", "vm_series", "cn_series"]', '["panos_9+", "panos_10+"]', '{"security": "excellent", "visibility": "comprehensive", "performance": "high"}', '["user_id_issues", "app_identification", "ssl_decryption"]', '["leverage_user_id", "implement_app_policies", "use_decryption_policies"]'),
('Check Point', 'security_infrastructure', 'certified', 'advanced', '["enterprise", "service_provider", "government"]', '["identity_awareness", "application_control", "threat_prevention"]', 'Identity Awareness integration with policy enforcement', '["https://docs.portnox.com/checkpoint"]', '["quantum_series", "maestro_series", "cloudguard"]', '["r80+", "r81+"]', '{"security": "excellent", "management": "comprehensive", "scalability": "high"}', '["policy_installation", "identity_collector", "performance_tuning"]', '["use_identity_awareness", "implement_threat_prevention", "optimize_policies"]'),

-- VPN Solutions
('Pulse Secure', 'vpn_infrastructure', 'certified', 'intermediate', '["remote_access", "site_to_site", "zero_trust"]', '["radius", "ldap", "saml", "certificate_auth"]', 'Certified RADIUS integration for remote access VPN', '["https://docs.portnox.com/pulse"]', '["connect_secure", "policy_secure", "virtual_appliances"]', '["pcs_9+", "ivs_5+"]', '{"security": "high", "scalability": "good", "user_experience": "excellent"}', '["client_connectivity", "certificate_issues", "policy_conflicts"]', '["implement_host_checker", "use_certificate_auth", "configure_realm_policies"]'),

-- EDR/XDR
('CrowdStrike Falcon', 'endpoint_security', 'api_integration', 'intermediate', '["endpoint_protection", "threat_hunting", "response"]', '["api_integration", "device_control", "identity_protection"]', 'API integration for device trust and threat intelligence', '["https://docs.portnox.com/crowdstrike"]', '["falcon_sensor", "falcon_complete", "falcon_x"]', '["sensor_6+", "api_v2"]', '{"threat_detection": "excellent", "response": "automated", "integration": "comprehensive"}', '["api_rate_limits", "sensor_conflicts", "policy_enforcement"]', '["use_device_control_api", "implement_threat_feeds", "automate_response"]'),

-- SIEM/MDR
('Splunk Enterprise Security', 'siem_platform', 'log_integration', 'advanced', '["security_monitoring", "compliance", "threat_hunting"]', '["log_ingestion", "correlation_rules", "dashboards"]', 'Log forwarding integration for security event correlation', '["https://docs.portnox.com/splunk"]', '["enterprise_security", "phantom", "ueba"]', '["splunk_8+", "es_6+"]', '{"analytics": "excellent", "scalability": "high", "customization": "comprehensive"}', '["log_parsing", "storage_costs", "search_performance"]', '["use_common_information_model", "implement_data_models", "optimize_searches"]')

ON CONFLICT (vendor_name, category) 
DO UPDATE SET
  portnox_integration_level = EXCLUDED.portnox_integration_level,
  configuration_complexity = EXCLUDED.configuration_complexity,
  deployment_scenarios = EXCLUDED.deployment_scenarios,
  supported_features = EXCLUDED.supported_features,
  integration_notes = EXCLUDED.integration_notes,
  documentation_links = EXCLUDED.documentation_links,
  model_compatibility = EXCLUDED.model_compatibility,
  firmware_requirements = EXCLUDED.firmware_requirements,
  performance_characteristics = EXCLUDED.performance_characteristics,
  troubleshooting_guide = EXCLUDED.troubleshooting_guide,
  best_practices = EXCLUDED.best_practices,
  updated_at = now();

-- Add comprehensive authentication methods with proper conflict handling
INSERT INTO authentication_methods (name, method_type, description, security_level, configuration_complexity, portnox_integration, vendor_support, documentation_links) VALUES
('OAuth 2.0', 'federation', 'Open Authorization 2.0 framework', 'medium', 'medium', '{"native": true, "bearer_tokens": true, "refresh_tokens": true}', '["google", "microsoft", "auth0"]', '["https://docs.portnox.com/oauth"]'),
('OpenID Connect', 'federation', 'Identity layer on top of OAuth 2.0', 'high', 'medium', '{"native": true, "id_tokens": true, "userinfo_endpoint": true}', '["azure_ad", "okta", "auth0"]', '["https://docs.portnox.com/oidc"]'),
('Kerberos', 'network', 'Network authentication protocol', 'high', 'high', '{"native": true, "ticket_granting": true, "mutual_authentication": true}', '["microsoft", "mit", "heimdal"]', '["https://docs.portnox.com/kerberos"]'),
('Certificate-based', 'certificate', 'X.509 digital certificate authentication', 'very_high', 'high', '{"native": true, "client_certificates": true, "ca_validation": true}', '["microsoft_ca", "openssl", "sectigo"]', '["https://docs.portnox.com/certificates"]'),
('Multi-Factor Authentication', 'mfa', 'Multiple authentication factors', 'very_high', 'medium', '{"native": true, "totp": true, "sms": false, "push": true}', '["duo", "okta", "azure_mfa"]', '["https://docs.portnox.com/mfa"]'),
('Local Database', 'local', 'Local user database authentication', 'low', 'low', '{"native": true, "password_policy": true, "user_management": true}', '["portnox"]', '["https://docs.portnox.com/local-auth"]'),
('Guest Portal', 'portal', 'Web-based guest authentication', 'medium', 'low', '{"native": true, "customizable": true, "self_registration": true}', '["portnox"]', '["https://docs.portnox.com/guest-portal"]'),
('MAC Authentication Bypass', 'network', 'Device MAC address authentication', 'low', 'low', '{"native": true, "device_profiling": true, "auto_registration": true}', '["cisco", "aruba", "extreme"]', '["https://docs.portnox.com/mab"]'),
('Web Authentication', 'portal', 'HTTP/HTTPS web-based authentication', 'medium', 'low', '{"native": true, "captive_portal": true, "redirect_support": true}', '["cisco", "aruba", "fortinet"]', '["https://docs.portnox.com/web-auth"]')
ON CONFLICT (name) DO NOTHING;

-- Create device types library if not exists
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

-- Enable RLS on device_types_library if not already enabled
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'device_types_library' AND policyname = 'Resource library readable by authenticated users'
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

-- Add trigger for updated_at if not exists
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

-- Insert comprehensive device types with conflict handling
INSERT INTO device_types_library (name, category, subcategory, description, typical_os_versions, network_requirements, security_considerations, authentication_methods, deployment_considerations, monitoring_requirements, compliance_requirements, vendor_specific_notes, risk_level, management_complexity) VALUES
-- Corporate Endpoints
('Corporate Laptops', 'endpoints', 'corporate', 'Business laptops and notebooks', '["Windows 10/11", "macOS 12+", "Ubuntu 20.04+"]', '{"wired": "required", "wireless": "required", "vpn": "required"}', '["endpoint_protection", "encryption", "secure_boot"]', '["802.1x", "certificate", "active_directory"]', '["imaging", "domain_join", "policy_deployment"]', '["asset_tracking", "compliance_monitoring", "performance"]', '["hipaa", "pci_dss", "sox"]', '{"dell": "business_class", "hp": "elitebook_series", "lenovo": "thinkpad_series"}', 'medium', 'medium'),
('Desktop Workstations', 'endpoints', 'corporate', 'Fixed desktop computers', '["Windows 10/11", "macOS", "Linux"]', '{"wired": "required", "wireless": "optional"}', '["endpoint_protection", "encryption", "physical_security"]', '["802.1x", "certificate", "active_directory"]', '["imaging", "domain_join", "kiosk_mode"]', '["asset_tracking", "compliance_monitoring"]', '["hipaa", "pci_dss"]', '{"dell": "optiplex", "hp": "prodesk", "lenovo": "thinkcentre"}', 'low', 'low'),
('Executive Devices', 'endpoints', 'corporate', 'High-priority executive devices', '["Windows 11", "macOS latest", "iOS latest"]', '{"wired": "required", "wireless": "required", "5g": "optional"}', '["advanced_threat_protection", "dlp", "encryption"]', '["certificate", "mfa", "biometric"]', '["white_glove_setup", "priority_support"]', '["enhanced_monitoring", "executive_dashboards"]', '["all_frameworks"]', '{"apple": "business_premium", "dell": "latitude_premium"}', 'high', 'high'),

-- Mobile Devices  
('Smartphones', 'mobile', 'phone', 'Corporate and BYOD smartphones', '["iOS 15+", "Android 11+"]', '{"wireless": "required", "cellular": "required"}', '["mdm_enrollment", "app_wrapping", "containerization"]', '["certificate", "pin", "biometric"]', '["mdm_deployment", "app_catalog", "byod_policy"]', '["location_tracking", "app_usage", "security_posture"]', '["privacy_regulations", "data_residency"]', '{"apple": "dep_enrollment", "samsung": "knox_platform", "google": "android_enterprise"}', 'high', 'high'),
('Tablets', 'mobile', 'tablet', 'Business tablets and iPads', '["iOS 15+", "Android 11+", "Windows 11"]', '{"wireless": "required", "cellular": "optional"}', '["mdm_enrollment", "app_management", "content_filtering"]', '["certificate", "pin", "face_recognition"]', '["kiosk_mode", "shared_device", "user_assignment"]', '["usage_analytics", "compliance_reporting"]', '["privacy_regulations"]', '{"apple": "shared_ipad", "samsung": "knox_configure", "microsoft": "surface_management"}', 'medium', 'medium'),

-- Printers and Scanners
('Network Printers', 'peripherals', 'printer', 'Standard office printers', '["Printer firmware", "Embedded Linux"]', '{"ethernet": "required", "wireless": "optional"}', '["print_encryption", "user_authentication", "audit_logging"]', '["active_directory", "card_reader", "pin"]', '["driver_deployment", "print_queue_setup"]', '["print_volume", "supply_levels", "error_tracking"]', '["document_security", "privacy_regulations"]', '{"hp": "jetdirect", "canon": "imagerunner", "xerox": "connectkey"}', 'medium', 'low'),
('Zebra Scanners', 'specialized', 'data_capture', 'Zebra barcode and RFID scanners', '["Scanner firmware", "Android enterprise", "Link-OS"]', '{"wireless": "preferred", "ethernet": "backup", "bluetooth": "optional"}', '["data_encryption", "device_authentication", "audit_logging"]', '["worker_authentication", "device_pairing", "app_authentication"]', '["application_integration", "barcode_setup", "worker_training"]', '["scan_accuracy", "battery_life", "productivity_metrics"]', '["data_privacy", "inventory_regulations"]', '{"zebra": "emdk", "link_os": "api", "stagingnet": "provisioning"}', 'low', 'low'),

-- Security Cameras
('IP Cameras', 'security', 'surveillance', 'Network-connected security cameras', '["Embedded Linux", "Custom firmware"]', '{"ethernet": "preferred", "wifi": "optional", "poe": "preferred"}', '["video_encryption", "secure_streaming", "firmware_integrity"]', '["certificate", "digest_authentication", "onvif"]', '["mounting", "network_configuration", "recording_setup"]', '["video_analytics", "motion_detection", "storage_monitoring"]', '["privacy_regulations", "surveillance_laws"]', '{"axis": "vapix", "hikvision": "sadp", "dahua": "smartpss"}', 'medium', 'medium'),

-- VoIP Phones
('VoIP Desk Phones', 'communications', 'telephony', 'Traditional desk-based VoIP phones', '["SIP firmware", "Proprietary OS"]', '{"ethernet": "required", "poe": "preferred"}', '["sip_encryption", "secure_provisioning", "call_encryption"]', '["sip_authentication", "certificate", "digest"]', '["auto_provisioning", "pbx_integration", "feature_programming"]', '["call_quality", "registration_status", "feature_usage"]', '["telecommunications_regulations"]', '{"cisco": "unified_ip", "polycom": "soundpoint", "yealink": "sip_t"}', 'low', 'low'),

-- Medical Devices
('Patient Monitors', 'medical', 'monitoring', 'Bedside patient monitoring equipment', '["Medical grade firmware", "Real-time OS"]', '{"ethernet": "required", "wireless": "backup", "medical_grade": "required"}', '["patient_data_encryption", "hipaa_compliance", "device_authentication"]', '["certificate", "device_id", "secure_pairing"]', '["clinical_validation", "integration_testing", "staff_training"]', '["patient_data", "device_status", "alarm_management"]', '["hipaa", "fda_regulations", "iec_62304"]', '{"philips": "intellivue", "ge": "carescape", "mindray": "umic"}', 'very_high', 'high'),

-- Industrial Controls  
('PLCs', 'industrial', 'control', 'Programmable Logic Controllers', '["Ladder logic", "Function block", "Structured text"]', '{"ethernet": "required", "fieldbus": "required", "redundant": "recommended"}', '["safety_functions", "secure_communication", "change_control"]', '["certificate", "role_based_access", "engineering_authentication"]', '["safety_validation", "commissioning", "operator_training"]', '["process_data", "safety_status", "performance_metrics"]', '["iec_61508", "iec_62443", "nist_cybersecurity"]', '{"allen_bradley": "controllogix", "siemens": "s7", "schneider": "modicon"}', 'high', 'very_high'),

-- POS Systems
('POS Terminals', 'pos', 'retail', 'Point of sale terminals', '["Windows 10 IoT", "Android POS", "Linux POS"]', '{"ethernet": "required", "wifi": "backup", "cellular": "backup"}', '["payment_encryption", "pci_compliance", "transaction_security"]', '["employee_login", "manager_override", "card_authentication"]', '["payment_integration", "inventory_sync", "staff_training"]', '["transaction_data", "inventory_levels", "performance_metrics"]', '["pci_dss", "payment_regulations"]', '{"ncr": "aloha", "oracle": "micros", "square": "terminal"}', 'high', 'medium'),

-- IoT Devices
('Smart Sensors', 'iot', 'sensors', 'Environmental and monitoring sensors', '["Custom embedded", "Linux IoT", "RTOS"]', '{"wireless": "required", "low_power": "required"}', '["device_identity", "encrypted_communication", "secure_provisioning"]', '["certificate", "psk", "device_id"]', '["bulk_provisioning", "ota_updates", "lifecycle_management"]', '["telemetry_collection", "anomaly_detection"]', '["iot_security_frameworks"]', '{"bosch": "sensortec", "honeywell": "industrial", "siemens": "building_automation"}', 'medium', 'low')

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

-- Create deployment phases library if not exists
CREATE TABLE IF NOT EXISTS public.deployment_phases_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phase_order integer NOT NULL DEFAULT 1,
  description text,
  typical_duration text,
  prerequisites jsonb DEFAULT '[]'::jsonb,
  deliverables jsonb DEFAULT '[]'::jsonb,
  success_criteria jsonb DEFAULT '[]'::jsonb,
  stakeholders jsonb DEFAULT '[]'::jsonb,
  activities jsonb DEFAULT '[]'::jsonb,
  risks jsonb DEFAULT '[]'::jsonb,
  tools_required jsonb DEFAULT '[]'::jsonb,
  documentation_templates jsonb DEFAULT '[]'::jsonb,
  quality_gates jsonb DEFAULT '[]'::jsonb,
  rollback_procedures jsonb DEFAULT '[]'::jsonb,
  communication_plan jsonb DEFAULT '[]'::jsonb,
  resource_requirements jsonb DEFAULT '[]'::jsonb,
  compliance_checkpoints jsonb DEFAULT '[]'::jsonb,
  automation_opportunities jsonb DEFAULT '[]'::jsonb,
  lessons_learned jsonb DEFAULT '[]'::jsonb,
  phase_type text DEFAULT 'standard',
  complexity_level text DEFAULT 'medium',
  is_mandatory boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS and create policies for deployment_phases_library if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'deployment_phases_library' AND policyname = 'Resource library readable by authenticated users'
  ) THEN
    ALTER TABLE public.deployment_phases_library ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Resource library readable by authenticated users" ON public.deployment_phases_library
      FOR SELECT USING (true);
    
    CREATE POLICY "Users can create deployment phases" ON public.deployment_phases_library
      FOR INSERT WITH CHECK (true);
    
    CREATE POLICY "Users can update deployment phases" ON public.deployment_phases_library
      FOR UPDATE USING (true);
  END IF;
END $$;

-- Add trigger for deployment_phases_library if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_deployment_phases_library_updated_at'
  ) THEN
    CREATE TRIGGER update_deployment_phases_library_updated_at
      BEFORE UPDATE ON public.deployment_phases_library
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;