-- First, let's check if vendor_library table exists and create/update it if needed
CREATE TABLE IF NOT EXISTS public.vendor_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  support_url TEXT,
  documentation_url TEXT,
  logo_url TEXT,
  vendor_type TEXT DEFAULT 'network' CHECK (vendor_type IN ('network', 'security', 'wireless', 'firewall', 'server', 'storage', 'other')),
  is_active BOOLEAN DEFAULT true,
  certifications JSONB DEFAULT '[]'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  integration_capabilities JSONB DEFAULT '{}'::jsonb,
  supported_protocols JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create vendor models table to store all models for each vendor
CREATE TABLE IF NOT EXISTS public.vendor_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_description TEXT,
  firmware_versions JSONB DEFAULT '[]'::jsonb,
  hardware_specs JSONB DEFAULT '{}'::jsonb,
  supported_features JSONB DEFAULT '[]'::jsonb,
  authentication_methods JSONB DEFAULT '[]'::jsonb,
  vlan_capabilities JSONB DEFAULT '{}'::jsonb,
  port_configurations JSONB DEFAULT '{}'::jsonb,
  management_protocols JSONB DEFAULT '[]'::jsonb,
  compliance_certifications JSONB DEFAULT '[]'::jsonb,
  performance_specs JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(vendor_id, model_name)
);

-- Enable RLS
ALTER TABLE public.vendor_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_library
CREATE POLICY "Vendor library is readable by authenticated users" ON public.vendor_library
  FOR SELECT USING (true);

CREATE POLICY "Users can create vendors" ON public.vendor_library
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update vendors they created or super admins" ON public.vendor_library
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for vendor_models
CREATE POLICY "Vendor models are readable by authenticated users" ON public.vendor_models
  FOR SELECT USING (true);

CREATE POLICY "Users can create vendor models" ON public.vendor_models
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update vendor models they created or super admins" ON public.vendor_models
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Insert some common network vendors and their models
INSERT INTO public.vendor_library (vendor_name, description, vendor_type, supported_protocols) VALUES
('Cisco', 'Leading network infrastructure vendor', 'network', '["802.1X", "RADIUS", "TACACS+", "SNMP", "CoA"]'),
('Aruba', 'HP Enterprise networking division', 'network', '["802.1X", "RADIUS", "ClearPass", "SNMP", "CoA"]'),
('Juniper', 'Network infrastructure and security solutions', 'network', '["802.1X", "RADIUS", "TACACS+", "SNMP", "CoA"]'),
('Extreme Networks', 'Cloud-driven networking solutions', 'network', '["802.1X", "RADIUS", "SNMP", "CoA"]'),
('Fortinet', 'Cybersecurity and networking solutions', 'security', '["802.1X", "RADIUS", "LDAP", "SNMP", "CoA"]'),
('Palo Alto Networks', 'Next-generation firewall and security', 'security', '["802.1X", "RADIUS", "LDAP", "SAML", "API"]')
ON CONFLICT (vendor_name) DO NOTHING;

-- Insert common models for Cisco
WITH cisco_vendor AS (SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco' LIMIT 1)
INSERT INTO public.vendor_models (vendor_id, model_name, model_description, firmware_versions, authentication_methods, vlan_capabilities) 
SELECT 
  cisco_vendor.id,
  model_data.name,
  model_data.description,
  model_data.firmware_versions::jsonb,
  model_data.auth_methods::jsonb,
  model_data.vlan_caps::jsonb
FROM cisco_vendor,
(VALUES 
  ('Catalyst 9300', 'Campus switching platform', '["16.12.x", "17.3.x", "17.6.x"]', '["802.1X", "MAB", "WebAuth"]', '{"dynamic_vlan": true, "voice_vlan": true, "guest_vlan": true}'),
  ('Catalyst 9200', 'Access layer switching', '["16.12.x", "17.3.x", "17.6.x"]', '["802.1X", "MAB", "WebAuth"]', '{"dynamic_vlan": true, "voice_vlan": true, "guest_vlan": true}'),
  ('Catalyst 9400', 'Core/Distribution switching', '["16.12.x", "17.3.x", "17.6.x"]', '["802.1X", "MAB", "WebAuth", "Central_WebAuth"]', '{"dynamic_vlan": true, "voice_vlan": true, "guest_vlan": true, "pvlan": true}'),
  ('ISR 4000', 'Integrated services router', '["16.12.x", "17.3.x", "17.6.x"]', '["802.1X", "RADIUS", "TACACS+"]', '{"vlan_routing": true, "vrf": true}'),
  ('ASR 1000', 'Aggregation services router', '["16.12.x", "17.3.x", "17.6.x"]', '["RADIUS", "TACACS+", "LDAP"]', '{"vlan_routing": true, "vrf": true, "mpls": true}')
) AS model_data(name, description, firmware_versions, auth_methods, vlan_caps)
ON CONFLICT (vendor_id, model_name) DO NOTHING;

-- Insert common models for Aruba
WITH aruba_vendor AS (SELECT id FROM public.vendor_library WHERE vendor_name = 'Aruba' LIMIT 1)
INSERT INTO public.vendor_models (vendor_id, model_name, model_description, firmware_versions, authentication_methods, vlan_capabilities) 
SELECT 
  aruba_vendor.id,
  model_data.name,
  model_data.description,
  model_data.firmware_versions::jsonb,
  model_data.auth_methods::jsonb,
  model_data.vlan_caps::jsonb
FROM aruba_vendor,
(VALUES 
  ('CX 6300', 'Campus core/aggregation switch', '["10.08.x", "10.09.x", "10.10.x"]', '["802.1X", "MAB", "WebAuth", "ClearPass"]', '{"dynamic_vlan": true, "voice_vlan": true, "guest_vlan": true}'),
  ('CX 6200', 'Access layer switch', '["10.08.x", "10.09.x", "10.10.x"]', '["802.1X", "MAB", "WebAuth"]', '{"dynamic_vlan": true, "voice_vlan": true, "guest_vlan": true}'),
  ('CX 8400', 'Modular campus core', '["10.08.x", "10.09.x", "10.10.x"]', '["802.1X", "MAB", "WebAuth", "ClearPass"]', '{"dynamic_vlan": true, "voice_vlan": true, "guest_vlan": true, "pvlan": true}')
) AS model_data(name, description, firmware_versions, auth_methods, vlan_caps)
ON CONFLICT (vendor_id, model_name) DO NOTHING;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendor_library_updated_at BEFORE UPDATE ON public.vendor_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_models_updated_at BEFORE UPDATE ON public.vendor_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();