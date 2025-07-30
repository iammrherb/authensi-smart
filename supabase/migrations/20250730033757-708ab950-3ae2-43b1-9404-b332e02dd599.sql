-- Enhanced Configuration Templates System for AI-Powered Config Generation
-- Adding comprehensive categorization, AI integration, and wizard support

-- Add new columns to configuration_templates for enhanced functionality
ALTER TABLE configuration_templates ADD COLUMN IF NOT EXISTS 
  template_structure jsonb DEFAULT '{}',
  ai_optimization_rules jsonb DEFAULT '{}',
  wizard_parameters jsonb DEFAULT '{}',
  deployment_scenarios jsonb DEFAULT '[]',
  compatibility_matrix jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  automation_level text DEFAULT 'manual',
  template_source text DEFAULT 'manual',
  ai_generated boolean DEFAULT false,
  optimization_score numeric DEFAULT 0.0,
  last_ai_review timestamp with time zone,
  template_dependencies jsonb DEFAULT '[]',
  config_sections jsonb DEFAULT '{}',
  variable_definitions jsonb DEFAULT '{}',
  validation_rules jsonb DEFAULT '{}',
  troubleshooting_scenarios jsonb DEFAULT '[]',
  optimization_recommendations jsonb DEFAULT '[]';

-- Create config template categories table for better organization
CREATE TABLE IF NOT EXISTS config_template_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  parent_category_id uuid REFERENCES config_template_categories(id),
  category_type text NOT NULL DEFAULT 'functional', -- functional, vendor, deployment, security
  display_order integer DEFAULT 0,
  icon_name text,
  color_scheme text,
  ai_priority_weight numeric DEFAULT 1.0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Create config template wizard steps table
CREATE TABLE IF NOT EXISTS config_wizard_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES configuration_templates(id) ON DELETE CASCADE,
  step_order integer NOT NULL,
  step_name text NOT NULL,
  step_description text,
  step_type text NOT NULL DEFAULT 'input', -- input, selection, validation, preview
  required_fields jsonb DEFAULT '[]',
  conditional_logic jsonb DEFAULT '{}',
  ai_suggestions_enabled boolean DEFAULT true,
  auto_populate_rules jsonb DEFAULT '{}',
  validation_rules jsonb DEFAULT '{}',
  help_content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create AI optimization history table
CREATE TABLE IF NOT EXISTS ai_optimization_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES configuration_templates(id) ON DELETE CASCADE,
  original_config text NOT NULL,
  optimized_config text NOT NULL,
  optimization_type text NOT NULL, -- performance, security, compliance, best_practices
  ai_model_used text,
  optimization_score_before numeric,
  optimization_score_after numeric,
  changes_summary jsonb DEFAULT '{}',
  performance_impact jsonb DEFAULT '{}',
  security_impact jsonb DEFAULT '{}',
  compliance_impact jsonb DEFAULT '{}',
  user_feedback text,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Create config generation sessions table for wizard tracking
CREATE TABLE IF NOT EXISTS config_generation_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token text UNIQUE NOT NULL,
  template_id uuid REFERENCES configuration_templates(id),
  current_step integer DEFAULT 1,
  wizard_data jsonb DEFAULT '{}',
  ai_recommendations jsonb DEFAULT '{}',
  generated_config text,
  status text DEFAULT 'in_progress', -- in_progress, completed, abandoned
  completion_percentage integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  last_activity timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Create template usage analytics table
CREATE TABLE IF NOT EXISTS template_usage_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES configuration_templates(id) ON DELETE CASCADE,
  usage_type text NOT NULL, -- generation, modification, optimization, analysis
  user_context jsonb DEFAULT '{}',
  environment_details jsonb DEFAULT '{}',
  success_rate numeric DEFAULT 0.0,
  time_to_complete integer, -- in seconds
  errors_encountered jsonb DEFAULT '[]',
  user_satisfaction integer CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Insert enhanced categories for better organization
INSERT INTO config_template_categories (name, description, category_type, display_order, icon_name, ai_priority_weight) VALUES
-- Vendor Categories
('Cisco Systems', 'Cisco network equipment configurations', 'vendor', 1, 'router', 1.0),
('Aruba/HPE', 'Aruba and HPE network configurations', 'vendor', 2, 'wifi', 1.0),
('Juniper Networks', 'Juniper network equipment configurations', 'vendor', 3, 'network', 1.0),
('Fortinet', 'Fortinet security and network configurations', 'vendor', 4, 'shield', 1.0),
('Palo Alto Networks', 'Palo Alto security configurations', 'vendor', 5, 'shield-check', 1.0),

-- Functional Categories
('802.1X Authentication', 'Wired and wireless 802.1X configurations', 'functional', 10, 'key', 1.2),
('RADIUS Configuration', 'RADIUS server and client configurations', 'functional', 11, 'users', 1.1),
('VLAN Management', 'VLAN configuration and management', 'functional', 12, 'layers', 0.9),
('Access Control', 'Network access control configurations', 'functional', 13, 'lock', 1.1),
('Quality of Service', 'QoS and traffic management', 'functional', 14, 'gauge', 0.8),

-- Deployment Categories
('Campus Network', 'Campus-wide network deployments', 'deployment', 20, 'building', 1.0),
('Branch Office', 'Branch office network configurations', 'deployment', 21, 'map-pin', 0.9),
('Data Center', 'Data center network configurations', 'deployment', 22, 'server', 1.1),
('Cloud Integration', 'Cloud-based network configurations', 'deployment', 23, 'cloud', 1.0),
('IoT Networks', 'IoT device network configurations', 'deployment', 24, 'cpu', 0.8),

-- Security Categories
('Zero Trust', 'Zero trust network configurations', 'security', 30, 'shield-alert', 1.3),
('Compliance', 'Regulatory compliance configurations', 'security', 31, 'file-check', 1.2),
('Threat Detection', 'Security monitoring and threat detection', 'security', 32, 'alert-triangle', 1.1),
('Encryption', 'Network encryption configurations', 'security', 33, 'lock-keyhole', 1.0);

-- Update existing templates with enhanced categorization
UPDATE configuration_templates SET
  template_structure = jsonb_build_object(
    'sections', ARRAY['global', 'authentication', 'authorization', 'accounting', 'interfaces', 'security'],
    'complexity_metrics', jsonb_build_object('lines', 100, 'commands', 50, 'dependencies', 5),
    'automation_ready', true
  ),
  ai_optimization_rules = jsonb_build_object(
    'performance_rules', ARRAY['optimize_timers', 'load_balancing', 'redundancy'],
    'security_rules', ARRAY['strong_encryption', 'certificate_validation', 'secure_protocols'],
    'compliance_rules', ARRAY['audit_logging', 'access_control', 'data_protection']
  ),
  wizard_parameters = jsonb_build_object(
    'required_inputs', ARRAY['vendor', 'model', 'deployment_type', 'security_level'],
    'optional_inputs', ARRAY['vlan_ranges', 'radius_servers', 'certificate_info'],
    'ai_suggestions', ARRAY['vendor_best_practices', 'security_hardening', 'performance_optimization']
  ),
  deployment_scenarios = ARRAY['new_deployment', 'migration', 'upgrade', 'troubleshooting'],
  compatibility_matrix = jsonb_build_object(
    'minimum_version', '16.6',
    'recommended_version', '17.x',
    'tested_platforms', ARRAY['Catalyst 3650', 'Catalyst 3850', 'Catalyst 9300', 'Catalyst 9400']
  ),
  automation_level = 'semi_automated',
  ai_generated = false,
  optimization_score = 8.5
WHERE vendor_id IS NOT NULL;

-- Enable RLS policies for new tables
ALTER TABLE config_template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_wizard_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_generation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Categories are readable by authenticated users" ON config_template_categories
  FOR SELECT USING (true);

CREATE POLICY "Users can create categories" ON config_template_categories
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view wizard steps for accessible templates" ON config_wizard_steps
  FOR SELECT USING (true);

CREATE POLICY "Users can create wizard steps for their templates" ON config_wizard_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM configuration_templates ct 
      WHERE ct.id = template_id AND (ct.created_by = auth.uid() OR ct.is_public = true)
    )
  );

CREATE POLICY "Users can view their optimization history" ON ai_optimization_history
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create optimization history" ON ai_optimization_history
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their generation sessions" ON config_generation_sessions
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create generation sessions" ON config_generation_sessions
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their generation sessions" ON config_generation_sessions
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can view template analytics" ON template_usage_analytics
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create usage analytics" ON template_usage_analytics
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create indexes for performance
CREATE INDEX idx_config_templates_ai_generated ON configuration_templates(ai_generated);
CREATE INDEX idx_config_templates_optimization_score ON configuration_templates(optimization_score DESC);
CREATE INDEX idx_config_templates_automation_level ON configuration_templates(automation_level);
CREATE INDEX idx_config_categories_type ON config_template_categories(category_type);
CREATE INDEX idx_config_categories_parent ON config_template_categories(parent_category_id);
CREATE INDEX idx_wizard_steps_template ON config_wizard_steps(template_id, step_order);
CREATE INDEX idx_optimization_history_template ON ai_optimization_history(template_id, created_at DESC);
CREATE INDEX idx_generation_sessions_status ON config_generation_sessions(status, last_activity);
CREATE INDEX idx_usage_analytics_template ON template_usage_analytics(template_id, created_at DESC);

-- Create trigger for updating last_activity in generation sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_generation_session_activity
  BEFORE UPDATE ON config_generation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();