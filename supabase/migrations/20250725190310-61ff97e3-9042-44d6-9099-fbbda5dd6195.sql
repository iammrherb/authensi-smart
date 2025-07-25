-- Add missing columns to projects table for enhanced project creation
ALTER TABLE public.projects 
ADD COLUMN project_type text,
ADD COLUMN primary_country text,
ADD COLUMN primary_region text,
ADD COLUMN timezone text,
ADD COLUMN project_owner uuid,
ADD COLUMN technical_owner uuid,
ADD COLUMN portnox_owner uuid,
ADD COLUMN additional_stakeholders jsonb DEFAULT '[]'::jsonb,
ADD COLUMN enable_bulk_sites boolean DEFAULT false,
ADD COLUMN bulk_sites_data jsonb DEFAULT '[]'::jsonb,
ADD COLUMN enable_bulk_users boolean DEFAULT false,
ADD COLUMN enable_auto_vendors boolean DEFAULT false;

-- Create countries and regions reference table
CREATE TABLE public.countries_regions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code text NOT NULL,
  country_name text NOT NULL,
  region_name text NOT NULL,
  timezone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on countries_regions table
ALTER TABLE public.countries_regions ENABLE ROW LEVEL SECURITY;

-- Create policy for countries_regions (readable by all authenticated users)
CREATE POLICY "Countries and regions are readable by authenticated users"
ON public.countries_regions
FOR SELECT
USING (true);

-- Insert comprehensive countries and regions data
INSERT INTO public.countries_regions (country_code, country_name, region_name, timezone) VALUES
-- United States
('US', 'United States', 'Alabama', 'CST'),
('US', 'United States', 'Alaska', 'AKST'),
('US', 'United States', 'Arizona', 'MST'),
('US', 'United States', 'Arkansas', 'CST'),
('US', 'United States', 'California', 'PST'),
('US', 'United States', 'Colorado', 'MST'),
('US', 'United States', 'Connecticut', 'EST'),
('US', 'United States', 'Delaware', 'EST'),
('US', 'United States', 'Florida', 'EST'),
('US', 'United States', 'Georgia', 'EST'),
('US', 'United States', 'Hawaii', 'HST'),
('US', 'United States', 'Idaho', 'MST'),
('US', 'United States', 'Illinois', 'CST'),
('US', 'United States', 'Indiana', 'EST'),
('US', 'United States', 'Iowa', 'CST'),
('US', 'United States', 'Kansas', 'CST'),
('US', 'United States', 'Kentucky', 'EST'),
('US', 'United States', 'Louisiana', 'CST'),
('US', 'United States', 'Maine', 'EST'),
('US', 'United States', 'Maryland', 'EST'),
('US', 'United States', 'Massachusetts', 'EST'),
('US', 'United States', 'Michigan', 'EST'),
('US', 'United States', 'Minnesota', 'CST'),
('US', 'United States', 'Mississippi', 'CST'),
('US', 'United States', 'Missouri', 'CST'),
('US', 'United States', 'Montana', 'MST'),
('US', 'United States', 'Nebraska', 'CST'),
('US', 'United States', 'Nevada', 'PST'),
('US', 'United States', 'New Hampshire', 'EST'),
('US', 'United States', 'New Jersey', 'EST'),
('US', 'United States', 'New Mexico', 'MST'),
('US', 'United States', 'New York', 'EST'),
('US', 'United States', 'North Carolina', 'EST'),
('US', 'United States', 'North Dakota', 'CST'),
('US', 'United States', 'Ohio', 'EST'),
('US', 'United States', 'Oklahoma', 'CST'),
('US', 'United States', 'Oregon', 'PST'),
('US', 'United States', 'Pennsylvania', 'EST'),
('US', 'United States', 'Rhode Island', 'EST'),
('US', 'United States', 'South Carolina', 'EST'),
('US', 'United States', 'South Dakota', 'CST'),
('US', 'United States', 'Tennessee', 'CST'),
('US', 'United States', 'Texas', 'CST'),
('US', 'United States', 'Utah', 'MST'),
('US', 'United States', 'Vermont', 'EST'),
('US', 'United States', 'Virginia', 'EST'),
('US', 'United States', 'Washington', 'PST'),
('US', 'United States', 'West Virginia', 'EST'),
('US', 'United States', 'Wisconsin', 'CST'),
('US', 'United States', 'Wyoming', 'MST'),

-- Canada
('CA', 'Canada', 'Alberta', 'MST'),
('CA', 'Canada', 'British Columbia', 'PST'),
('CA', 'Canada', 'Manitoba', 'CST'),
('CA', 'Canada', 'New Brunswick', 'AST'),
('CA', 'Canada', 'Newfoundland and Labrador', 'NST'),
('CA', 'Canada', 'Northwest Territories', 'MST'),
('CA', 'Canada', 'Nova Scotia', 'AST'),
('CA', 'Canada', 'Nunavut', 'EST'),
('CA', 'Canada', 'Ontario', 'EST'),
('CA', 'Canada', 'Prince Edward Island', 'AST'),
('CA', 'Canada', 'Quebec', 'EST'),
('CA', 'Canada', 'Saskatchewan', 'CST'),
('CA', 'Canada', 'Yukon', 'PST'),

-- United Kingdom
('GB', 'United Kingdom', 'England', 'GMT'),
('GB', 'United Kingdom', 'Scotland', 'GMT'),
('GB', 'United Kingdom', 'Wales', 'GMT'),
('GB', 'United Kingdom', 'Northern Ireland', 'GMT'),

-- Australia
('AU', 'Australia', 'New South Wales', 'AEST'),
('AU', 'Australia', 'Victoria', 'AEST'),
('AU', 'Australia', 'Queensland', 'AEST'),
('AU', 'Australia', 'Western Australia', 'AWST'),
('AU', 'Australia', 'South Australia', 'ACST'),
('AU', 'Australia', 'Tasmania', 'AEST'),
('AU', 'Australia', 'Northern Territory', 'ACST'),
('AU', 'Australia', 'Australian Capital Territory', 'AEST'),

-- Germany
('DE', 'Germany', 'Baden-Württemberg', 'CET'),
('DE', 'Germany', 'Bavaria', 'CET'),
('DE', 'Germany', 'Berlin', 'CET'),
('DE', 'Germany', 'Brandenburg', 'CET'),
('DE', 'Germany', 'Bremen', 'CET'),
('DE', 'Germany', 'Hamburg', 'CET'),
('DE', 'Germany', 'Hesse', 'CET'),
('DE', 'Germany', 'Lower Saxony', 'CET'),
('DE', 'Germany', 'Mecklenburg-Vorpommern', 'CET'),
('DE', 'Germany', 'North Rhine-Westphalia', 'CET'),
('DE', 'Germany', 'Rhineland-Palatinate', 'CET'),
('DE', 'Germany', 'Saarland', 'CET'),
('DE', 'Germany', 'Saxony', 'CET'),
('DE', 'Germany', 'Saxony-Anhalt', 'CET'),
('DE', 'Germany', 'Schleswig-Holstein', 'CET'),
('DE', 'Germany', 'Thuringia', 'CET'),

-- France
('FR', 'France', 'Île-de-France', 'CET'),
('FR', 'France', 'Auvergne-Rhône-Alpes', 'CET'),
('FR', 'France', 'Hauts-de-France', 'CET'),
('FR', 'France', 'Provence-Alpes-Côte dAzur', 'CET'),
('FR', 'France', 'Grand Est', 'CET'),
('FR', 'France', 'Occitanie', 'CET'),
('FR', 'France', 'Nouvelle-Aquitaine', 'CET'),
('FR', 'France', 'Pays de la Loire', 'CET'),
('FR', 'France', 'Bretagne', 'CET'),
('FR', 'France', 'Normandie', 'CET'),
('FR', 'France', 'Bourgogne-Franche-Comté', 'CET'),
('FR', 'France', 'Centre-Val de Loire', 'CET'),
('FR', 'France', 'Corse', 'CET'),

-- Japan
('JP', 'Japan', 'Hokkaido', 'JST'),
('JP', 'Japan', 'Tohoku', 'JST'),
('JP', 'Japan', 'Kanto', 'JST'),
('JP', 'Japan', 'Chubu', 'JST'),
('JP', 'Japan', 'Kansai', 'JST'),
('JP', 'Japan', 'Chugoku', 'JST'),
('JP', 'Japan', 'Shikoku', 'JST'),
('JP', 'Japan', 'Kyushu', 'JST'),

-- Singapore
('SG', 'Singapore', 'Central Region', 'SGT'),
('SG', 'Singapore', 'North Region', 'SGT'),
('SG', 'Singapore', 'Northeast Region', 'SGT'),
('SG', 'Singapore', 'East Region', 'SGT'),
('SG', 'Singapore', 'West Region', 'SGT'),

-- India (major states)
('IN', 'India', 'Maharashtra', 'IST'),
('IN', 'India', 'Delhi', 'IST'),
('IN', 'India', 'Karnataka', 'IST'),
('IN', 'India', 'Tamil Nadu', 'IST'),
('IN', 'India', 'West Bengal', 'IST'),
('IN', 'India', 'Gujarat', 'IST'),
('IN', 'India', 'Rajasthan', 'IST'),
('IN', 'India', 'Uttar Pradesh', 'IST'),
('IN', 'India', 'Andhra Pradesh', 'IST'),
('IN', 'India', 'Telangana', 'IST'),

-- Brazil (major states)
('BR', 'Brazil', 'São Paulo', 'BRT'),
('BR', 'Brazil', 'Rio de Janeiro', 'BRT'),
('BR', 'Brazil', 'Minas Gerais', 'BRT'),
('BR', 'Brazil', 'Bahia', 'BRT'),
('BR', 'Brazil', 'Paraná', 'BRT'),
('BR', 'Brazil', 'Rio Grande do Sul', 'BRT'),
('BR', 'Brazil', 'Pernambuco', 'BRT'),
('BR', 'Brazil', 'Ceará', 'BRT'),
('BR', 'Brazil', 'Pará', 'BRT'),
('BR', 'Brazil', 'Santa Catarina', 'BRT'),

-- Mexico (major states)
('MX', 'Mexico', 'Mexico City', 'CST'),
('MX', 'Mexico', 'Jalisco', 'CST'),
('MX', 'Mexico', 'Nuevo León', 'CST'),
('MX', 'Mexico', 'Puebla', 'CST'),
('MX', 'Mexico', 'Guanajuato', 'CST'),
('MX', 'Mexico', 'Veracruz', 'CST'),
('MX', 'Mexico', 'Chihuahua', 'MST'),
('MX', 'Mexico', 'Baja California', 'PST'),
('MX', 'Mexico', 'Sonora', 'MST'),
('MX', 'Mexico', 'Coahuila', 'CST');

-- Create bulk site creation templates table
CREATE TABLE public.bulk_site_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name text NOT NULL,
  template_description text,
  csv_headers jsonb NOT NULL DEFAULT '[]'::jsonb,
  field_mappings jsonb NOT NULL DEFAULT '{}'::jsonb,
  default_values jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

-- Enable RLS on bulk_site_templates table
ALTER TABLE public.bulk_site_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for bulk_site_templates
CREATE POLICY "Users can view bulk site templates"
ON public.bulk_site_templates
FOR SELECT
USING (true);

CREATE POLICY "Users can create bulk site templates"
ON public.bulk_site_templates
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Insert default bulk site template
INSERT INTO public.bulk_site_templates (template_name, template_description, csv_headers, field_mappings, default_values) VALUES
('Standard Site Import', 'Default template for bulk site creation', 
'["Site Name", "Location", "Address", "Country", "Region", "Site Type", "Contact Name", "Contact Email", "Contact Phone", "Device Count", "Network Segments", "Priority", "Go Live Date", "Notes"]'::jsonb,
'{"Site Name": "name", "Location": "location", "Address": "address", "Country": "country", "Region": "region", "Site Type": "site_type", "Contact Name": "contact_name", "Contact Email": "contact_email", "Contact Phone": "contact_phone", "Device Count": "device_count", "Network Segments": "network_segments", "Priority": "priority", "Go Live Date": "timeline_start", "Notes": "deployment_config.implementation_notes"}'::jsonb,
'{"status": "planning", "priority": "medium", "device_count": 0, "network_segments": 1}'::jsonb);

-- Create trigger for updating timestamps
CREATE TRIGGER update_countries_regions_updated_at
BEFORE UPDATE ON public.countries_regions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bulk_site_templates_updated_at
BEFORE UPDATE ON public.bulk_site_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();