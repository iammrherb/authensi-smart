-- Create missing vendor tables referenced in useConfigTemplates
CREATE TABLE IF NOT EXISTS public.vendor_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  category text NOT NULL DEFAULT 'network',
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.vendor_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES public.vendor_library(id),
  model_name text NOT NULL,
  model_series text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.vendor_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_library
CREATE POLICY "Vendor library is readable by authenticated users"
  ON public.vendor_library FOR SELECT
  USING (true);

CREATE POLICY "Users can create vendor library entries"
  ON public.vendor_library FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Create policies for vendor_models  
CREATE POLICY "Vendor models are readable by authenticated users"
  ON public.vendor_models FOR SELECT
  USING (true);

CREATE POLICY "Users can create vendor model entries"
  ON public.vendor_models FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Insert some sample data
INSERT INTO public.vendor_library (vendor_name, category, description) VALUES
('Cisco', 'network', 'Network infrastructure vendor'),
('Aruba', 'network', 'Wireless and network solutions'),
('Juniper', 'network', 'Network equipment manufacturer'),
('Portnox', 'security', 'Network access control solutions')
ON CONFLICT DO NOTHING;

INSERT INTO public.vendor_models (vendor_id, model_name, model_series, description) VALUES
((SELECT id FROM public.vendor_library WHERE vendor_name = 'Cisco' LIMIT 1), 'Catalyst 9300', '9300 Series', 'Enterprise switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name = 'Aruba' LIMIT 1), 'CX 6300', '6300 Series', 'Campus switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name = 'Juniper' LIMIT 1), 'EX4300', 'EX Series', 'Ethernet switch')
ON CONFLICT DO NOTHING;