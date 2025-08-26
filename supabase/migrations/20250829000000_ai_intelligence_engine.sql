-- =============================================================================
-- AI INTELLIGENCE ENGINE DATABASE SCHEMA
-- =============================================================================
-- This migration creates the database schema for the AI Intelligence Engine
-- including context storage, recommendations, interactions, and learning data.

-- =============================================================================
-- PHASE 1: CONTEXT AND CORRELATION TABLES
-- =============================================================================

-- Project contexts for AI analysis
CREATE TABLE IF NOT EXISTS ai_project_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Organization Context
  industry TEXT,
  organization_size TEXT CHECK (organization_size IN ('small', 'medium', 'large', 'enterprise')),
  organization_type TEXT CHECK (organization_type IN ('public', 'private', 'non-profit', 'government')),
  locations TEXT[],
  
  -- Business Context
  pain_points TEXT[],
  business_objectives TEXT[],
  budget_range TEXT,
  timeline_requirements TEXT,
  compliance_requirements TEXT[],
  
  -- Technical Context
  existing_vendors TEXT[],
  network_architecture TEXT,
  device_count INTEGER,
  security_posture TEXT CHECK (security_posture IN ('basic', 'intermediate', 'advanced', 'enterprise')),
  
  -- Stakeholder Context
  stakeholder_role TEXT CHECK (stakeholder_role IN ('sales', 'sales_engineer', 'customer_success', 'implementation', 'support')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  
  -- Context Metadata
  context_completeness DECIMAL(3,2) DEFAULT 0.5,
  correlation_strength DECIMAL(3,2) DEFAULT 0.5,
  context_hash TEXT,
  
  -- Enrichment Data (JSONB for flexibility)
  industry_insights JSONB,
  compliance_context JSONB,
  organizational_patterns JSONB,
  correlations JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI recommendations generated for projects
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  context_id UUID REFERENCES ai_project_contexts(id) ON DELETE CASCADE,
  
  -- Recommendation Details
  type TEXT NOT NULL CHECK (type IN ('vendor', 'use_case', 'requirement', 'configuration', 'timeline', 'approach', 'risk_mitigation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Confidence and Quality Metrics
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT NOT NULL,
  evidence JSONB DEFAULT '[]',
  
  -- Business Impact Assessment
  business_value TEXT,
  implementation_complexity TEXT CHECK (implementation_complexity IN ('low', 'medium', 'high')),
  estimated_effort TEXT,
  estimated_cost TEXT,
  
  -- Implementation Guidance
  next_steps JSONB DEFAULT '[]',
  alternatives JSONB DEFAULT '[]',
  dependencies JSONB DEFAULT '[]',
  risks JSONB DEFAULT '[]',
  
  -- Metadata
  sources JSONB DEFAULT '[]',
  context_hash TEXT,
  model_version TEXT DEFAULT '1.0.0',
  
  -- User Interaction
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'implemented')),
  user_feedback JSONB,
  interaction_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI interactions for learning and improvement
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request Context
  request_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES ai_recommendations(id) ON DELETE CASCADE,
  
  -- Interaction Data
  action TEXT NOT NULL CHECK (action IN ('generated', 'accepted', 'rejected', 'feedback', 'alternative_requested')),
  context JSONB NOT NULL,
  response JSONB,
  
  -- Quality Metrics
  confidence DECIMAL(3,2),
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  feedback_text TEXT,
  
  -- Learning Data
  processing_time INTEGER, -- milliseconds
  context_factors JSONB,
  model_version TEXT DEFAULT '1.0.0',
  
  -- Session Information
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PHASE 2: KNOWLEDGE AND CORRELATION TABLES
-- =============================================================================

-- Industry profiles for context enrichment
CREATE TABLE IF NOT EXISTS industry_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL UNIQUE,
  sub_industries TEXT[],
  
  -- Common Patterns
  common_pain_points JSONB DEFAULT '[]',
  typical_vendors JSONB DEFAULT '[]',
  budget_profiles JSONB DEFAULT '{}',
  timeline_expectations JSONB DEFAULT '{}',
  
  -- Security and Compliance
  security_priorities JSONB DEFAULT '[]',
  compliance_frameworks TEXT[],
  common_threats JSONB DEFAULT '[]',
  
  -- Technical Patterns
  network_patterns JSONB DEFAULT '[]',
  device_types JSONB DEFAULT '[]',
  integration_patterns JSONB DEFAULT '[]',
  
  -- Success Patterns
  success_metrics JSONB DEFAULT '[]',
  critical_success_factors JSONB DEFAULT '[]',
  common_failure_points JSONB DEFAULT '[]',
  
  -- Metadata
  confidence_score DECIMAL(3,2) DEFAULT 0.7,
  last_updated TIMESTAMP DEFAULT NOW(),
  source TEXT DEFAULT 'manual',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Correlation mappings between different entities
CREATE TABLE IF NOT EXISTS ai_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Correlation Details
  source_type TEXT NOT NULL CHECK (source_type IN ('vendor', 'use_case', 'requirement', 'pain_point', 'industry')),
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('vendor', 'use_case', 'requirement', 'pain_point', 'industry')),
  target_id TEXT NOT NULL,
  
  -- Correlation Strength
  correlation_strength DECIMAL(3,2) NOT NULL CHECK (correlation_strength >= 0 AND correlation_strength <= 1),
  correlation_type TEXT CHECK (correlation_type IN ('positive', 'negative', 'neutral')),
  
  -- Evidence and Context
  evidence JSONB DEFAULT '[]',
  context_factors JSONB DEFAULT '{}',
  confidence DECIMAL(3,2) DEFAULT 0.5,
  
  -- Learning Data
  interaction_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  last_validated TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique correlations
  UNIQUE(source_type, source_id, target_type, target_id)
);

-- =============================================================================
-- PHASE 3: PROMPT TEMPLATES AND CUSTOMIZATION
-- =============================================================================

-- AI prompt templates for different use cases
CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sales', 'scoping', 'design', 'implementation', 'customer_success')),
  
  -- Template Content
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  
  -- Response Configuration
  response_format JSONB NOT NULL DEFAULT '{"structure": "json", "sections": [], "confidenceRequired": true}',
  parameters JSONB DEFAULT '[]',
  
  -- Template Metadata
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  
  -- Customization
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  organization_id UUID, -- For organization-specific templates
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(name, version)
);

-- =============================================================================
-- PHASE 4: PERFORMANCE INDEXES
-- =============================================================================

-- Indexes for ai_project_contexts
CREATE INDEX IF NOT EXISTS idx_ai_project_contexts_project_id ON ai_project_contexts(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_project_contexts_industry ON ai_project_contexts(industry);
CREATE INDEX IF NOT EXISTS idx_ai_project_contexts_org_size ON ai_project_contexts(organization_size);
CREATE INDEX IF NOT EXISTS idx_ai_project_contexts_stakeholder_role ON ai_project_contexts(stakeholder_role);
CREATE INDEX IF NOT EXISTS idx_ai_project_contexts_context_hash ON ai_project_contexts(context_hash);

-- Indexes for ai_recommendations
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_project_id ON ai_recommendations(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_context_id ON ai_recommendations(context_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_type ON ai_recommendations(type);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_confidence ON ai_recommendations(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created_at ON ai_recommendations(created_at DESC);

-- Indexes for ai_interactions
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_project_id ON ai_interactions(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_recommendation_id ON ai_interactions(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_action ON ai_interactions(action);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_request_type ON ai_interactions(request_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at DESC);

-- Indexes for industry_profiles
CREATE INDEX IF NOT EXISTS idx_industry_profiles_industry ON industry_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_industry_profiles_confidence ON industry_profiles(confidence_score DESC);

-- Indexes for ai_correlations
CREATE INDEX IF NOT EXISTS idx_ai_correlations_source ON ai_correlations(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_ai_correlations_target ON ai_correlations(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_ai_correlations_strength ON ai_correlations(correlation_strength DESC);
CREATE INDEX IF NOT EXISTS idx_ai_correlations_type ON ai_correlations(correlation_type);

-- Indexes for ai_prompt_templates
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_category ON ai_prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_active ON ai_prompt_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_usage ON ai_prompt_templates(usage_count DESC);

-- =============================================================================
-- PHASE 5: ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE ai_project_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_project_contexts
CREATE POLICY "Users can view project contexts they have access to" ON ai_project_contexts
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert project contexts for their projects" ON ai_project_contexts
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update project contexts for their projects" ON ai_project_contexts
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for ai_recommendations
CREATE POLICY "Users can view recommendations for their projects" ON ai_recommendations
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert recommendations for their projects" ON ai_recommendations
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update recommendations for their projects" ON ai_recommendations
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for ai_interactions
CREATE POLICY "Users can view their own interactions" ON ai_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own interactions" ON ai_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for industry_profiles (read-only for most users)
CREATE POLICY "All authenticated users can view industry profiles" ON industry_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify industry profiles" ON industry_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for ai_correlations (read-only for most users)
CREATE POLICY "All authenticated users can view correlations" ON ai_correlations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify correlations" ON ai_correlations
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for ai_prompt_templates
CREATE POLICY "Users can view active prompt templates" ON ai_prompt_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own custom templates" ON ai_prompt_templates
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create custom templates" ON ai_prompt_templates
  FOR INSERT WITH CHECK (created_by = auth.uid() AND is_custom = true);

CREATE POLICY "Users can update their own custom templates" ON ai_prompt_templates
  FOR UPDATE USING (created_by = auth.uid() AND is_custom = true);

-- =============================================================================
-- PHASE 6: INITIAL DATA SEEDING
-- =============================================================================

-- Insert default industry profiles
INSERT INTO industry_profiles (industry, sub_industries, common_pain_points, compliance_frameworks) VALUES
('Healthcare', ARRAY['Hospitals', 'Clinics', 'Medical Devices'], 
 '[
   {"name": "HIPAA Compliance", "priority": "critical", "description": "Patient data protection requirements"},
   {"name": "Medical Device Security", "priority": "high", "description": "IoT medical device access control"},
   {"name": "Network Segmentation", "priority": "high", "description": "Separate patient and administrative networks"}
 ]'::jsonb,
 ARRAY['HIPAA', 'HITECH', 'FDA 21 CFR Part 11']),

('Financial Services', ARRAY['Banks', 'Credit Unions', 'Investment Firms'], 
 '[
   {"name": "PCI DSS Compliance", "priority": "critical", "description": "Payment card data protection"},
   {"name": "Regulatory Compliance", "priority": "critical", "description": "SOX, GLBA, and other financial regulations"},
   {"name": "Fraud Prevention", "priority": "high", "description": "Advanced threat detection and prevention"}
 ]'::jsonb,
 ARRAY['PCI DSS', 'SOX', 'GLBA', 'FFIEC']),

('Education', ARRAY['K-12', 'Higher Education', 'Online Learning'], 
 '[
   {"name": "FERPA Compliance", "priority": "high", "description": "Student record privacy protection"},
   {"name": "BYOD Management", "priority": "high", "description": "Student and faculty device access control"},
   {"name": "Budget Constraints", "priority": "medium", "description": "Cost-effective security solutions"}
 ]'::jsonb,
 ARRAY['FERPA', 'COPPA']),

('Government', ARRAY['Federal', 'State', 'Local', 'Military'], 
 '[
   {"name": "FISMA Compliance", "priority": "critical", "description": "Federal information security requirements"},
   {"name": "Zero Trust Architecture", "priority": "high", "description": "Never trust, always verify approach"},
   {"name": "Classified Data Protection", "priority": "critical", "description": "Multi-level security clearance access"}
 ]'::jsonb,
 ARRAY['FISMA', 'NIST', 'FedRAMP', 'DISA STIG'])

ON CONFLICT (industry) DO NOTHING;

-- Insert default prompt templates
INSERT INTO ai_prompt_templates (name, category, system_prompt, user_prompt_template, response_format) VALUES
('vendor_selection_sales', 'sales', 
 'You are an expert NAC consultant focused on helping sales teams identify the best vendor solutions for prospects. Provide business-focused recommendations with clear ROI justification.',
 'Analyze this prospect context and recommend the top 3 NAC vendors:

Industry: {{industry}}
Organization Size: {{organizationSize}}
Pain Points: {{painPoints}}
Budget: {{budget}}
Timeline: {{timeline}}

Focus on business value, competitive advantages, and sales positioning.',
 '{"structure": "json", "sections": [{"name": "recommendations", "required": true}, {"name": "businessJustification", "required": true}, {"name": "competitiveAdvantages", "required": true}], "confidenceRequired": true}'::jsonb),

('project_scoping_se', 'scoping',
 'You are an expert sales engineer who helps create accurate, comprehensive project scopes for NAC implementations. Focus on technical feasibility, resource requirements, and risk assessment.',
 'Create a detailed project scope for this NAC implementation:

{{contextSections}}

Provide realistic timelines, resource estimates, and identify potential challenges.',
 '{"structure": "json", "sections": [{"name": "scope", "required": true}, {"name": "timeline", "required": true}, {"name": "resources", "required": true}, {"name": "risks", "required": true}], "confidenceRequired": true}'::jsonb)

ON CONFLICT (name, version) DO NOTHING;

-- =============================================================================
-- FINAL REPORT
-- =============================================================================

DO $$
DECLARE
    context_count INTEGER;
    recommendation_count INTEGER;
    interaction_count INTEGER;
    profile_count INTEGER;
    template_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO context_count FROM ai_project_contexts;
    SELECT COUNT(*) INTO recommendation_count FROM ai_recommendations;
    SELECT COUNT(*) INTO interaction_count FROM ai_interactions;
    SELECT COUNT(*) INTO profile_count FROM industry_profiles;
    SELECT COUNT(*) INTO template_count FROM ai_prompt_templates;
    
    RAISE NOTICE 'AI Intelligence Engine Database Setup Complete!';
    RAISE NOTICE 'Tables created: ai_project_contexts, ai_recommendations, ai_interactions, industry_profiles, ai_correlations, ai_prompt_templates';
    RAISE NOTICE 'Industry profiles seeded: %', profile_count;
    RAISE NOTICE 'Prompt templates seeded: %', template_count;
    RAISE NOTICE 'All indexes and RLS policies applied successfully';
END
$$;
