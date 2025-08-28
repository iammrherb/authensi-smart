-- =============================================
-- PREMIUM VENDOR ENRICHMENT MIGRATION
-- =============================================
-- This migration creates comprehensive data structures for storing
-- every possible vendor detail, model, firmware, feature, and configuration

-- =============================================
-- VENDOR MODELS & FIRMWARE
-- =============================================

CREATE TABLE IF NOT EXISTS public.vendor_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    model_number VARCHAR(255),
    product_line VARCHAR(255),
    category VARCHAR(100), -- 'switch', 'firewall', 'wireless', 'nac_appliance', 'cloud_service'
    
    -- Detailed specifications
    specifications JSONB DEFAULT '{}',
    supported_features TEXT[],
    hardware_specs JSONB,
    performance_metrics JSONB,
    
    -- Lifecycle information
    release_date DATE,
    end_of_sale DATE,
    end_of_support DATE,
    lifecycle_status VARCHAR(50), -- 'current', 'mature', 'end_of_sale', 'end_of_life'
    
    -- Documentation and resources
    datasheet_url TEXT,
    configuration_guide_url TEXT,
    api_documentation_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_vendor_model UNIQUE (vendor_id, model_name, model_number)
);

CREATE TABLE IF NOT EXISTS public.vendor_firmware (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES public.vendor_models(id) ON DELETE CASCADE,
    version VARCHAR(100) NOT NULL,
    release_date DATE,
    
    -- Version details
    is_latest BOOLEAN DEFAULT false,
    is_recommended BOOLEAN DEFAULT false,
    is_critical_update BOOLEAN DEFAULT false,
    
    -- Features and changes
    new_features TEXT[],
    bug_fixes TEXT[],
    known_issues TEXT[],
    security_patches TEXT[],
    
    -- Compatibility
    min_hardware_version VARCHAR(50),
    compatible_models UUID[], -- References to other vendor_models
    prerequisites TEXT[],
    
    -- Resources
    download_url TEXT,
    release_notes_url TEXT,
    upgrade_guide_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_firmware_version UNIQUE (model_id, version)
);

-- =============================================
-- VENDOR FEATURES & CAPABILITIES
-- =============================================

CREATE TABLE IF NOT EXISTS public.vendor_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
    model_id UUID REFERENCES public.vendor_models(id) ON DELETE CASCADE,
    firmware_id UUID REFERENCES public.vendor_firmware(id) ON DELETE CASCADE,
    
    feature_name VARCHAR(255) NOT NULL,
    feature_category VARCHAR(100), -- 'authentication', 'authorization', 'accounting', 'security', 'integration'
    feature_type VARCHAR(50), -- 'standard', 'advanced', 'premium', 'enterprise'
    
    -- Detailed configuration
    configuration_template TEXT,
    configuration_parameters JSONB,
    cli_commands TEXT[],
    api_endpoints JSONB,
    
    -- Requirements and dependencies
    license_required VARCHAR(255),
    prerequisites TEXT[],
    dependencies UUID[], -- Other features required
    conflicts_with UUID[], -- Features that conflict
    
    -- Best practices and recommendations
    best_practices TEXT[],
    common_issues TEXT[],
    troubleshooting_steps JSONB,
    performance_impact VARCHAR(50), -- 'none', 'low', 'medium', 'high'
    
    -- Integration details
    integration_points JSONB,
    supported_protocols TEXT[],
    api_version VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONFIGURATION TEMPLATES
-- =============================================

CREATE TABLE IF NOT EXISTS public.vendor_config_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
    model_id UUID REFERENCES public.vendor_models(id) ON DELETE CASCADE,
    
    template_name VARCHAR(255) NOT NULL,
    template_category VARCHAR(100), -- 'basic', 'enterprise', 'zero_trust', 'compliance_focused'
    use_case VARCHAR(255),
    
    -- Configuration content
    base_config TEXT NOT NULL,
    variables JSONB, -- Dynamic variables in the template
    
    -- Sections and components
    config_sections JSONB, -- Organized configuration sections
    
    -- Validation and requirements
    validation_rules JSONB,
    minimum_firmware_version VARCHAR(100),
    required_licenses TEXT[],
    
    -- Metadata
    industry_vertical VARCHAR(100),
    company_size VARCHAR(50), -- 'small', 'medium', 'large', 'enterprise'
    complexity_level VARCHAR(50), -- 'basic', 'intermediate', 'advanced', 'expert'
    estimated_deployment_time INTEGER, -- in minutes
    
    -- Testing and validation
    test_scenarios JSONB,
    validation_checklist JSONB,
    rollback_procedure TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =============================================
-- COMPLIANCE FRAMEWORKS & CONTROLS
-- =============================================

CREATE TABLE IF NOT EXISTS public.compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_name VARCHAR(255) NOT NULL UNIQUE,
    framework_version VARCHAR(50),
    acronym VARCHAR(50),
    
    description TEXT,
    regulatory_body VARCHAR(255),
    industry_focus TEXT[],
    geographic_scope TEXT[],
    
    -- Framework details
    control_families JSONB,
    total_controls INTEGER,
    maturity_levels JSONB,
    
    -- Resources
    official_url TEXT,
    documentation_url TEXT,
    certification_process JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.compliance_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID NOT NULL REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE,
    
    control_id VARCHAR(100) NOT NULL,
    control_title VARCHAR(500) NOT NULL,
    control_description TEXT,
    control_family VARCHAR(255),
    
    -- Implementation details
    implementation_guidance TEXT,
    testing_procedures JSONB,
    evidence_requirements TEXT[],
    
    -- Vendor mappings
    vendor_implementations JSONB, -- How different vendors implement this control
    
    -- Risk and priority
    risk_level VARCHAR(50), -- 'critical', 'high', 'medium', 'low'
    priority INTEGER,
    is_mandatory BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_framework_control UNIQUE (framework_id, control_id)
);

-- =============================================
-- VENDOR-COMPLIANCE MAPPINGS
-- =============================================

CREATE TABLE IF NOT EXISTS public.vendor_compliance_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES public.compliance_controls(id) ON DELETE CASCADE,
    
    compliance_status VARCHAR(50), -- 'fully_compliant', 'partially_compliant', 'non_compliant', 'not_applicable'
    implementation_method TEXT,
    configuration_required TEXT,
    
    -- Evidence and validation
    validation_steps JSONB,
    evidence_template TEXT,
    audit_notes TEXT,
    
    -- Feature requirements
    required_features UUID[], -- References to vendor_features
    required_licenses TEXT[],
    minimum_firmware_version VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_vendor_control_mapping UNIQUE (vendor_id, control_id)
);

-- =============================================
-- BUSINESS INTELLIGENCE & ANALYTICS
-- =============================================

CREATE TABLE IF NOT EXISTS public.vendor_market_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
    
    -- Market position
    market_share DECIMAL(5,2),
    gartner_quadrant VARCHAR(50),
    forrester_wave_position VARCHAR(50),
    
    -- Financial metrics
    annual_revenue DECIMAL(15,2),
    growth_rate DECIMAL(5,2),
    customer_count INTEGER,
    
    -- Competitive analysis
    key_differentiators TEXT[],
    weaknesses TEXT[],
    competitive_threats TEXT[],
    market_opportunities TEXT[],
    
    -- Customer insights
    average_deal_size DECIMAL(12,2),
    typical_deployment_time INTEGER, -- in days
    customer_satisfaction_score DECIMAL(3,2),
    net_promoter_score INTEGER,
    
    -- Recent developments
    recent_acquisitions JSONB,
    new_partnerships JSONB,
    product_launches JSONB,
    
    data_as_of DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USE CASE ENRICHMENT
-- =============================================

CREATE TABLE IF NOT EXISTS public.use_case_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    use_case_id UUID NOT NULL REFERENCES public.use_case_library(id) ON DELETE CASCADE,
    
    scenario_name VARCHAR(255) NOT NULL,
    scenario_description TEXT,
    
    -- Detailed implementation
    implementation_steps JSONB,
    required_components JSONB,
    architecture_diagram_url TEXT,
    
    -- Vendor solutions
    recommended_vendors UUID[], -- References to vendor_library
    vendor_specific_configs JSONB,
    
    -- Success metrics
    success_criteria JSONB,
    kpis JSONB,
    expected_roi JSONB,
    
    -- Risk and challenges
    potential_risks JSONB,
    mitigation_strategies JSONB,
    common_pitfalls TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_vendor_models_vendor ON public.vendor_models(vendor_id);
CREATE INDEX idx_vendor_models_lifecycle ON public.vendor_models(lifecycle_status);
CREATE INDEX idx_vendor_firmware_model ON public.vendor_firmware(model_id);
CREATE INDEX idx_vendor_firmware_latest ON public.vendor_firmware(is_latest) WHERE is_latest = true;
CREATE INDEX idx_vendor_features_vendor ON public.vendor_features(vendor_id);
CREATE INDEX idx_vendor_features_category ON public.vendor_features(feature_category);
CREATE INDEX idx_vendor_config_templates_vendor ON public.vendor_config_templates(vendor_id);
CREATE INDEX idx_compliance_controls_framework ON public.compliance_controls(framework_id);
CREATE INDEX idx_vendor_compliance_vendor ON public.vendor_compliance_mappings(vendor_id);
CREATE INDEX idx_vendor_compliance_control ON public.vendor_compliance_mappings(control_id);
CREATE INDEX idx_vendor_market_vendor ON public.vendor_market_intelligence(vendor_id);
CREATE INDEX idx_use_case_scenarios_use_case ON public.use_case_scenarios(use_case_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_firmware ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_config_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_compliance_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.use_case_scenarios ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read vendor models" ON public.vendor_models FOR SELECT USING (true);
CREATE POLICY "Public read vendor firmware" ON public.vendor_firmware FOR SELECT USING (true);
CREATE POLICY "Public read vendor features" ON public.vendor_features FOR SELECT USING (true);
CREATE POLICY "Public read config templates" ON public.vendor_config_templates FOR SELECT USING (true);
CREATE POLICY "Public read compliance frameworks" ON public.compliance_frameworks FOR SELECT USING (true);
CREATE POLICY "Public read compliance controls" ON public.compliance_controls FOR SELECT USING (true);
CREATE POLICY "Public read vendor compliance" ON public.vendor_compliance_mappings FOR SELECT USING (true);
CREATE POLICY "Public read market intelligence" ON public.vendor_market_intelligence FOR SELECT USING (true);
CREATE POLICY "Public read use case scenarios" ON public.use_case_scenarios FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Authenticated write vendor models" ON public.vendor_models FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write vendor firmware" ON public.vendor_firmware FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write vendor features" ON public.vendor_features FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write config templates" ON public.vendor_config_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write compliance frameworks" ON public.compliance_frameworks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write compliance controls" ON public.compliance_controls FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write vendor compliance" ON public.vendor_compliance_mappings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write market intelligence" ON public.vendor_market_intelligence FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write use case scenarios" ON public.use_case_scenarios FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Premium Vendor Enrichment migration complete.';
    RAISE NOTICE 'Created tables for models, firmware, features, compliance, and market intelligence.';
END;
$$;

