-- Create customer users table for portal authentication
CREATE TABLE public.customer_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, manager, admin
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  customer_organization TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer team members table
CREATE TABLE public.customer_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL, -- project_owner, site_owner, team_member, stakeholder
  department TEXT,
  phone TEXT,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  is_primary_contact BOOLEAN DEFAULT false,
  can_receive_notifications BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.customer_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer portal sessions table for tracking
CREATE TABLE public.customer_portal_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_user_id UUID NOT NULL REFERENCES public.customer_users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer implementation tracking table
CREATE TABLE public.customer_implementation_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  milestone_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, delayed
  assigned_to TEXT,
  target_date DATE,
  completion_date DATE,
  progress_percentage INTEGER DEFAULT 0,
  dependencies JSONB DEFAULT '[]'::jsonb,
  success_criteria JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer analytics table for tracking interactions
CREATE TABLE public.customer_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  customer_user_id UUID REFERENCES public.customer_users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- login, page_view, document_download, update_view, etc.
  event_data JSONB DEFAULT '{}'::jsonb,
  session_id UUID REFERENCES public.customer_portal_sessions(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.customer_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_implementation_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customer_users
CREATE POLICY "Customer users can view their own profile" ON public.customer_users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Project owners can manage customer users for their projects" ON public.customer_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = customer_users.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- Create RLS policies for customer_team_members
CREATE POLICY "Customer users can view team members in their project" ON public.customer_team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.customer_users cu
      WHERE cu.project_id = customer_team_members.project_id
      AND cu.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = customer_team_members.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

CREATE POLICY "Customer managers can manage team members" ON public.customer_team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.customer_users cu
      WHERE cu.project_id = customer_team_members.project_id
      AND cu.id = auth.uid()
      AND cu.role IN ('manager', 'admin')
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = customer_team_members.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- Create RLS policies for other tables
CREATE POLICY "Customer users can view their project sessions" ON public.customer_portal_sessions
  FOR SELECT USING (customer_user_id = auth.uid());

CREATE POLICY "Customer users can view their project implementation tracking" ON public.customer_implementation_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.customer_users cu
      WHERE cu.project_id = customer_implementation_tracking.project_id
      AND cu.id = auth.uid()
    )
  );

CREATE POLICY "Customer users analytics tracking" ON public.customer_analytics
  FOR ALL USING (
    customer_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = customer_analytics.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- Create indexes for performance
CREATE INDEX idx_customer_users_project_id ON public.customer_users(project_id);
CREATE INDEX idx_customer_users_email ON public.customer_users(email);
CREATE INDEX idx_customer_team_members_project_id ON public.customer_team_members(project_id);
CREATE INDEX idx_customer_portal_sessions_customer_user_id ON public.customer_portal_sessions(customer_user_id);
CREATE INDEX idx_customer_portal_sessions_project_id ON public.customer_portal_sessions(project_id);
CREATE INDEX idx_customer_implementation_tracking_project_id ON public.customer_implementation_tracking(project_id);
CREATE INDEX idx_customer_analytics_project_id ON public.customer_analytics(project_id);
CREATE INDEX idx_customer_analytics_customer_user_id ON public.customer_analytics(customer_user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_customer_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customer_users_updated_at
  BEFORE UPDATE ON public.customer_users
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_updated_at_column();

CREATE TRIGGER update_customer_team_members_updated_at
  BEFORE UPDATE ON public.customer_team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_updated_at_column();

CREATE TRIGGER update_customer_implementation_tracking_updated_at
  BEFORE UPDATE ON public.customer_implementation_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_updated_at_column();

-- Create function for customer authentication
CREATE OR REPLACE FUNCTION authenticate_customer_user(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  user_id UUID,
  project_id UUID,
  role TEXT,
  project_name TEXT,
  customer_organization TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cu.id,
    cu.project_id,
    cu.role,
    p.name,
    p.customer_organization
  FROM public.customer_users cu
  JOIN public.projects p ON p.id = cu.project_id
  WHERE cu.email = p_email 
    AND cu.password_hash = crypt(p_password, cu.password_hash)
    AND cu.is_active = true
    AND p.customer_portal_enabled = true;
END;
$$;