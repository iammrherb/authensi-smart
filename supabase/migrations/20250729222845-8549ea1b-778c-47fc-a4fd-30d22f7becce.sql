-- Add business_summary field to projects table
ALTER TABLE public.projects 
ADD COLUMN business_summary text,
ADD COLUMN business_domain text,
ADD COLUMN business_website text;

-- Create pain_points_library table for storing reusable pain points
CREATE TABLE public.pain_points_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  severity text NOT NULL DEFAULT 'medium',
  recommended_solutions jsonb DEFAULT '[]'::jsonb,
  industry_specific jsonb DEFAULT '[]'::jsonb,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on pain_points_library
ALTER TABLE public.pain_points_library ENABLE ROW LEVEL SECURITY;

-- Create policies for pain_points_library
CREATE POLICY "Authenticated users can create pain points" 
ON public.pain_points_library 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Pain points library is readable by authenticated users" 
ON public.pain_points_library 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update pain points they created" 
ON public.pain_points_library 
FOR UPDATE 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete pain points" 
ON public.pain_points_library 
FOR DELETE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create recommendations_library table
CREATE TABLE public.recommendations_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'medium',
  implementation_effort text NOT NULL DEFAULT 'medium',
  expected_outcome text,
  prerequisites jsonb DEFAULT '[]'::jsonb,
  related_pain_points jsonb DEFAULT '[]'::jsonb,
  portnox_features jsonb DEFAULT '[]'::jsonb,
  industry_specific jsonb DEFAULT '[]'::jsonb,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on recommendations_library
ALTER TABLE public.recommendations_library ENABLE ROW LEVEL SECURITY;

-- Create policies for recommendations_library
CREATE POLICY "Authenticated users can create recommendations" 
ON public.recommendations_library 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Recommendations library is readable by authenticated users" 
ON public.recommendations_library 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update recommendations they created" 
ON public.recommendations_library 
FOR UPDATE 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete recommendations" 
ON public.recommendations_library 
FOR DELETE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create trigger for updated_at columns
CREATE TRIGGER update_pain_points_library_updated_at
BEFORE UPDATE ON public.pain_points_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recommendations_library_updated_at
BEFORE UPDATE ON public.recommendations_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();