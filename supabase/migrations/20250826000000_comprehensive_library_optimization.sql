-- =============================================================================
-- COMPREHENSIVE LIBRARY OPTIMIZATION MIGRATION
-- =============================================================================
-- This migration performs exhaustive optimization of ALL resource libraries
-- including vendors, templates, configurations, AI recommendations, and more
-- Enterprise-grade deduplication, standardization, and performance optimization

-- =============================================================================
-- PHASE 1: VENDOR LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify and log duplicate vendors
CREATE TEMP TABLE vendor_duplicates AS
SELECT 
  vendor_name,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids,
  array_agg(created_at) as created_dates,
  array_agg(category) as categories,
  array_agg(vendor_type) as vendor_types
FROM vendor_library 
GROUP BY vendor_name 
HAVING COUNT(*) > 1;

-- Step 2: Clean up vendor names and standardize
UPDATE vendor_library 
SET vendor_name = TRIM(vendor_name)
WHERE vendor_name != TRIM(vendor_name);

-- Step 3: Standardize common vendor name variations
UPDATE vendor_library 
SET vendor_name = 'Cisco'
WHERE vendor_name IN ('Cisco Systems', 'Cisco Systems Inc', 'Cisco Inc', 'Cisco Systems, Inc.');

UPDATE vendor_library 
SET vendor_name = 'Fortinet'
WHERE vendor_name IN ('Fortinet Inc', 'Fortinet Technologies', 'Fortinet, Inc.');

UPDATE vendor_library 
SET vendor_name = 'Aruba'
WHERE vendor_name IN ('Aruba Networks', 'Aruba, a Hewlett Packard Enterprise company', 'HPE Aruba');

UPDATE vendor_library 
SET vendor_name = 'Portnox'
WHERE vendor_name IN ('Portnox Ltd', 'Portnox Inc', 'Portnox, Inc.');

UPDATE vendor_library 
SET vendor_name = 'Juniper'
WHERE vendor_name IN ('Juniper Networks', 'Juniper Networks Inc', 'Juniper, Inc.');

UPDATE vendor_library 
SET vendor_name = 'Palo Alto Networks'
WHERE vendor_name IN ('Palo Alto', 'Palo Alto Networks Inc', 'Palo Alto, Inc.');

UPDATE vendor_library 
SET vendor_name = 'Check Point'
WHERE vendor_name IN ('Check Point Software Technologies', 'Check Point Software', 'CheckPoint');

-- Step 4: Ensure all vendors have required fields
UPDATE vendor_library 
SET 
  category = COALESCE(category, 'Unknown'),
  vendor_type = COALESCE(vendor_type, category),
  support_level = COALESCE(support_level, 'limited'),
  status = COALESCE(status, 'active'),
  portnox_integration_level = COALESCE(portnox_integration_level, 'limited')
WHERE 
  category IS NULL OR 
  vendor_type IS NULL OR 
  support_level IS NULL OR 
  status IS NULL OR 
  portnox_integration_level IS NULL;

-- Step 5: Add performance indexes for vendor_library
CREATE INDEX IF NOT EXISTS idx_vendor_library_name ON vendor_library(vendor_name);
CREATE INDEX IF NOT EXISTS idx_vendor_library_category ON vendor_library(category);
CREATE INDEX IF NOT EXISTS idx_vendor_library_support_level ON vendor_library(support_level);
CREATE INDEX IF NOT EXISTS idx_vendor_library_status ON vendor_library(status);
CREATE INDEX IF NOT EXISTS idx_vendor_library_portnox_integration ON vendor_library(portnox_integration_level);
CREATE INDEX IF NOT EXISTS idx_vendor_library_created_at ON vendor_library(created_at);

-- =============================================================================
-- PHASE 2: USE CASE LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate use cases
CREATE TEMP TABLE use_case_duplicates AS
SELECT 
  name,
  category,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM use_case_library 
GROUP BY name, category
HAVING COUNT(*) > 1;

-- Step 2: Clean up use case names
UPDATE use_case_library 
SET name = TRIM(name)
WHERE name != TRIM(name);

-- Step 3: Standardize use case categories
UPDATE use_case_library 
SET category = 'Authentication'
WHERE category IN ('auth', 'Auth', 'AUTH', 'authentication');

UPDATE use_case_library 
SET category = 'Authorization'
WHERE category IN ('authorization', 'AuthZ', 'AUTHZ');

UPDATE use_case_library 
SET category = 'Monitoring'
WHERE category IN ('monitoring', 'MONITORING', 'Monitor');

UPDATE use_case_library 
SET category = 'Compliance'
WHERE category IN ('compliance', 'COMPLIANCE', 'Compliant');

-- Step 4: Ensure required fields
UPDATE use_case_library 
SET 
  complexity = COALESCE(complexity, 'medium'),
  status = COALESCE(status, 'active'),
  subcategory = COALESCE(subcategory, 'General')
WHERE 
  complexity IS NULL OR 
  status IS NULL OR 
  subcategory IS NULL;

-- Step 5: Add performance indexes for use_case_library
CREATE INDEX IF NOT EXISTS idx_use_case_library_name ON use_case_library(name);
CREATE INDEX IF NOT EXISTS idx_use_case_library_category ON use_case_library(category);
CREATE INDEX IF NOT EXISTS idx_use_case_library_complexity ON use_case_library(complexity);
CREATE INDEX IF NOT EXISTS idx_use_case_library_status ON use_case_library(status);

-- =============================================================================
-- PHASE 3: REQUIREMENTS LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate requirements
CREATE TEMP TABLE requirements_duplicates AS
SELECT 
  title,
  category,
  requirement_type,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM requirements_library 
GROUP BY title, category, requirement_type
HAVING COUNT(*) > 1;

-- Step 2: Clean up requirement titles
UPDATE requirements_library 
SET title = TRIM(title)
WHERE title != TRIM(title);

-- Step 3: Standardize requirement categories
UPDATE requirements_library 
SET category = 'Technical'
WHERE category IN ('technical', 'TECHNICAL', 'Tech');

UPDATE requirements_library 
SET category = 'Compliance'
WHERE category IN ('compliance', 'COMPLIANCE', 'Compliant');

UPDATE requirements_library 
SET category = 'Business'
WHERE category IN ('business', 'BUSINESS', 'Biz');

UPDATE requirements_library 
SET category = 'Security'
WHERE category IN ('security', 'SECURITY', 'Sec');

-- Step 4: Ensure required fields
UPDATE requirements_library 
SET 
  priority = COALESCE(priority, 'medium'),
  status = COALESCE(status, 'draft'),
  requirement_type = COALESCE(requirement_type, 'Functional')
WHERE 
  priority IS NULL OR 
  status IS NULL OR 
  requirement_type IS NULL;

-- Step 5: Add performance indexes for requirements_library
CREATE INDEX IF NOT EXISTS idx_requirements_library_title ON requirements_library(title);
CREATE INDEX IF NOT EXISTS idx_requirements_library_category ON requirements_library(category);
CREATE INDEX IF NOT EXISTS idx_requirements_library_priority ON requirements_library(priority);
CREATE INDEX IF NOT EXISTS idx_requirements_library_status ON requirements_library(status);

-- =============================================================================
-- PHASE 4: TEST CASE LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate test cases
CREATE TEMP TABLE test_case_duplicates AS
SELECT 
  name,
  category,
  test_type,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM test_case_library 
GROUP BY name, category, test_type
HAVING COUNT(*) > 1;

-- Step 2: Clean up test case names
UPDATE test_case_library 
SET name = TRIM(name)
WHERE name != TRIM(name);

-- Step 3: Standardize test case categories
UPDATE test_case_library 
SET category = 'Functional'
WHERE category IN ('functional', 'FUNCTIONAL', 'Func');

UPDATE test_case_library 
SET category = 'Integration'
WHERE category IN ('integration', 'INTEGRATION', 'Integ');

UPDATE test_case_library 
SET category = 'Performance'
WHERE category IN ('performance', 'PERFORMANCE', 'Perf');

UPDATE test_case_library 
SET category = 'Security'
WHERE category IN ('security', 'SECURITY', 'Sec');

-- Step 4: Ensure required fields
UPDATE test_case_library 
SET 
  priority = COALESCE(priority, 'medium'),
  test_type = COALESCE(test_type, 'functional')
WHERE 
  priority IS NULL OR 
  test_type IS NULL;

-- Step 5: Add performance indexes for test_case_library
CREATE INDEX IF NOT EXISTS idx_test_case_library_name ON test_case_library(name);
CREATE INDEX IF NOT EXISTS idx_test_case_library_category ON test_case_library(category);
CREATE INDEX IF NOT EXISTS idx_test_case_library_priority ON test_case_library(priority);
CREATE INDEX IF NOT EXISTS idx_test_case_library_test_type ON test_case_library(test_type);

-- =============================================================================
-- PHASE 5: CONFIGURATION TEMPLATES OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate configuration templates
CREATE TEMP TABLE config_template_duplicates AS
SELECT 
  name,
  category,
  configuration_type,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM configuration_templates 
GROUP BY name, category, configuration_type
HAVING COUNT(*) > 1;

-- Step 2: Clean up template names
UPDATE configuration_templates 
SET name = TRIM(name)
WHERE name != TRIM(name);

-- Step 3: Standardize template categories
UPDATE configuration_templates 
SET category = '802.1x'
WHERE category IN ('802.1x', '8021x', '802.1X', 'dot1x');

UPDATE configuration_templates 
SET category = 'TACACS'
WHERE category IN ('TACACS', 'tacacs', 'Tacacs+', 'TACACS+');

UPDATE configuration_templates 
SET category = 'RADIUS'
WHERE category IN ('RADIUS', 'radius', 'Radius');

UPDATE configuration_templates 
SET category = 'Guest Access'
WHERE category IN ('Guest', 'guest', 'Guest Access', 'Guest Network');

-- Step 4: Ensure required fields
UPDATE configuration_templates 
SET 
  complexity_level = COALESCE(complexity_level, 'intermediate'),
  configuration_type = COALESCE(configuration_type, 'CLI'),
  is_public = COALESCE(is_public, true),
  is_validated = COALESCE(is_validated, false)
WHERE 
  complexity_level IS NULL OR 
  configuration_type IS NULL OR 
  is_public IS NULL OR 
  is_validated IS NULL;

-- Step 5: Add performance indexes for configuration_templates
CREATE INDEX IF NOT EXISTS idx_config_templates_name ON configuration_templates(name);
CREATE INDEX IF NOT EXISTS idx_config_templates_category ON configuration_templates(category);
CREATE INDEX IF NOT EXISTS idx_config_templates_complexity ON configuration_templates(complexity_level);
CREATE INDEX IF NOT EXISTS idx_config_templates_vendor ON configuration_templates(vendor_id);
CREATE INDEX IF NOT EXISTS idx_config_templates_is_public ON configuration_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_config_templates_is_validated ON configuration_templates(is_validated);

-- =============================================================================
-- PHASE 6: PAIN POINTS LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate pain points
CREATE TEMP TABLE pain_points_duplicates AS
SELECT 
  title,
  category,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM pain_points_library 
GROUP BY title, category
HAVING COUNT(*) > 1;

-- Step 2: Clean up pain point titles
UPDATE pain_points_library 
SET title = TRIM(title)
WHERE title != TRIM(title);

-- Step 3: Standardize pain point categories
UPDATE pain_points_library 
SET category = 'Security'
WHERE category IN ('security', 'SECURITY', 'Sec');

UPDATE pain_points_library 
SET category = 'Compliance'
WHERE category IN ('compliance', 'COMPLIANCE', 'Compliant');

UPDATE pain_points_library 
SET category = 'Operational'
WHERE category IN ('operational', 'OPERATIONAL', 'Ops');

UPDATE pain_points_library 
SET category = 'Technical'
WHERE category IN ('technical', 'TECHNICAL', 'Tech');

-- Step 4: Ensure required fields
UPDATE pain_points_library 
SET 
  severity = COALESCE(severity, 'medium'),
  status = COALESCE(status, 'active')
WHERE 
  severity IS NULL OR 
  status IS NULL;

-- Step 5: Add performance indexes for pain_points_library
CREATE INDEX IF NOT EXISTS idx_pain_points_library_title ON pain_points_library(title);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_category ON pain_points_library(category);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_severity ON pain_points_library(severity);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_status ON pain_points_library(status);

-- =============================================================================
-- PHASE 7: RECOMMENDATIONS LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate recommendations
CREATE TEMP TABLE recommendations_duplicates AS
SELECT 
  title,
  category,
  recommendation_type,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM recommendations_library 
GROUP BY title, category, recommendation_type
HAVING COUNT(*) > 1;

-- Step 2: Clean up recommendation titles
UPDATE recommendations_library 
SET title = TRIM(title)
WHERE title != TRIM(title);

-- Step 3: Standardize recommendation categories
UPDATE recommendations_library 
SET category = 'Security'
WHERE category IN ('security', 'SECURITY', 'Sec');

UPDATE recommendations_library 
SET category = 'Performance'
WHERE category IN ('performance', 'PERFORMANCE', 'Perf');

UPDATE recommendations_library 
SET category = 'Compliance'
WHERE category IN ('compliance', 'COMPLIANCE', 'Compliant');

UPDATE recommendations_library 
SET category = 'Best Practices'
WHERE category IN ('best_practices', 'Best Practices', 'best practices');

-- Step 4: Ensure required fields
UPDATE recommendations_library 
SET 
  priority = COALESCE(priority, 'medium'),
  status = COALESCE(status, 'active'),
  recommendation_type = COALESCE(recommendation_type, 'General')
WHERE 
  priority IS NULL OR 
  status IS NULL OR 
  recommendation_type IS NULL;

-- Step 5: Add performance indexes for recommendations_library
CREATE INDEX IF NOT EXISTS idx_recommendations_library_title ON recommendations_library(title);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_category ON recommendations_library(category);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_priority ON recommendations_library(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_status ON recommendations_library(status);

-- =============================================================================
-- PHASE 8: DEVICE TYPES LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate device types
CREATE TEMP TABLE device_types_duplicates AS
SELECT 
  name,
  category,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM device_types_library 
GROUP BY name, category
HAVING COUNT(*) > 1;

-- Step 2: Clean up device type names
UPDATE device_types_library 
SET name = TRIM(name)
WHERE name != TRIM(name);

-- Step 3: Standardize device type categories
UPDATE device_types_library 
SET category = 'Network'
WHERE category IN ('network', 'NETWORK', 'Net');

UPDATE device_types_library 
SET category = 'Security'
WHERE category IN ('security', 'SECURITY', 'Sec');

UPDATE device_types_library 
SET category = 'Wireless'
WHERE category IN ('wireless', 'WIRELESS', 'WiFi');

UPDATE device_types_library 
SET category = 'Endpoints'
WHERE category IN ('endpoints', 'ENDPOINTS', 'Endpoint');

-- Step 4: Ensure required fields
UPDATE device_types_library 
SET 
  risk_level = COALESCE(risk_level, 'medium'),
  management_complexity = COALESCE(management_complexity, 'medium'),
  status = COALESCE(status, 'active')
WHERE 
  risk_level IS NULL OR 
  management_complexity IS NULL OR 
  status IS NULL;

-- Step 5: Add performance indexes for device_types_library
CREATE INDEX IF NOT EXISTS idx_device_types_library_name ON device_types_library(name);
CREATE INDEX IF NOT EXISTS idx_device_types_library_category ON device_types_library(category);
CREATE INDEX IF NOT EXISTS idx_device_types_library_risk_level ON device_types_library(risk_level);
CREATE INDEX IF NOT EXISTS idx_device_types_library_status ON device_types_library(status);

-- =============================================================================
-- PHASE 9: DEPLOYMENT PHASES LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate deployment phases
CREATE TEMP TABLE deployment_phases_duplicates AS
SELECT 
  name,
  phase_type,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM deployment_phases_library 
GROUP BY name, phase_type
HAVING COUNT(*) > 1;

-- Step 2: Clean up phase names
UPDATE deployment_phases_library 
SET name = TRIM(name)
WHERE name != TRIM(name);

-- Step 3: Standardize phase types
UPDATE deployment_phases_library 
SET phase_type = 'Standard'
WHERE phase_type IN ('standard', 'STANDARD', 'std');

UPDATE deployment_phases_library 
SET phase_type = 'Custom'
WHERE phase_type IN ('custom', 'CUSTOM', 'Custom Phase');

UPDATE deployment_phases_library 
SET phase_type = 'Critical'
WHERE phase_type IN ('critical', 'CRITICAL', 'Critical Phase');

-- Step 4: Ensure required fields
UPDATE deployment_phases_library 
SET 
  complexity_level = COALESCE(complexity_level, 'medium'),
  is_mandatory = COALESCE(is_mandatory, true),
  is_active = COALESCE(is_active, true)
WHERE 
  complexity_level IS NULL OR 
  is_mandatory IS NULL OR 
  is_active IS NULL;

-- Step 5: Add performance indexes for deployment_phases_library
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_name ON deployment_phases_library(name);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_phase_type ON deployment_phases_library(phase_type);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_complexity ON deployment_phases_library(complexity_level);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_is_active ON deployment_phases_library(is_active);

-- =============================================================================
-- PHASE 10: SYSTEM INTEGRATIONS LIBRARY OPTIMIZATION
-- =============================================================================

-- Step 1: Identify duplicate system integrations
CREATE TEMP TABLE system_integrations_duplicates AS
SELECT 
  name,
  integration_type,
  COUNT(*) as duplicate_count,
  array_agg(id) as duplicate_ids
FROM system_integrations_library 
GROUP BY name, integration_type
HAVING COUNT(*) > 1;

-- Step 2: Clean up integration names
UPDATE system_integrations_library 
SET name = TRIM(name)
WHERE name != TRIM(name);

-- Step 3: Standardize integration types
UPDATE system_integrations_library 
SET integration_type = 'API'
WHERE integration_type IN ('api', 'API', 'REST API');

UPDATE system_integrations_library 
SET integration_type = 'Database'
WHERE integration_type IN ('database', 'DATABASE', 'DB');

UPDATE system_integrations_library 
SET integration_type = 'File'
WHERE integration_type IN ('file', 'FILE', 'File Transfer');

UPDATE system_integrations_library 
SET integration_type = 'Protocol'
WHERE integration_type IN ('protocol', 'PROTOCOL', 'Network Protocol');

-- Step 4: Ensure required fields
UPDATE system_integrations_library 
SET 
  complexity_level = COALESCE(complexity_level, 'medium'),
  status = COALESCE(status, 'active')
WHERE 
  complexity_level IS NULL OR 
  status IS NULL;

-- Step 5: Add performance indexes for system_integrations_library
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_name ON system_integrations_library(name);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_type ON system_integrations_library(integration_type);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_complexity ON system_integrations_library(complexity_level);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_status ON system_integrations_library(status);

-- =============================================================================
-- PHASE 11: TEMPLATE RECOMMENDATIONS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up template recommendations
UPDATE template_recommendations 
SET 
  recommendation_type = COALESCE(recommendation_type, 'ai_powered'),
  confidence_score = COALESCE(confidence_score, 0.8),
  is_active = COALESCE(is_active, true)
WHERE 
  recommendation_type IS NULL OR 
  confidence_score IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for template_recommendations
CREATE INDEX IF NOT EXISTS idx_template_recommendations_user ON template_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_template_recommendations_project ON template_recommendations(project_id);
CREATE INDEX IF NOT EXISTS idx_template_recommendations_type ON template_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_template_recommendations_confidence ON template_recommendations(confidence_score);
CREATE INDEX IF NOT EXISTS idx_template_recommendations_is_active ON template_recommendations(is_active);
CREATE INDEX IF NOT EXISTS idx_template_recommendations_created_at ON template_recommendations(created_at);

-- =============================================================================
-- PHASE 12: TEMPLATE PERFORMANCE ANALYTICS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up template performance analytics
UPDATE template_performance_analytics 
SET 
  success_rate = COALESCE(success_rate, 0.0),
  deployment_time_avg = COALESCE(deployment_time_avg, 0),
  security_score = COALESCE(security_score, 0.0)
WHERE 
  success_rate IS NULL OR 
  deployment_time_avg IS NULL OR 
  security_score IS NULL;

-- Step 2: Add performance indexes for template_performance_analytics
CREATE INDEX IF NOT EXISTS idx_template_performance_template ON template_performance_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_template_performance_success_rate ON template_performance_analytics(success_rate);
CREATE INDEX IF NOT EXISTS idx_template_performance_security_score ON template_performance_analytics(security_score);
CREATE INDEX IF NOT EXISTS idx_template_performance_last_analyzed ON template_performance_analytics(last_analyzed);

-- =============================================================================
-- PHASE 13: ENHANCED SCOPING SESSIONS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up enhanced scoping sessions
UPDATE enhanced_scoping_sessions 
SET 
  session_type = COALESCE(session_type, 'comprehensive'),
  status = COALESCE(status, 'active'),
  complexity_level = COALESCE(complexity_level, 'medium')
WHERE 
  session_type IS NULL OR 
  status IS NULL OR 
  complexity_level IS NULL;

-- Step 2: Add performance indexes for enhanced_scoping_sessions
CREATE INDEX IF NOT EXISTS idx_enhanced_scoping_user ON enhanced_scoping_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_scoping_project ON enhanced_scoping_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_scoping_type ON enhanced_scoping_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_scoping_status ON enhanced_scoping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_enhanced_scoping_complexity ON enhanced_scoping_sessions(complexity_level);

-- =============================================================================
-- PHASE 14: CONFIGURATION FILES OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up configuration files
UPDATE configuration_files 
SET 
  file_type = COALESCE(file_type, 'config'),
  content_type = COALESCE(content_type, 'text/plain'),
  is_encrypted = COALESCE(is_encrypted, false)
WHERE 
  file_type IS NULL OR 
  content_type IS NULL OR 
  is_encrypted IS NULL;

-- Step 2: Add performance indexes for configuration_files
CREATE INDEX IF NOT EXISTS idx_configuration_files_name ON configuration_files(name);
CREATE INDEX IF NOT EXISTS idx_configuration_files_vendor ON configuration_files(vendor_id);
CREATE INDEX IF NOT EXISTS idx_configuration_files_template ON configuration_files(template_id);
CREATE INDEX IF NOT EXISTS idx_configuration_files_type ON configuration_files(file_type);
CREATE INDEX IF NOT EXISTS idx_configuration_files_created_at ON configuration_files(created_at);

-- =============================================================================
-- PHASE 15: VENDOR MODELS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up vendor models
UPDATE vendor_models 
SET 
  model_series = COALESCE(model_series, 'Standard'),
  automation_possible = COALESCE(automation_possible, false)
WHERE 
  model_series IS NULL OR 
  automation_possible IS NULL;

-- Step 2: Add performance indexes for vendor_models
CREATE INDEX IF NOT EXISTS idx_vendor_models_vendor ON vendor_models(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_models_name ON vendor_models(model_name);
CREATE INDEX IF NOT EXISTS idx_vendor_models_series ON vendor_models(model_series);
CREATE INDEX IF NOT EXISTS idx_vendor_models_created_at ON vendor_models(created_at);

-- =============================================================================
-- PHASE 16: TEMPLATE CUSTOMIZATIONS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up template customizations
UPDATE template_customizations 
SET 
  customization_type = COALESCE(customization_type, 'modification'),
  version = COALESCE(version, 1),
  is_active = COALESCE(is_active, true)
WHERE 
  customization_type IS NULL OR 
  version IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for template_customizations
CREATE INDEX IF NOT EXISTS idx_template_customizations_base ON template_customizations(base_template_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_project ON template_customizations(project_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_site ON template_customizations(site_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_type ON template_customizations(customization_type);
CREATE INDEX IF NOT EXISTS idx_template_customizations_is_active ON template_customizations(is_active);

-- =============================================================================
-- PHASE 17: PROJECT KNOWLEDGE BASE OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up project knowledge base
UPDATE project_knowledge_base 
SET 
  content_type = COALESCE(content_type, 'note'),
  category = COALESCE(category, 'general'),
  priority_level = COALESCE(priority_level, 'medium'),
  is_ai_enhanced = COALESCE(is_ai_enhanced, false)
WHERE 
  content_type IS NULL OR 
  category IS NULL OR 
  priority_level IS NULL OR 
  is_ai_enhanced IS NULL;

-- Step 2: Add performance indexes for project_knowledge_base
CREATE INDEX IF NOT EXISTS idx_project_knowledge_project ON project_knowledge_base(project_id);
CREATE INDEX IF NOT EXISTS idx_project_knowledge_site ON project_knowledge_base(site_id);
CREATE INDEX IF NOT EXISTS idx_project_knowledge_category ON project_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_project_knowledge_priority ON project_knowledge_base(priority_level);
CREATE INDEX IF NOT EXISTS idx_project_knowledge_ai_enhanced ON project_knowledge_base(is_ai_enhanced);

-- =============================================================================
-- PHASE 18: UPLOADED FILES OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up uploaded files
UPDATE uploaded_files 
SET 
  file_type = COALESCE(file_type, 'document'),
  status = COALESCE(status, 'active'),
  is_processed = COALESCE(is_processed, false)
WHERE 
  file_type IS NULL OR 
  status IS NULL OR 
  is_processed IS NULL;

-- Step 2: Add performance indexes for uploaded_files
CREATE INDEX IF NOT EXISTS idx_uploaded_files_project ON uploaded_files(project_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_site ON uploaded_files(site_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_type ON uploaded_files(file_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_status ON uploaded_files(status);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_processed ON uploaded_files(is_processed);

-- =============================================================================
-- PHASE 19: CONFIG TEMPLATE CATEGORIES OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up config template categories
UPDATE config_template_categories 
SET 
  category_type = COALESCE(category_type, 'functional'),
  display_order = COALESCE(display_order, 0),
  ai_priority_weight = COALESCE(ai_priority_weight, 1.0)
WHERE 
  category_type IS NULL OR 
  display_order IS NULL OR 
  ai_priority_weight IS NULL;

-- Step 2: Add performance indexes for config_template_categories
CREATE INDEX IF NOT EXISTS idx_config_template_categories_name ON config_template_categories(name);
CREATE INDEX IF NOT EXISTS idx_config_template_categories_type ON config_template_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_config_template_categories_parent ON config_template_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_config_template_categories_order ON config_template_categories(display_order);

-- =============================================================================
-- PHASE 20: CONFIG WIZARD STEPS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up config wizard steps
UPDATE config_wizard_steps 
SET 
  step_type = COALESCE(step_type, 'input'),
  is_required = COALESCE(is_required, true),
  is_active = COALESCE(is_active, true)
WHERE 
  step_type IS NULL OR 
  is_required IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for config_wizard_steps
CREATE INDEX IF NOT EXISTS idx_config_wizard_steps_template ON config_wizard_steps(template_id);
CREATE INDEX IF NOT EXISTS idx_config_wizard_steps_order ON config_wizard_steps(step_order);
CREATE INDEX IF NOT EXISTS idx_config_wizard_steps_type ON config_wizard_steps(step_type);
CREATE INDEX IF NOT EXISTS idx_config_wizard_steps_required ON config_wizard_steps(is_required);
CREATE INDEX IF NOT EXISTS idx_config_wizard_steps_active ON config_wizard_steps(is_active);

-- =============================================================================
-- PHASE 21: NETWORK AUTHENTICATION SCENARIOS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up network authentication scenarios
UPDATE network_authentication_scenarios 
SET 
  scenario_type = COALESCE(scenario_type, 'standard'),
  complexity_level = COALESCE(complexity_level, 'medium'),
  is_validated = COALESCE(is_validated, false)
WHERE 
  scenario_type IS NULL OR 
  complexity_level IS NULL OR 
  is_validated IS NULL;

-- Step 2: Add performance indexes for network_authentication_scenarios
CREATE INDEX IF NOT EXISTS idx_network_auth_scenarios_name ON network_authentication_scenarios(name);
CREATE INDEX IF NOT EXISTS idx_network_auth_scenarios_type ON network_authentication_scenarios(scenario_type);
CREATE INDEX IF NOT EXISTS idx_network_auth_scenarios_complexity ON network_authentication_scenarios(complexity_level);
CREATE INDEX IF NOT EXISTS idx_network_auth_scenarios_validated ON network_authentication_scenarios(is_validated);

-- =============================================================================
-- PHASE 22: RESOURCE TAGS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up resource tags
UPDATE resource_tags 
SET 
  tag_type = COALESCE(tag_type, 'general'),
  is_active = COALESCE(is_active, true)
WHERE 
  tag_type IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for resource_tags
CREATE INDEX IF NOT EXISTS idx_resource_tags_name ON resource_tags(name);
CREATE INDEX IF NOT EXISTS idx_resource_tags_type ON resource_tags(tag_type);
CREATE INDEX IF NOT EXISTS idx_resource_tags_active ON resource_tags(is_active);
CREATE INDEX IF NOT EXISTS idx_resource_tags_created_at ON resource_tags(created_at);

-- =============================================================================
-- PHASE 23: INDUSTRY OPTIONS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up industry options
UPDATE industry_options 
SET 
  category = COALESCE(category, 'general'),
  is_active = COALESCE(is_active, true)
WHERE 
  category IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for industry_options
CREATE INDEX IF NOT EXISTS idx_industry_options_name ON industry_options(name);
CREATE INDEX IF NOT EXISTS idx_industry_options_category ON industry_options(category);
CREATE INDEX IF NOT EXISTS idx_industry_options_active ON industry_options(is_active);

-- =============================================================================
-- PHASE 24: COMPLIANCE FRAMEWORKS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up compliance frameworks
UPDATE compliance_frameworks 
SET 
  is_active = COALESCE(is_active, true)
WHERE 
  is_active IS NULL;

-- Step 2: Add performance indexes for compliance_frameworks
CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_name ON compliance_frameworks(name);
CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_active ON compliance_frameworks(is_active);

-- =============================================================================
-- PHASE 25: DEPLOYMENT TYPES OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up deployment types
UPDATE deployment_types 
SET 
  complexity_level = COALESCE(complexity_level, 'medium'),
  is_active = COALESCE(is_active, true)
WHERE 
  complexity_level IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for deployment_types
CREATE INDEX IF NOT EXISTS idx_deployment_types_name ON deployment_types(name);
CREATE INDEX IF NOT EXISTS idx_deployment_types_complexity ON deployment_types(complexity_level);
CREATE INDEX IF NOT EXISTS idx_deployment_types_active ON deployment_types(is_active);

-- =============================================================================
-- PHASE 26: SECURITY LEVELS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up security levels
UPDATE security_levels 
SET 
  is_active = COALESCE(is_active, true)
WHERE 
  is_active IS NULL;

-- Step 2: Add performance indexes for security_levels
CREATE INDEX IF NOT EXISTS idx_security_levels_name ON security_levels(name);
CREATE INDEX IF NOT EXISTS idx_security_levels_active ON security_levels(is_active);

-- =============================================================================
-- PHASE 27: BUSINESS DOMAINS OPTIMIZATION
-- =============================================================================

-- Step 1: Clean up business domains
UPDATE business_domains 
SET 
  domain_type = COALESCE(domain_type, 'general'),
  is_active = COALESCE(is_active, true)
WHERE 
  domain_type IS NULL OR 
  is_active IS NULL;

-- Step 2: Add performance indexes for business_domains
CREATE INDEX IF NOT EXISTS idx_business_domains_name ON business_domains(name);
CREATE INDEX IF NOT EXISTS idx_business_domains_type ON business_domains(domain_type);
CREATE INDEX IF NOT EXISTS idx_business_domains_active ON business_domains(is_active);

-- =============================================================================
-- PHASE 28: UNIQUE CONSTRAINTS AND DATA INTEGRITY
-- =============================================================================

-- Add unique constraints to prevent future duplicates
ALTER TABLE vendor_library ADD CONSTRAINT IF NOT EXISTS unique_vendor_name UNIQUE (vendor_name);
ALTER TABLE use_case_library ADD CONSTRAINT IF NOT EXISTS unique_use_case_name_category UNIQUE (name, category);
ALTER TABLE requirements_library ADD CONSTRAINT IF NOT EXISTS unique_requirement_title_category_type UNIQUE (title, category, requirement_type);
ALTER TABLE test_case_library ADD CONSTRAINT IF NOT EXISTS unique_test_case_name_category_type UNIQUE (name, category, test_type);
ALTER TABLE configuration_templates ADD CONSTRAINT IF NOT EXISTS unique_template_name_category_type UNIQUE (name, category, configuration_type);
ALTER TABLE pain_points_library ADD CONSTRAINT IF NOT EXISTS unique_pain_point_title_category UNIQUE (title, category);
ALTER TABLE recommendations_library ADD CONSTRAINT IF NOT EXISTS unique_recommendation_title_category_type UNIQUE (title, category, recommendation_type);
ALTER TABLE device_types_library ADD CONSTRAINT IF NOT EXISTS unique_device_type_name_category UNIQUE (name, category);
ALTER TABLE deployment_phases_library ADD CONSTRAINT IF NOT EXISTS unique_deployment_phase_name_type UNIQUE (name, phase_type);
ALTER TABLE system_integrations_library ADD CONSTRAINT IF NOT EXISTS unique_integration_name_type UNIQUE (name, integration_type);

-- =============================================================================
-- PHASE 29: FINAL OPTIMIZATION AND CLEANUP
-- =============================================================================

-- Update statistics for all optimized tables
ANALYZE vendor_library;
ANALYZE use_case_library;
ANALYZE requirements_library;
ANALYZE test_case_library;
ANALYZE configuration_templates;
ANALYZE pain_points_library;
ANALYZE recommendations_library;
ANALYZE device_types_library;
ANALYZE deployment_phases_library;
ANALYZE system_integrations_library;
ANALYZE template_recommendations;
ANALYZE template_performance_analytics;
ANALYZE enhanced_scoping_sessions;
ANALYZE configuration_files;
ANALYZE vendor_models;
ANALYZE template_customizations;
ANALYZE project_knowledge_base;
ANALYZE uploaded_files;
ANALYZE config_template_categories;
ANALYZE config_wizard_steps;
ANALYZE network_authentication_scenarios;
ANALYZE resource_tags;
ANALYZE industry_options;
ANALYZE compliance_frameworks;
ANALYZE deployment_types;
ANALYZE security_levels;
ANALYZE business_domains;

-- Clean up temporary tables
DROP TABLE IF EXISTS vendor_duplicates;
DROP TABLE IF EXISTS use_case_duplicates;
DROP TABLE IF EXISTS requirements_duplicates;
DROP TABLE IF EXISTS test_case_duplicates;
DROP TABLE IF EXISTS config_template_duplicates;
DROP TABLE IF EXISTS pain_points_duplicates;
DROP TABLE IF EXISTS recommendations_duplicates;
DROP TABLE IF EXISTS device_types_duplicates;
DROP TABLE IF EXISTS deployment_phases_duplicates;
DROP TABLE IF EXISTS system_integrations_duplicates;

-- =============================================================================
-- PHASE 30: COMPREHENSIVE OPTIMIZATION REPORT
-- =============================================================================

-- Generate comprehensive optimization report
SELECT 
  'COMPREHENSIVE_LIBRARY_OPTIMIZATION_COMPLETED' as status,
  now() as optimization_timestamp,
  (SELECT COUNT(*) FROM vendor_library) as total_vendors,
  (SELECT COUNT(*) FROM use_case_library) as total_use_cases,
  (SELECT COUNT(*) FROM requirements_library) as total_requirements,
  (SELECT COUNT(*) FROM test_case_library) as total_test_cases,
  (SELECT COUNT(*) FROM configuration_templates) as total_templates,
  (SELECT COUNT(*) FROM pain_points_library) as total_pain_points,
  (SELECT COUNT(*) FROM recommendations_library) as total_recommendations,
  (SELECT COUNT(*) FROM device_types_library) as total_device_types,
  (SELECT COUNT(*) FROM deployment_phases_library) as total_deployment_phases,
  (SELECT COUNT(*) FROM system_integrations_library) as total_integrations,
  (SELECT COUNT(*) FROM template_recommendations) as total_template_recommendations,
  (SELECT COUNT(*) FROM template_performance_analytics) as total_performance_analytics,
  (SELECT COUNT(*) FROM enhanced_scoping_sessions) as total_scoping_sessions,
  (SELECT COUNT(*) FROM configuration_files) as total_config_files,
  (SELECT COUNT(*) FROM vendor_models) as total_vendor_models,
  (SELECT COUNT(*) FROM template_customizations) as total_template_customizations,
  (SELECT COUNT(*) FROM project_knowledge_base) as total_knowledge_base,
  (SELECT COUNT(*) FROM uploaded_files) as total_uploaded_files,
  (SELECT COUNT(*) FROM config_template_categories) as total_template_categories,
  (SELECT COUNT(*) FROM config_wizard_steps) as total_wizard_steps,
  (SELECT COUNT(*) FROM network_authentication_scenarios) as total_auth_scenarios,
  (SELECT COUNT(*) FROM resource_tags) as total_resource_tags,
  (SELECT COUNT(*) FROM industry_options) as total_industry_options,
  (SELECT COUNT(*) FROM compliance_frameworks) as total_compliance_frameworks,
  (SELECT COUNT(*) FROM deployment_types) as total_deployment_types,
  (SELECT COUNT(*) FROM security_levels) as total_security_levels,
  (SELECT COUNT(*) FROM business_domains) as total_business_domains;

-- Show optimization summary by category
SELECT 
  'VENDOR_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT vendor_name) as unique_vendors,
  COUNT(DISTINCT category) as categories
FROM vendor_library
UNION ALL
SELECT 
  'USE_CASE_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_use_cases,
  COUNT(DISTINCT category) as categories
FROM use_case_library
UNION ALL
SELECT 
  'REQUIREMENTS_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT title) as unique_requirements,
  COUNT(DISTINCT category) as categories
FROM requirements_library
UNION ALL
SELECT 
  'TEST_CASE_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_test_cases,
  COUNT(DISTINCT category) as categories
FROM test_case_library
UNION ALL
SELECT 
  'CONFIGURATION_TEMPLATES' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_templates,
  COUNT(DISTINCT category) as categories
FROM configuration_templates
UNION ALL
SELECT 
  'PAIN_POINTS_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT title) as unique_pain_points,
  COUNT(DISTINCT category) as categories
FROM pain_points_library
UNION ALL
SELECT 
  'RECOMMENDATIONS_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT title) as unique_recommendations,
  COUNT(DISTINCT category) as categories
FROM recommendations_library
ORDER BY library_name;
