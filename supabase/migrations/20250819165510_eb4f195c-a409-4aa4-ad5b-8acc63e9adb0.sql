-- Add wizard steps for all existing templates
INSERT INTO config_wizard_steps (
  template_id,
  step_order,
  step_name,
  step_description,
  step_type,
  required_fields,
  validation_rules,
  conditional_logic,
  help_content
) 
SELECT 
  ct.id,
  1,
  'Basic Configuration',
  'Configure basic authentication settings',
  'input',
  CASE 
    WHEN ct.category = 'cisco' THEN '["radius_server_ip", "shared_secret", "interfaces"]'::jsonb
    WHEN ct.category = 'aruba' THEN '["service_name", "employee_vlan", "contractor_vlan"]'::jsonb
    WHEN ct.category = 'fortinet' THEN '["radius_server_name", "radius_server_ip", "shared_secret"]'::jsonb
    ELSE '[]'::jsonb
  END,
  '{"required": true, "format": "object"}'::jsonb,
  '{}'::jsonb,
  'Configure the basic authentication parameters for your deployment'
FROM configuration_templates ct 
WHERE ct.name IN (
  'Cisco ISE 802.1X with EAP-TLS',
  'Cisco WLC 802.1X Wireless Authentication', 
  'Aruba ClearPass 802.1X Policy'
)
AND NOT EXISTS (
  SELECT 1 FROM config_wizard_steps cws 
  WHERE cws.template_id = ct.id AND cws.step_order = 1
);

-- Add network configuration step
INSERT INTO config_wizard_steps (
  template_id,
  step_order,
  step_name,
  step_description,
  step_type,
  required_fields,
  validation_rules,
  conditional_logic,
  help_content
) 
SELECT 
  ct.id,
  2,
  'Network Configuration',
  'Configure VLANs and network settings',
  'network',
  '["vlans", "management_vlan"]'::jsonb,
  '{"vlan_range": "1-4094", "ip_format": "ipv4"}'::jsonb,
  '{}'::jsonb,
  'Define your VLAN structure and network segmentation'
FROM configuration_templates ct 
WHERE ct.category IN ('cisco', 'aruba', 'fortinet')
AND NOT EXISTS (
  SELECT 1 FROM config_wizard_steps cws 
  WHERE cws.template_id = ct.id AND cws.step_order = 2
);

-- Add security configuration step
INSERT INTO config_wizard_steps (
  template_id,
  step_order,
  step_name,
  step_description,
  step_type,
  required_fields,
  validation_rules,
  conditional_logic,
  help_content
) 
SELECT 
  ct.id,
  3,
  'Security Settings',
  'Configure advanced security features',
  'security',
  '["certificate_validation", "posture_assessment"]'::jsonb,
  '{"security_level": "high"}'::jsonb,
  '{}'::jsonb,
  'Enable advanced security features and compliance checks'
FROM configuration_templates ct 
WHERE ct.category IN ('cisco', 'aruba', 'fortinet')
AND NOT EXISTS (
  SELECT 1 FROM config_wizard_steps cws 
  WHERE cws.template_id = ct.id AND cws.step_order = 3
);

-- Add some sample configuration generation sessions for testing
INSERT INTO config_generation_sessions (
  session_token,
  template_id,
  wizard_data,
  status,
  completion_percentage,
  ai_recommendations
) 
SELECT 
  'demo_session_' || gen_random_uuid()::text,
  ct.id,
  jsonb_build_object(
    'vendor', ct.category,
    'configuration_type', ct.configuration_type,
    'step_1_complete', true,
    'basic_config', jsonb_build_object(
      'radius_server_ip', '192.168.1.100',
      'shared_secret', 'demo_secret',
      'ssid_name', 'Corporate-WiFi'
    )
  ),
  'in_progress',
  33,
  jsonb_build_object(
    'security_score', 85,
    'recommendations', json_build_array(
      'Enable WPA3 if supported',
      'Use certificate-based authentication',
      'Implement proper VLAN segmentation'
    ),
    'best_practices', json_build_array(
      'Regular security audits recommended',
      'Monitor authentication logs',
      'Update firmware regularly'
    )
  )
FROM configuration_templates ct 
WHERE ct.category IN ('cisco', 'aruba')
LIMIT 3;