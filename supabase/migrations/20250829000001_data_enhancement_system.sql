-- =============================================================================
-- DATA ENHANCEMENT SYSTEM DATABASE SCHEMA
-- =============================================================================
-- This migration creates the database schema for the comprehensive data
-- enhancement system that learns from every wizard interaction and continuously
-- optimizes all datasets with correlations, configurations, and intelligence.

-- =============================================================================
-- PHASE 1: WIZARD INTERACTIONS AND LEARNING DATA
-- =============================================================================

-- Wizard interactions for learning and enhancement
CREATE TABLE IF NOT EXISTS wizard_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Interaction Context
  wizard_type TEXT NOT NULL,
  step_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  
  -- Selection Data
  selections JSONB NOT NULL DEFAULT '[]',
  context JSONB NOT NULL DEFAULT '{}',
  
  -- Learning Metadata
  processing_time INTEGER, -- milliseconds
  confidence_scores JSONB DEFAULT '{}',
  enhancement_triggers JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhancement suggestions queue
CREATE TABLE IF NOT EXISTS enhancement_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Target Entity
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vendor', 'use_case', 'requirement', 'pain_point', 'business_profile', 'configuration', 'vulnerability')),
  
  -- Suggestion Details
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('add_tag', 'add_label', 'add_attribute', 'add_correlation', 'update_description', 'add_model', 'add_firmware')),
  suggestion JSONB NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT NOT NULL,
  
  -- Evidence and Priority
  evidence JSONB DEFAULT '[]',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Status and Processing
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied', 'expired')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  applied_at TIMESTAMP,
  
  -- Metadata
  source TEXT DEFAULT 'ai_analysis',
  batch_id UUID,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PHASE 2: ENHANCED ENTITY CORRELATION SYSTEM
-- =============================================================================

-- Enhanced correlations with detailed evidence and context
CREATE TABLE IF NOT EXISTS entity_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Correlation Mapping
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  
  -- Correlation Details
  correlation_type TEXT NOT NULL CHECK (correlation_type IN ('positive', 'negative', 'neutral', 'dependency', 'conflict', 'alternative')),
  strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  
  -- Context and Evidence
  context_factors JSONB DEFAULT '[]',
  evidence JSONB DEFAULT '[]',
  usage_patterns JSONB DEFAULT '{}',
  
  -- Learning Metrics
  interaction_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  last_validated TIMESTAMP DEFAULT NOW(),
  validation_count INTEGER DEFAULT 0,
  
  -- Metadata
  discovery_method TEXT DEFAULT 'pattern_analysis',
  source_interactions JSONB DEFAULT '[]',
  quality_score DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique correlations
  UNIQUE(source_type, source_id, target_type, target_id, correlation_type)
);

-- =============================================================================
-- PHASE 3: VENDOR CONFIGURATION INTELLIGENCE
-- =============================================================================

-- Vendor models with detailed attributes
CREATE TABLE IF NOT EXISTS vendor_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendor_library(id) ON DELETE CASCADE,
  
  -- Model Details
  model_name TEXT NOT NULL,
  model_number TEXT,
  product_family TEXT,
  category TEXT,
  
  -- Technical Specifications
  specifications JSONB DEFAULT '{}', -- CPU, RAM, ports, etc.
  capabilities JSONB DEFAULT '[]',
  supported_features JSONB DEFAULT '[]',
  
  -- Firmware and Software
  firmware_versions JSONB DEFAULT '[]',
  latest_firmware TEXT,
  end_of_life DATE,
  end_of_support DATE,
  
  -- Configuration Details
  default_credentials JSONB DEFAULT '{}',
  management_interfaces JSONB DEFAULT '[]', -- CLI, GUI, API, SNMP
  configuration_syntax TEXT, -- cli, gui, api, script
  
  -- Use Case Mappings
  recommended_use_cases JSONB DEFAULT '[]',
  deployment_scenarios JSONB DEFAULT '[]',
  sizing_guidelines JSONB DEFAULT '{}',
  
  -- Documentation and Support
  documentation_links JSONB DEFAULT '[]',
  support_level TEXT,
  training_resources JSONB DEFAULT '[]',
  
  -- Enhancement Metadata
  tags TEXT[] DEFAULT '{}',
  labels JSONB DEFAULT '{}',
  enhancement_score DECIMAL(3,2) DEFAULT 0.5,
  last_enhanced TIMESTAMP DEFAULT NOW(),
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('verified', 'pending', 'needs_review', 'deprecated')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(vendor_id, model_name)
);

-- Configuration templates with intelligence
CREATE TABLE IF NOT EXISTS configuration_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template Identity
  name TEXT NOT NULL,
  description TEXT,
  vendor_id UUID REFERENCES vendor_library(id) ON DELETE CASCADE,
  model_ids UUID[] DEFAULT '{}', -- Array of vendor_model IDs
  
  -- Template Details
  template_type TEXT NOT NULL CHECK (template_type IN ('basic', 'advanced', 'enterprise', 'specialized', 'migration')),
  use_cases TEXT[] NOT NULL,
  deployment_scenarios TEXT[] DEFAULT '{}',
  
  -- Template Content
  template_content TEXT NOT NULL,
  template_variables JSONB DEFAULT '[]',
  validation_rules JSONB DEFAULT '[]',
  test_cases JSONB DEFAULT '[]',
  
  -- CLI Commands and Syntax
  syntax_type TEXT DEFAULT 'cli' CHECK (syntax_type IN ('cli', 'gui', 'api', 'script')),
  cli_commands JSONB DEFAULT '[]',
  api_endpoints JSONB DEFAULT '[]',
  
  -- Quality and Validation
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('verified', 'pending', 'needs_review', 'deprecated')),
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  last_tested TIMESTAMP,
  
  -- Enhancement Data
  tags TEXT[] DEFAULT '{}',
  labels JSONB DEFAULT '{}',
  correlations JSONB DEFAULT '[]',
  enhancement_score DECIMAL(3,2) DEFAULT 0.5,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  version TEXT DEFAULT '1.0',
  changelog JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CLI commands library
CREATE TABLE IF NOT EXISTS cli_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Command Identity
  vendor_id UUID REFERENCES vendor_library(id) ON DELETE CASCADE,
  model_ids UUID[] DEFAULT '{}',
  command_name TEXT NOT NULL,
  command_syntax TEXT NOT NULL,
  
  -- Command Details
  description TEXT,
  category TEXT, -- configuration, monitoring, troubleshooting, etc.
  subcategory TEXT,
  
  -- Parameters and Options
  parameters JSONB DEFAULT '[]',
  options JSONB DEFAULT '[]',
  examples JSONB DEFAULT '[]',
  
  -- Usage Context
  use_cases TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  warnings TEXT[] DEFAULT '{}',
  related_commands TEXT[] DEFAULT '{}',
  
  -- Validation and Testing
  validation_commands TEXT[] DEFAULT '{}',
  expected_outputs JSONB DEFAULT '[]',
  error_patterns JSONB DEFAULT '[]',
  
  -- Enhancement Data
  tags TEXT[] DEFAULT '{}',
  labels JSONB DEFAULT '{}',
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(vendor_id, command_name, command_syntax)
);

-- =============================================================================
-- PHASE 4: VULNERABILITY AND SECURITY INTELLIGENCE
-- =============================================================================

-- Vulnerability mappings
CREATE TABLE IF NOT EXISTS vulnerability_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Vulnerability Identity
  cve_id TEXT,
  vendor_advisory_id TEXT,
  internal_id TEXT,
  
  -- Affected Products
  vendor_id UUID REFERENCES vendor_library(id) ON DELETE CASCADE,
  affected_models JSONB DEFAULT '[]', -- Array of model names/IDs
  affected_versions JSONB DEFAULT '[]', -- Firmware/software versions
  
  -- Vulnerability Details
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  cvss_score DECIMAL(3,1),
  cvss_vector TEXT,
  
  -- Impact Assessment
  impact_types TEXT[] DEFAULT '{}', -- confidentiality, integrity, availability
  attack_vector TEXT, -- network, adjacent, local, physical
  attack_complexity TEXT, -- low, high
  privileges_required TEXT, -- none, low, high
  user_interaction TEXT, -- none, required
  
  -- Mitigation and Patches
  mitigation_strategies JSONB DEFAULT '[]',
  workarounds JSONB DEFAULT '[]',
  patch_available BOOLEAN DEFAULT false,
  patch_details JSONB DEFAULT '{}',
  
  -- Timeline
  discovered_date DATE,
  disclosed_date DATE,
  patch_release_date DATE,
  
  -- References and Sources
  references JSONB DEFAULT '[]',
  source_feeds TEXT[] DEFAULT '{}',
  
  -- Enhancement Data
  tags TEXT[] DEFAULT '{}',
  labels JSONB DEFAULT '{}',
  correlation_strength DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Configuration security analysis results
CREATE TABLE IF NOT EXISTS configuration_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Analysis Context
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendor_library(id),
  model_id UUID REFERENCES vendor_models(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- Configuration Data
  original_configuration TEXT NOT NULL,
  parsed_configuration JSONB,
  configuration_hash TEXT,
  
  -- Analysis Results
  security_score DECIMAL(3,2) DEFAULT 0,
  performance_score DECIMAL(3,2) DEFAULT 0,
  compliance_score DECIMAL(3,2) DEFAULT 0,
  overall_score DECIMAL(3,2) DEFAULT 0,
  
  -- Issues and Recommendations
  security_issues JSONB DEFAULT '[]',
  performance_issues JSONB DEFAULT '[]',
  compliance_issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  
  -- Optimized Configuration
  optimized_configuration TEXT,
  optimization_notes JSONB DEFAULT '[]',
  
  -- Validation
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'failed', 'needs_review')),
  validation_results JSONB DEFAULT '{}',
  
  -- Metadata
  analysis_version TEXT DEFAULT '1.0',
  processing_time INTEGER, -- milliseconds
  confidence DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PHASE 5: BUSINESS INTELLIGENCE AND PATTERNS
-- =============================================================================

-- Enhanced business profiles with learning
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profile Identity
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  sub_industries TEXT[] DEFAULT '{}',
  
  -- Organization Characteristics
  organization_sizes TEXT[] DEFAULT '{}',
  organization_types TEXT[] DEFAULT '{}',
  geographic_regions TEXT[] DEFAULT '{}',
  
  -- Business Patterns
  common_pain_points JSONB DEFAULT '[]',
  typical_objectives JSONB DEFAULT '[]',
  budget_patterns JSONB DEFAULT '{}',
  timeline_patterns JSONB DEFAULT '{}',
  decision_factors JSONB DEFAULT '[]',
  
  -- Technical Patterns
  preferred_vendors JSONB DEFAULT '[]',
  common_architectures JSONB DEFAULT '[]',
  security_postures JSONB DEFAULT '[]',
  compliance_requirements TEXT[] DEFAULT '{}',
  
  -- Success Patterns
  success_metrics JSONB DEFAULT '[]',
  critical_success_factors JSONB DEFAULT '[]',
  common_failure_points JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  
  -- Learning Data
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  data_points INTEGER DEFAULT 0,
  last_updated_from_interaction TIMESTAMP,
  validation_interactions INTEGER DEFAULT 0,
  
  -- Enhancement Metadata
  tags TEXT[] DEFAULT '{}',
  labels JSONB DEFAULT '{}',
  correlations JSONB DEFAULT '[]',
  enhancement_score DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(name, industry)
);

-- Pattern analysis results
CREATE TABLE IF NOT EXISTS interaction_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pattern Identity
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('selection', 'rejection', 'modification', 'correlation', 'sequence')),
  pattern_name TEXT NOT NULL,
  
  -- Pattern Data
  pattern_definition JSONB NOT NULL,
  pattern_frequency INTEGER DEFAULT 1,
  pattern_confidence DECIMAL(3,2) DEFAULT 0.5,
  
  -- Context
  applicable_contexts JSONB DEFAULT '[]',
  user_segments JSONB DEFAULT '[]',
  temporal_patterns JSONB DEFAULT '{}',
  
  -- Impact and Outcomes
  success_correlation DECIMAL(3,2) DEFAULT 0.5,
  business_impact JSONB DEFAULT '{}',
  enhancement_opportunities JSONB DEFAULT '[]',
  
  -- Learning Metadata
  discovery_date TIMESTAMP DEFAULT NOW(),
  last_observed TIMESTAMP DEFAULT NOW(),
  observation_count INTEGER DEFAULT 1,
  validation_status TEXT DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(pattern_type, pattern_name)
);

-- =============================================================================
-- PHASE 6: PERFORMANCE INDEXES
-- =============================================================================

-- Indexes for wizard_interactions
CREATE INDEX IF NOT EXISTS idx_wizard_interactions_user_id ON wizard_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wizard_interactions_project_id ON wizard_interactions(project_id);
CREATE INDEX IF NOT EXISTS idx_wizard_interactions_wizard_type ON wizard_interactions(wizard_type);
CREATE INDEX IF NOT EXISTS idx_wizard_interactions_session_id ON wizard_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_wizard_interactions_created_at ON wizard_interactions(created_at DESC);

-- Indexes for enhancement_suggestions
CREATE INDEX IF NOT EXISTS idx_enhancement_suggestions_entity ON enhancement_suggestions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_enhancement_suggestions_status ON enhancement_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_enhancement_suggestions_priority ON enhancement_suggestions(priority);
CREATE INDEX IF NOT EXISTS idx_enhancement_suggestions_confidence ON enhancement_suggestions(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_enhancement_suggestions_expires_at ON enhancement_suggestions(expires_at);

-- Indexes for entity_correlations
CREATE INDEX IF NOT EXISTS idx_entity_correlations_source ON entity_correlations(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_entity_correlations_target ON entity_correlations(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_entity_correlations_strength ON entity_correlations(strength DESC);
CREATE INDEX IF NOT EXISTS idx_entity_correlations_confidence ON entity_correlations(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_entity_correlations_type ON entity_correlations(correlation_type);

-- Indexes for vendor_models
CREATE INDEX IF NOT EXISTS idx_vendor_models_vendor_id ON vendor_models(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_models_category ON vendor_models(category);
CREATE INDEX IF NOT EXISTS idx_vendor_models_enhancement_score ON vendor_models(enhancement_score DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_models_validation_status ON vendor_models(validation_status);

-- Indexes for configuration_templates
CREATE INDEX IF NOT EXISTS idx_configuration_templates_vendor_id ON configuration_templates(vendor_id);
CREATE INDEX IF NOT EXISTS idx_configuration_templates_type ON configuration_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_configuration_templates_use_cases ON configuration_templates USING GIN(use_cases);
CREATE INDEX IF NOT EXISTS idx_configuration_templates_success_rate ON configuration_templates(success_rate DESC);
CREATE INDEX IF NOT EXISTS idx_configuration_templates_usage_count ON configuration_templates(usage_count DESC);

-- Indexes for cli_commands
CREATE INDEX IF NOT EXISTS idx_cli_commands_vendor_id ON cli_commands(vendor_id);
CREATE INDEX IF NOT EXISTS idx_cli_commands_category ON cli_commands(category);
CREATE INDEX IF NOT EXISTS idx_cli_commands_use_cases ON cli_commands USING GIN(use_cases);
CREATE INDEX IF NOT EXISTS idx_cli_commands_success_rate ON cli_commands(success_rate DESC);

-- Indexes for vulnerability_mappings
CREATE INDEX IF NOT EXISTS idx_vulnerability_mappings_vendor_id ON vulnerability_mappings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vulnerability_mappings_severity ON vulnerability_mappings(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerability_mappings_cve_id ON vulnerability_mappings(cve_id);
CREATE INDEX IF NOT EXISTS idx_vulnerability_mappings_cvss_score ON vulnerability_mappings(cvss_score DESC);

-- Indexes for configuration_analyses
CREATE INDEX IF NOT EXISTS idx_configuration_analyses_project_id ON configuration_analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_configuration_analyses_vendor_id ON configuration_analyses(vendor_id);
CREATE INDEX IF NOT EXISTS idx_configuration_analyses_overall_score ON configuration_analyses(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_configuration_analyses_created_at ON configuration_analyses(created_at DESC);

-- Indexes for business_profiles
CREATE INDEX IF NOT EXISTS idx_business_profiles_industry ON business_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_business_profiles_confidence_score ON business_profiles(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_business_profiles_enhancement_score ON business_profiles(enhancement_score DESC);

-- Indexes for interaction_patterns
CREATE INDEX IF NOT EXISTS idx_interaction_patterns_type ON interaction_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_interaction_patterns_frequency ON interaction_patterns(pattern_frequency DESC);
CREATE INDEX IF NOT EXISTS idx_interaction_patterns_confidence ON interaction_patterns(pattern_confidence DESC);
CREATE INDEX IF NOT EXISTS idx_interaction_patterns_last_observed ON interaction_patterns(last_observed DESC);

-- =============================================================================
-- PHASE 7: ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE wizard_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhancement_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cli_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerability_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wizard_interactions
CREATE POLICY "Users can view their own interactions" ON wizard_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own interactions" ON wizard_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for enhancement_suggestions
CREATE POLICY "Users can view suggestions for their entities" ON enhancement_suggestions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert enhancement suggestions" ON enhancement_suggestions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update enhancement suggestions" ON enhancement_suggestions
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for entity_correlations
CREATE POLICY "All authenticated users can view correlations" ON entity_correlations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can manage correlations" ON entity_correlations
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for vendor_models
CREATE POLICY "All authenticated users can view vendor models" ON vendor_models
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage vendor models" ON vendor_models
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for configuration_templates
CREATE POLICY "Users can view public templates" ON configuration_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own templates" ON configuration_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON configuration_templates
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for cli_commands
CREATE POLICY "All authenticated users can view CLI commands" ON cli_commands
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage CLI commands" ON cli_commands
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for vulnerability_mappings
CREATE POLICY "All authenticated users can view vulnerabilities" ON vulnerability_mappings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage vulnerabilities" ON vulnerability_mappings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for configuration_analyses
CREATE POLICY "Users can view analyses for their projects" ON configuration_analyses
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can create analyses for their projects" ON configuration_analyses
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE 
      created_by = auth.uid() OR 
      id IN (SELECT project_id FROM project_team_members WHERE user_id = auth.uid())
    ) AND user_id = auth.uid()
  );

-- RLS Policies for business_profiles
CREATE POLICY "All authenticated users can view business profiles" ON business_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage business profiles" ON business_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for interaction_patterns
CREATE POLICY "All authenticated users can view patterns" ON interaction_patterns
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can manage patterns" ON interaction_patterns
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================================
-- PHASE 8: INITIAL DATA SEEDING
-- =============================================================================

-- Insert sample business profiles
INSERT INTO business_profiles (name, industry, sub_industries, common_pain_points, compliance_requirements) VALUES
('Healthcare Enterprise', 'Healthcare', ARRAY['Hospitals', 'Medical Centers'], 
 '[
   {"name": "Patient Data Security", "priority": "critical", "frequency": 0.95},
   {"name": "Medical Device Integration", "priority": "high", "frequency": 0.85},
   {"name": "Regulatory Compliance", "priority": "critical", "frequency": 0.90}
 ]'::jsonb,
 ARRAY['HIPAA', 'HITECH']),

('Financial Institution', 'Financial Services', ARRAY['Banks', 'Credit Unions'], 
 '[
   {"name": "PCI Compliance", "priority": "critical", "frequency": 0.98},
   {"name": "Fraud Prevention", "priority": "high", "frequency": 0.90},
   {"name": "Regulatory Reporting", "priority": "high", "frequency": 0.85}
 ]'::jsonb,
 ARRAY['PCI DSS', 'SOX', 'GLBA']),

('Educational Institution', 'Education', ARRAY['Universities', 'K-12'], 
 '[
   {"name": "Student Data Privacy", "priority": "high", "frequency": 0.80},
   {"name": "BYOD Management", "priority": "high", "frequency": 0.85},
   {"name": "Budget Constraints", "priority": "medium", "frequency": 0.90}
 ]'::jsonb,
 ARRAY['FERPA', 'COPPA'])

ON CONFLICT (name, industry) DO NOTHING;

-- Insert sample interaction patterns
INSERT INTO interaction_patterns (pattern_type, pattern_name, pattern_definition, pattern_confidence) VALUES
('selection', 'Healthcare Vendor Preference', 
 '{"vendors": ["Cisco", "Aruba", "Fortinet"], "industry": "healthcare", "frequency": 0.75}'::jsonb, 
 0.85),

('correlation', 'PCI Compliance Requirements', 
 '{"compliance": "PCI DSS", "required_features": ["network_segmentation", "access_logging", "encryption"], "strength": 0.90}'::jsonb, 
 0.92),

('sequence', 'Enterprise Scoping Flow', 
 '{"steps": ["organization", "compliance", "technical", "vendors"], "success_rate": 0.85}'::jsonb, 
 0.78)

ON CONFLICT (pattern_type, pattern_name) DO NOTHING;

-- =============================================================================
-- FINAL REPORT
-- =============================================================================

DO $$
DECLARE
    wizard_interaction_count INTEGER;
    enhancement_suggestion_count INTEGER;
    correlation_count INTEGER;
    vendor_model_count INTEGER;
    template_count INTEGER;
    profile_count INTEGER;
    pattern_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO wizard_interaction_count FROM wizard_interactions;
    SELECT COUNT(*) INTO enhancement_suggestion_count FROM enhancement_suggestions;
    SELECT COUNT(*) INTO correlation_count FROM entity_correlations;
    SELECT COUNT(*) INTO vendor_model_count FROM vendor_models;
    SELECT COUNT(*) INTO template_count FROM configuration_templates;
    SELECT COUNT(*) INTO profile_count FROM business_profiles;
    SELECT COUNT(*) INTO pattern_count FROM interaction_patterns;
    
    RAISE NOTICE 'Data Enhancement System Database Setup Complete!';
    RAISE NOTICE 'Tables created: wizard_interactions, enhancement_suggestions, entity_correlations, vendor_models, configuration_templates, cli_commands, vulnerability_mappings, configuration_analyses, business_profiles, interaction_patterns';
    RAISE NOTICE 'Business profiles seeded: %', profile_count;
    RAISE NOTICE 'Interaction patterns seeded: %', pattern_count;
    RAISE NOTICE 'All indexes and RLS policies applied successfully';
    RAISE NOTICE 'System ready for continuous learning and data enhancement!';
END
$$;
