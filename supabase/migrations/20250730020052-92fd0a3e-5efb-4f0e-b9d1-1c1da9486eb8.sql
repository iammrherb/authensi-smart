-- Add comprehensive vendor models table
CREATE TABLE public.vendor_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  model_name TEXT NOT NULL,
  model_series TEXT,
  firmware_versions TEXT[] DEFAULT ARRAY[]::TEXT[],
  hardware_specs JSONB DEFAULT '{}'::JSONB,
  port_configurations JSONB DEFAULT '{}'::JSONB,
  supported_features TEXT[] DEFAULT ARRAY[]::TEXT[],
  eol_date DATE,
  eos_date DATE,
  documentation_links JSONB DEFAULT '[]'::JSONB,
  configuration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Add RLS policies for vendor_models
ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendor models are readable by authenticated users" 
ON public.vendor_models 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create vendor models" 
ON public.vendor_models 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own vendor models" 
ON public.vendor_models 
FOR UPDATE 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own vendor models" 
ON public.vendor_models 
FOR DELETE 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_vendor_models_updated_at
BEFORE UPDATE ON public.vendor_models
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enhance vendor_library table with more comprehensive fields
ALTER TABLE public.vendor_library 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS version TEXT,
ADD COLUMN IF NOT EXISTS vendor_website TEXT,
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS support_tiers JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS integration_complexity TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS deployment_notes TEXT,
ADD COLUMN IF NOT EXISTS testing_notes TEXT,
ADD COLUMN IF NOT EXISTS best_practices JSONB DEFAULT '[]'::JSONB;

-- Add comprehensive config template categories
ALTER TABLE public.configuration_templates 
ADD COLUMN IF NOT EXISTS template_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS compatibility_matrix JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS deployment_scenarios JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS testing_procedures JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS rollback_procedures JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS maintenance_schedule JSONB DEFAULT '{}'::JSONB;

-- Enhanced project templates with more comprehensive fields
ALTER TABLE public.project_templates 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS success_metrics JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS risk_assessments JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS resource_requirements JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS stakeholder_matrix JSONB DEFAULT '[]'::JSONB;

-- Enhanced requirements library
ALTER TABLE public.requirements_library 
ADD COLUMN IF NOT EXISTS business_impact TEXT,
ADD COLUMN IF NOT EXISTS technical_impact TEXT,
ADD COLUMN IF NOT EXISTS implementation_cost TEXT,
ADD COLUMN IF NOT EXISTS maintenance_effort TEXT,
ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS mitigation_strategies JSONB DEFAULT '[]'::JSONB;

-- Enhanced use case library
ALTER TABLE public.use_case_library 
ADD COLUMN IF NOT EXISTS business_impact TEXT,
ADD COLUMN IF NOT EXISTS technical_complexity TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS estimated_timeline TEXT,
ADD COLUMN IF NOT EXISTS resource_requirements JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS success_metrics JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS risk_factors JSONB DEFAULT '[]'::JSONB;

-- Create comprehensive switch configuration templates
INSERT INTO public.configuration_templates (
  name, 
  description, 
  vendor_id, 
  category, 
  subcategory,
  configuration_type,
  template_content,
  template_variables,
  tags,
  complexity_level,
  best_practices,
  validation_commands,
  troubleshooting_guide
) VALUES 
(
  'Cisco Catalyst 9300 802.1X Full',
  'Complete 802.1X configuration for Cisco Catalyst 9300 series switches with all features enabled',
  NULL,
  '802.1X',
  'Enterprise Authentication',
  'switch_config',
  '! Cisco Catalyst 9300 802.1X Configuration
! Global 802.1X Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! RADIUS Configuration
radius server {{radius_server_name}}
 address ipv4 {{radius_server_ip}} auth-port {{auth_port}} acct-port {{acct_port}}
 key {{radius_shared_secret}}
 automate-tester username {{test_username}}
 timeout {{radius_timeout}}
 retransmit {{radius_retries}}

radius-server attribute 6 on-for-login-auth
radius-server attribute 6 support-multiple
radius-server attribute 8 include-in-access-req
radius-server attribute 25 access-request include
radius-server vsa send accounting
radius-server vsa send authentication

! Global 802.1X Settings
dot1x system-auth-control
dot1x critical eapol

! Interface Configuration Template
interface {{interface_range}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{access_vlan}}
 switchport voice vlan {{voice_vlan}}
 authentication host-mode {{host_mode}}
 authentication port-control {{port_control}}
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 authentication timer inactivity {{inactivity_timer}}
 authentication violation {{violation_action}}
 mab
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}
 spanning-tree portfast
 spanning-tree bpduguard enable

! Dynamic VLAN Assignment
vlan {{dynamic_vlan_range}}

! Monitor Sessions for Troubleshooting
monitor session 1 source interface {{monitor_interface}}
monitor session 1 destination interface {{destination_interface}}',
  '{
    "radius_server_name": "ISE-PRIMARY",
    "radius_server_ip": "192.168.1.10",
    "auth_port": "1812",
    "acct_port": "1813", 
    "radius_shared_secret": "SharedSecret123",
    "test_username": "test-user",
    "radius_timeout": "5",
    "radius_retries": "3",
    "interface_range": "GigabitEthernet1/0/1-48",
    "interface_description": "802.1X Enabled Port",
    "access_vlan": "10",
    "voice_vlan": "20",
    "host_mode": "multi-auth",
    "port_control": "auto",
    "reauth_timer": "3600",
    "inactivity_timer": "300",
    "violation_action": "restrict",
    "tx_period": "30",
    "dynamic_vlan_range": "100-200",
    "monitor_interface": "GigabitEthernet1/0/1",
    "destination_interface": "GigabitEthernet1/0/48"
  }',
  ARRAY['cisco', '802.1x', 'radius', 'switch', 'authentication']::TEXT[],
  'intermediate',
  '[
    "Always test RADIUS connectivity before enabling 802.1X",
    "Use monitor sessions for troubleshooting authentication issues", 
    "Implement gradual rollout starting with test VLANs",
    "Configure guest VLAN for fallback scenarios",
    "Enable periodic reauthentication for enhanced security"
  ]'::JSONB,
  '[
    "test radius-server {{radius_server_name}} username {{test_username}} password {{test_password}}",
    "show dot1x all summary",
    "show authentication sessions",
    "show radius statistics"
  ]'::JSONB,
  '[
    {
      "issue": "Authentication timeout",
      "solution": "Check RADIUS server connectivity and shared secret",
      "commands": ["show radius statistics", "test radius-server"]
    },
    {
      "issue": "VLAN assignment not working", 
      "solution": "Verify RADIUS attributes and VLAN configuration",
      "commands": ["show authentication sessions interface", "show vlan brief"]
    }
  ]'::JSONB
);

-- Add more comprehensive switch templates
INSERT INTO public.configuration_templates (name, description, category, subcategory, configuration_type, template_content, template_variables, tags, complexity_level) VALUES
('Aruba CX 6300 802.1X Advanced', 'Advanced 802.1X configuration for Aruba CX 6300 series with dynamic segmentation', '802.1X', 'Dynamic Segmentation', 'switch_config',
'# Aruba CX 6300 802.1X Configuration
aaa authentication port-access dot1x authenticator radius
aaa authentication port-access mac-auth radius  

# RADIUS Server Configuration
radius-server host {{radius_server_ip}} key {{radius_shared_secret}}
radius-server host {{radius_server_ip}} auth-port {{auth_port}}
radius-server host {{radius_server_ip}} acct-port {{acct_port}}

# Interface Configuration
interface {{interface_range}}
    no shutdown
    no routing
    vlan access {{access_vlan}}
    aaa authentication port-access client-limit {{client_limit}}
    aaa authentication port-access mode authenticator
    aaa authentication port-access apply
    
# Dynamic Segmentation
policy device-profile {{device_profile_name}}
    tag {{device_tag}}
    action {{policy_action}}',
'{"radius_server_ip": "10.1.1.100", "radius_shared_secret": "ArubaSecret123", "auth_port": "1812", "acct_port": "1813", "interface_range": "1/1/1-1/1/48", "access_vlan": "100", "client_limit": "8", "device_profile_name": "corporate-devices", "device_tag": "trusted", "policy_action": "permit"}',
ARRAY['aruba', '802.1x', 'cx6300', 'segmentation']::TEXT[],
'advanced');

-- Create comprehensive vendor switch configurations
CREATE TABLE public.vendor_switch_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  model_series TEXT NOT NULL,
  switch_model TEXT NOT NULL,
  firmware_version TEXT,
  config_category TEXT NOT NULL,
  config_name TEXT NOT NULL,
  config_description TEXT,
  base_configuration TEXT NOT NULL,
  advanced_features JSONB DEFAULT '{}'::JSONB,
  use_case_scenarios JSONB DEFAULT '[]'::JSONB,
  deployment_notes TEXT,
  testing_commands JSONB DEFAULT '[]'::JSONB,
  troubleshooting_guide JSONB DEFAULT '[]'::JSONB,
  best_practices JSONB DEFAULT '[]'::JSONB,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- RLS for vendor_switch_configs
ALTER TABLE public.vendor_switch_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Switch configs are readable by authenticated users" 
ON public.vendor_switch_configs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create switch configs" 
ON public.vendor_switch_configs 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own switch configs" 
ON public.vendor_switch_configs 
FOR UPDATE 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own switch configs" 
ON public.vendor_switch_configs 
FOR DELETE 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));