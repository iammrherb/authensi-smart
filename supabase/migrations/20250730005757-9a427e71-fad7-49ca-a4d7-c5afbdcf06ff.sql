-- Add missing columns to existing vendor_library table
ALTER TABLE public.vendor_library 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS support_contact JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS portnox_integration_level TEXT DEFAULT 'supported',
ADD COLUMN IF NOT EXISTS portnox_documentation JSONB DEFAULT '{}';

-- Create vendor models table
CREATE TABLE IF NOT EXISTS public.vendor_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_series TEXT,
  firmware_versions JSONB DEFAULT '[]',
  hardware_specs JSONB DEFAULT '{}',
  port_configurations JSONB DEFAULT '{}',
  supported_features JSONB DEFAULT '[]',
  eol_date DATE,
  eos_date DATE,
  documentation_links JSONB DEFAULT '[]',
  configuration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create configuration templates table
CREATE TABLE IF NOT EXISTS public.configuration_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  vendor_id UUID REFERENCES public.vendor_library(id),
  model_id UUID REFERENCES public.vendor_models(id),
  category TEXT NOT NULL,
  subcategory TEXT,
  configuration_type TEXT NOT NULL,
  complexity_level TEXT DEFAULT 'intermediate',
  template_content TEXT NOT NULL,
  template_variables JSONB DEFAULT '{}',
  supported_scenarios JSONB DEFAULT '[]',
  authentication_methods JSONB DEFAULT '[]',
  required_features JSONB DEFAULT '[]',
  network_requirements JSONB DEFAULT '{}',
  security_features JSONB DEFAULT '[]',
  best_practices JSONB DEFAULT '[]',
  troubleshooting_guide JSONB DEFAULT '[]',
  validation_commands JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  is_public BOOLEAN DEFAULT true,
  is_validated BOOLEAN DEFAULT false,
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create configuration files table
CREATE TABLE IF NOT EXISTS public.configuration_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_type TEXT DEFAULT 'config',
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
  created_by UUID
);

-- Create network authentication scenarios table
CREATE TABLE IF NOT EXISTS public.network_authentication_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  scenario_type TEXT NOT NULL,
  authentication_flow JSONB NOT NULL,
  required_components JSONB DEFAULT '[]',
  configuration_steps JSONB DEFAULT '[]',
  vendor_specific_configs JSONB DEFAULT '{}',
  troubleshooting_steps JSONB DEFAULT '[]',
  security_considerations JSONB DEFAULT '[]',
  compliance_requirements JSONB DEFAULT '[]',
  use_cases JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Update existing vendors with enhanced data
UPDATE public.vendor_library SET 
  description = 'Leading network infrastructure vendor with comprehensive switch portfolio',
  website_url = 'https://cisco.com',
  portnox_integration_level = 'certified',
  portnox_documentation = '{"guides": ["cisco-catalyst-guide.pdf"], "best_practices": ["cisco-802.1x-bp.pdf"], "integration_notes": "Full support for all Catalyst series"}'
WHERE vendor_name = 'Cisco';

-- Insert additional major vendors if they don't exist
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (VALUES
  ('Aruba', 'network', 'switch', 'HPE Aruba networking switches with advanced security features', 'https://arubanetworks.com', 'certified', '{"guides": ["aruba-cx-guide.pdf"], "best_practices": ["aruba-clearpass-integration.pdf"]}'),
  ('Fortinet', 'security', 'firewall', 'Enterprise security and networking solutions', 'https://fortinet.com', 'supported', '{"guides": ["fortigate-802.1x.pdf"], "integration_notes": "FortiGate firewall integration"}'),
  ('Juniper', 'network', 'switch', 'High-performance networking solutions', 'https://juniper.net', 'supported', '{"guides": ["juniper-ex-series.pdf"], "best_practices": ["juniper-802.1x-config.pdf"]}'),
  ('Extreme Networks', 'network', 'switch', 'Cloud-driven networking solutions', 'https://extremenetworks.com', 'supported', '{"guides": ["extreme-exos-guide.pdf"]}'),
  ('Arista', 'network', 'switch', 'Cloud networking solutions', 'https://arista.com', 'supported', '{"guides": ["arista-eos-guide.pdf"]}'),
  ('HP Enterprise', 'network', 'switch', 'Enterprise networking infrastructure', 'https://hpe.com', 'supported', '{"guides": ["hpe-procurve-guide.pdf"]}'),
  ('Dell Technologies', 'network', 'switch', 'Enterprise networking and infrastructure', 'https://dell.com', 'supported', '{"guides": ["dell-os10-guide.pdf"]}')
) AS new_vendors(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library 
  WHERE vendor_library.vendor_name = new_vendors.vendor_name
);

-- Create storage bucket for configuration files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
SELECT 'config-templates', 'config-templates', false, 52428800, ARRAY['text/plain', 'application/octet-stream', 'text/x-config']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'config-templates');

-- Enable RLS on new tables
ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_authentication_scenarios ENABLE ROW LEVEL SECURITY;