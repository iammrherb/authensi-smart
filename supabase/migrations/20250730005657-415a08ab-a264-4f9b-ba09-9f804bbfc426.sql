-- Enhanced vendor library with comprehensive vendor data
CREATE TABLE IF NOT EXISTS public.vendor_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'network', -- network, security, wireless, etc
  vendor_type TEXT NOT NULL DEFAULT 'switch', -- switch, router, firewall, wireless, etc
  status TEXT NOT NULL DEFAULT 'active',
  description TEXT,
  website_url TEXT,
  support_contact JSONB DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  portnox_integration_level TEXT DEFAULT 'supported', -- certified, supported, beta, unsupported
  portnox_documentation JSONB DEFAULT '{}', -- links, guides, best practices
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Vendor models and firmware versions
CREATE TABLE IF NOT EXISTS public.vendor_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_series TEXT,
  firmware_versions JSONB DEFAULT '[]', -- array of supported firmware versions
  hardware_specs JSONB DEFAULT '{}',
  port_configurations JSONB DEFAULT '{}',
  supported_features JSONB DEFAULT '[]', -- 802.1x, TACACS, RADSEC, etc
  eol_date DATE,
  eos_date DATE,
  documentation_links JSONB DEFAULT '[]',
  configuration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enhanced configuration templates
CREATE TABLE IF NOT EXISTS public.configuration_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  vendor_id UUID REFERENCES public.vendor_library(id),
  model_id UUID REFERENCES public.vendor_models(id),
  category TEXT NOT NULL, -- 802.1x, TACACS, RADSEC, Guest, etc
  subcategory TEXT, -- Multi-Auth, Multi-Domain, COA, etc
  configuration_type TEXT NOT NULL, -- switch, router, firewall, wireless
  complexity_level TEXT DEFAULT 'intermediate', -- basic, intermediate, advanced, expert
  template_content TEXT NOT NULL, -- actual config template
  template_variables JSONB DEFAULT '{}', -- variables that can be customized
  supported_scenarios JSONB DEFAULT '[]', -- onboarding, quarantine, guest, etc
  authentication_methods JSONB DEFAULT '[]', -- EAP-TLS, PEAP, MAB, etc
  required_features JSONB DEFAULT '[]', -- VSAs, Device tracking, port security, etc
  network_requirements JSONB DEFAULT '{}', -- VLANs, IP helpers, DHCP, etc
  security_features JSONB DEFAULT '[]', -- DACLs, port security, storm control, etc
  best_practices JSONB DEFAULT '[]',
  troubleshooting_guide JSONB DEFAULT '[]',
  validation_commands JSONB DEFAULT '[]', -- commands to verify config
  tags JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  is_public BOOLEAN DEFAULT true,
  is_validated BOOLEAN DEFAULT false,
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Configuration files storage (for uploaded configs)
CREATE TABLE IF NOT EXISTS public.configuration_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT, -- path in storage bucket or base64 content
  file_type TEXT DEFAULT 'config', -- config, backup, template
  file_size INTEGER,
  content_type TEXT DEFAULT 'text/plain',
  vendor_id UUID REFERENCES public.vendor_library(id),
  model_id UUID REFERENCES public.vendor_models(id),
  template_id UUID REFERENCES public.configuration_templates(id),
  metadata JSONB DEFAULT '{}',
  tags JSONB DEFAULT '[]',
  is_encrypted BOOLEAN DEFAULT false,
  checksum TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Authentication workflows and scenarios
CREATE TABLE IF NOT EXISTS public.network_authentication_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  scenario_type TEXT NOT NULL, -- guest, employee, contractor, iot, etc
  authentication_flow JSONB NOT NULL, -- step by step flow
  required_components JSONB DEFAULT '[]', -- radius, ad, certificates, etc
  configuration_steps JSONB DEFAULT '[]',
  vendor_specific_configs JSONB DEFAULT '{}', -- configs per vendor
  troubleshooting_steps JSONB DEFAULT '[]',
  security_considerations JSONB DEFAULT '[]',
  compliance_requirements JSONB DEFAULT '[]',
  use_cases JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insert comprehensive vendor data
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation) VALUES
-- Network Vendors
('Cisco', 'network', 'switch', 'Leading network infrastructure vendor with comprehensive switch portfolio', 'https://cisco.com', 'certified', '{"guides": ["cisco-catalyst-guide.pdf"], "best_practices": ["cisco-802.1x-bp.pdf"], "integration_notes": "Full support for all Catalyst series"}'),
('Aruba', 'network', 'switch', 'HPE Aruba networking switches with advanced security features', 'https://arubanetworks.com', 'certified', '{"guides": ["aruba-cx-guide.pdf"], "best_practices": ["aruba-clearpass-integration.pdf"]}'),
('Fortinet', 'security', 'firewall', 'Enterprise security and networking solutions', 'https://fortinet.com', 'supported', '{"guides": ["fortigate-802.1x.pdf"], "integration_notes": "FortiGate firewall integration"}'),
('Juniper', 'network', 'switch', 'High-performance networking solutions', 'https://juniper.net', 'supported', '{"guides": ["juniper-ex-series.pdf"], "best_practices": ["juniper-802.1x-config.pdf"]}'),
('Extreme Networks', 'network', 'switch', 'Cloud-driven networking solutions', 'https://extremenetworks.com', 'supported', '{"guides": ["extreme-exos-guide.pdf"]}'),
('Arista', 'network', 'switch', 'Cloud networking solutions', 'https://arista.com', 'supported', '{"guides": ["arista-eos-guide.pdf"]}'),
('HP Enterprise', 'network', 'switch', 'Enterprise networking infrastructure', 'https://hpe.com', 'supported', '{"guides": ["hpe-procurve-guide.pdf"]}'),
('Dell Technologies', 'network', 'switch', 'Enterprise networking and infrastructure', 'https://dell.com', 'supported', '{"guides": ["dell-os10-guide.pdf"]}');

-- Insert vendor models with comprehensive data
INSERT INTO public.vendor_models (vendor_id, model_name, model_series, firmware_versions, supported_features, configuration_notes) VALUES
-- Cisco Models
((SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco'), 'Catalyst 9300', 'Catalyst 9000', 
 '["16.12.10", "17.06.05", "17.09.04", "17.12.01"]', 
 '["802.1x", "MAB", "TACACS+", "RADSEC", "Multi-Auth", "Multi-Domain", "COA", "VSAs", "DACL", "Dynamic VLAN", "Port Security", "IP Helper", "Guest VLAN", "Quarantine VLAN"]',
 'Supports advanced 802.1x features including flexible authentication'),

((SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco'), 'Catalyst 9200', 'Catalyst 9000',
 '["16.12.10", "17.06.05", "17.09.04"]',
 '["802.1x", "MAB", "TACACS+", "Multi-Auth", "COA", "Dynamic VLAN", "Port Security"]',
 'Entry-level access switch with essential 802.1x features'),

-- Aruba Models  
((SELECT id FROM public.vendor_library WHERE vendor_name = 'Aruba'), 'CX 6300', 'CX Series',
 '["10.08.1020", "10.09.1010", "10.10.1020"]',
 '["802.1x", "MAB", "TACACS+", "RADSEC", "Multi-Auth", "COA", "VSAs", "DACL", "Dynamic VLAN", "Port Security", "User Role"]',
 'Advanced CX switch with comprehensive security features'),

-- Fortinet Models
((SELECT id FROM public.vendor_library WHERE vendor_name = 'Fortinet'), 'FortiGate 100F', 'FortiGate 100 Series',
 '["7.0.12", "7.2.5", "7.4.1"]',
 '["802.1x", "RADIUS", "TACACS+", "FSSO", "Dynamic VLAN", "Firewall Policies"]',
 'Next-gen firewall with integrated 802.1x support');

-- Insert comprehensive configuration templates
INSERT INTO public.configuration_templates (name, description, vendor_id, category, subcategory, configuration_type, complexity_level, template_content, template_variables, supported_scenarios, authentication_methods, required_features, network_requirements, security_features, best_practices, tags) VALUES

-- Cisco 802.1x Multi-Auth Template
('Cisco Catalyst 802.1x Multi-Auth Configuration', 'Comprehensive 802.1x configuration with Multi-Auth support for Cisco Catalyst switches', 
 (SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco'), 
 '802.1x', 'Multi-Auth', 'switch', 'advanced',
 '! Cisco Catalyst 802.1x Multi-Auth Configuration
! Global 802.1x Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! RADIUS Configuration
radius server {{radius_server_name}}
 address ipv4 {{radius_server_ip}} auth-port {{auth_port}} acct-port {{acct_port}}
 key {{radius_shared_secret}}
 
! Enable 802.1x globally
dot1x system-auth-control

! Interface Configuration Template
interface {{interface_range}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 
 ! Authentication Configuration
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 
 ! MAB Configuration
 mab
 
 ! Dynamic Authorization (COA)
 authentication violation restrict
 
 ! Port Security (Optional)
 switchport port-security
 switchport port-security maximum {{max_devices}}
 switchport port-security violation restrict
 
 ! Voice VLAN (if applicable)
 switchport voice vlan {{voice_vlan}}
 
 spanning-tree portfast
 spanning-tree bpduguard enable',
 
 '{"radius_server_name": "PORTNOX-RADIUS", "radius_server_ip": "192.168.1.100", "auth_port": "1812", "acct_port": "1813", "radius_shared_secret": "your_shared_secret", "interface_range": "range gi1/0/1-48", "interface_description": "User Access Ports", "default_vlan": "10", "reauth_timer": "3600", "max_devices": "3", "voice_vlan": "20"}',
 
 '["Employee Authentication", "Guest Access", "Device Onboarding", "Quarantine", "Dynamic VLAN Assignment"]',
 '["802.1x", "MAB", "EAP-TLS", "PEAP-MSCHAPv2"]',
 '["Multi-Auth", "COA", "Dynamic VLAN", "Port Security", "Voice VLAN"]',
 '{"vlans": ["default_vlan", "voice_vlan", "guest_vlan"], "dhcp_helper": true, "spanning_tree": "rapid-pvst"}',
 '["Port Security", "BPDU Guard", "Authentication Violation Handling"]',
 '["Enable PortFast on access ports", "Use BPDU Guard for security", "Configure appropriate reauth timers", "Monitor authentication logs"]',
 '["cisco", "802.1x", "multi-auth", "mab", "radius", "portnox"]'),

-- Aruba CX 802.1x Template  
('Aruba CX 802.1x Multi-Auth Configuration', 'Advanced 802.1x configuration for Aruba CX switches with user roles and dynamic VLANs',
 (SELECT id FROM public.vendor_library WHERE vendor_name = 'Aruba'), 
 '802.1x', 'Multi-Auth', 'switch', 'advanced',
 '! Aruba CX 802.1x Multi-Auth Configuration
! RADIUS Configuration
radius-server host {{radius_server_ip}} key {{radius_shared_secret}}
radius-server host {{radius_server_ip}} auth-port {{auth_port}} acct-port {{acct_port}}

! AAA Configuration  
aaa authentication port-access dot1x authenticator radius
aaa authentication port-access mac-auth authenticator radius

! User Roles (Dynamic Authorization)
user-role {{authenticated_role}}
    access-list ipv4 {{authenticated_acl}}
    
user-role {{guest_role}}
    access-list ipv4 {{guest_acl}}

! Interface Configuration
interface {{interface_range}}
    description {{interface_description}}
    no shutdown
    
    ! VLAN Configuration
    vlan access {{default_vlan}}
    
    ! 802.1x Configuration
    aaa authentication port-access dot1x authenticator
    aaa authentication port-access mac-auth authenticator
    
    ! Authentication Order and Methods
    aaa authentication port-access dot1x authenticator client-limit {{max_clients}}
    aaa authentication port-access mac-auth authenticator client-limit {{max_mac_clients}}
    
    ! Captive Portal (for guest access)
    captive-portal role {{guest_role}}
    
    ! Port Security
    port-access mac-auth addr-limit {{mac_addr_limit}}',
    
 '{"radius_server_ip": "192.168.1.100", "radius_shared_secret": "your_shared_secret", "auth_port": "1812", "acct_port": "1813", "authenticated_role": "authenticated-users", "guest_role": "guest-users", "authenticated_acl": "permit-internet", "guest_acl": "guest-internet", "interface_range": "1/1/1-1/1/48", "interface_description": "User Access Ports", "default_vlan": "10", "max_clients": "8", "max_mac_clients": "1", "mac_addr_limit": "8"}',
 
 '["Employee Authentication", "Guest Access", "BYOD", "Dynamic Authorization"]',
 '["802.1x", "MAC Authentication", "Captive Portal"]',
 '["User Roles", "Dynamic VLAN", "Client Limits", "Captive Portal"]',
 '{"vlans": ["default_vlan", "guest_vlan"], "user_roles": true, "captive_portal": true}',
 '["User Role ACLs", "Client Limits", "MAC Address Limiting"]',
 '["Configure appropriate user roles", "Set client limits per port", "Use captive portal for guest access"]',
 '["aruba", "cx", "802.1x", "user-roles", "captive-portal", "mac-auth"]'),

-- RADSEC Template
('Cisco RADSEC Configuration', 'Secure RADIUS over TLS configuration for enhanced security',
 (SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco'),
 'RADSEC', 'Secure RADIUS', 'switch', 'expert',
 '! Cisco RADSEC Configuration
! Certificate Configuration
crypto pki trustpoint {{trustpoint_name}}
 enrollment url {{ca_url}}
 subject-name cn={{switch_hostname}},ou=Network,o={{organization}}
 revocation-check none
 
! RADSEC Server Configuration  
radius server {{radsec_server_name}}
 address ipv4 {{radsec_server_ip}} auth-port {{radsec_port}}
 key {{radsec_shared_secret}}
 ssl-trustpoint {{trustpoint_name}}
 ssl-port {{radsec_port}}
 
! AAA Configuration for RADSEC
aaa group server radius {{radius_group_name}}
 server name {{radsec_server_name}}
 
aaa authentication dot1x default group {{radius_group_name}}
aaa authorization network default group {{radius_group_name}}',

 '{"trustpoint_name": "PORTNOX-CA", "ca_url": "http://ca.company.com", "switch_hostname": "switch01", "organization": "Company Inc", "radsec_server_name": "PORTNOX-RADSEC", "radsec_server_ip": "192.168.1.100", "radsec_port": "2083", "radsec_shared_secret": "radsec_secret", "radius_group_name": "PORTNOX-GROUP"}',
 
 '["High Security Authentication", "Certificate-based Authentication"]',
 '["RADSEC", "802.1x", "TLS"]',
 '["PKI Certificates", "TLS Encryption", "Secure RADIUS"]',
 '{"certificates": true, "tls_encryption": true, "secure_radius": true}',
 '["Certificate Validation", "TLS Encryption", "Secure Key Exchange"]',
 '["Use strong certificates", "Validate certificate chains", "Monitor certificate expiration"]',
 '["radsec", "tls", "certificates", "secure-radius", "pki"]'),

-- TACACS+ Template
('Cisco TACACS+ AAA Configuration', 'Comprehensive TACACS+ configuration for device administration',
 (SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco'),
 'TACACS', 'Device Administration', 'switch', 'advanced',
 '! Cisco TACACS+ Configuration
! TACACS+ Server Configuration
tacacs server {{tacacs_server_name}}
 address ipv4 {{tacacs_server_ip}}
 key {{tacacs_shared_secret}}
 timeout {{tacacs_timeout}}
 
! AAA Configuration
aaa new-model
aaa authentication login default group tacacs+ local
aaa authentication enable default group tacacs+ enable
aaa authorization console
aaa authorization config-commands
aaa authorization exec default group tacacs+ local
aaa authorization commands 1 default group tacacs+ local
aaa authorization commands 15 default group tacacs+ local
aaa accounting exec default start-stop group tacacs+
aaa accounting commands 1 default start-stop group tacacs+
aaa accounting commands 15 default start-stop group tacacs+
aaa accounting connection default start-stop group tacacs+

! Local fallback user
username {{local_admin}} privilege 15 secret {{local_password}}

! Line Configuration
line console 0
 authorization exec default
 accounting exec default
 login authentication default
 
line vty 0 15
 authorization exec default
 authorization commands 1 default
 authorization commands 15 default
 accounting exec default
 accounting commands 1 default
 accounting commands 15 default
 login authentication default
 transport input ssh',
 
 '{"tacacs_server_name": "PORTNOX-TACACS", "tacacs_server_ip": "192.168.1.100", "tacacs_shared_secret": "tacacs_secret", "tacacs_timeout": "5", "local_admin": "admin", "local_password": "backup_password"}',
 
 '["Device Administration", "Command Authorization", "Audit Logging"]',
 '["TACACS+"]',
 '["Command Authorization", "Accounting", "Local Fallback"]',
 '{"tacacs_server": true, "local_fallback": true, "ssh_access": true}',
 '["Command Authorization", "Audit Logging", "Local Fallback Authentication"]',
 '["Use strong TACACS+ keys", "Enable command accounting", "Configure local fallback user"]',
 '["tacacs", "aaa", "device-admin", "authorization", "accounting"]');

-- Create storage bucket for configuration files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('config-templates', 'config-templates', false);

-- Enable RLS on all new tables
ALTER TABLE public.vendor_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_authentication_scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_library
CREATE POLICY "Vendor library is readable by authenticated users" ON public.vendor_library
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage vendor library" ON public.vendor_library
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create vendor entries" ON public.vendor_library
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for vendor_models  
CREATE POLICY "Vendor models are readable by authenticated users" ON public.vendor_models
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage vendor models" ON public.vendor_models
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create vendor models" ON public.vendor_models
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for configuration_templates
CREATE POLICY "Public config templates are readable by authenticated users" ON public.configuration_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create config templates" ON public.configuration_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own config templates" ON public.configuration_templates
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own config templates" ON public.configuration_templates
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for configuration_files
CREATE POLICY "Users can view their own config files" ON public.configuration_files
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create config files" ON public.configuration_files
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own config files" ON public.configuration_files
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own config files" ON public.configuration_files
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for network_authentication_scenarios
CREATE POLICY "Authentication scenarios are readable by authenticated users" ON public.network_authentication_scenarios
  FOR SELECT USING (true);

CREATE POLICY "Users can create authentication scenarios" ON public.network_authentication_scenarios
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own authentication scenarios" ON public.network_authentication_scenarios
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Storage policies for config files
CREATE POLICY "Users can upload config files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own config files" ON storage.objects
  FOR SELECT USING (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own config files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own config files" ON storage.objects
  FOR DELETE USING (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_vendor_library_updated_at
  BEFORE UPDATE ON public.vendor_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_models_updated_at
  BEFORE UPDATE ON public.vendor_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuration_templates_updated_at
  BEFORE UPDATE ON public.configuration_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuration_files_updated_at
  BEFORE UPDATE ON public.configuration_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_authentication_scenarios_updated_at
  BEFORE UPDATE ON public.network_authentication_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();