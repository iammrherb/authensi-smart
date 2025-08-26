-- =============================================================================
-- WEB CRAWLING & BUSINESS INTELLIGENCE SYSTEM
-- =============================================================================
-- This migration creates the database schema for comprehensive web crawling,
-- business intelligence, and advanced configuration management system.

-- =============================================================================
-- PHASE 1: WEB CRAWLING INFRASTRUCTURE
-- =============================================================================

-- Crawl targets for monitoring websites and documentation
CREATE TABLE IF NOT EXISTS crawl_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Target Details
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vendor_docs', 'kb_article', 'blog_post', 'security_advisory', 'release_notes', 'best_practices')),
  vendor TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Crawling Configuration
  crawl_frequency TEXT NOT NULL CHECK (crawl_frequency IN ('daily', 'weekly', 'monthly', 'on_demand')),
  selectors JSONB DEFAULT '[]',
  
  -- Status and Metadata
  metadata JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(url, type)
);

-- Crawled content storage
CREATE TABLE IF NOT EXISTS crawled_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID REFERENCES crawl_targets(id) ON DELETE CASCADE,
  
  -- Content Details
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  extracted_data JSONB DEFAULT '{}',
  content_type TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  
  -- Intelligence Extraction
  key_topics TEXT[] DEFAULT '{}',
  vendor_mentions TEXT[] DEFAULT '{}',
  product_mentions TEXT[] DEFAULT '{}',
  configuration_snippets JSONB DEFAULT '[]',
  vulnerabilities JSONB DEFAULT '[]',
  best_practices JSONB DEFAULT '[]',
  
  -- Quality Metrics
  quality_score DECIMAL(3,2) DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1),
  relevance_score DECIMAL(3,2) DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  freshness_score DECIMAL(3,2) DEFAULT 0.5 CHECK (freshness_score >= 0 AND freshness_score <= 1),
  
  -- Associations
  related_vendors TEXT[] DEFAULT '{}',
  related_use_cases TEXT[] DEFAULT '{}',
  related_requirements TEXT[] DEFAULT '{}',
  
  -- Metadata
  content_hash TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  source_type TEXT CHECK (source_type IN ('official', 'community', 'blog', 'forum', 'documentation')),
  crawled_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- External links and references
CREATE TABLE IF NOT EXISTS external_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link Details
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  link_type TEXT CHECK (link_type IN ('documentation', 'troubleshooting', 'best_practices', 'kb_article', 'video', 'whitepaper')),
  
  -- Associations
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vendor', 'use_case', 'requirement', 'configuration', 'vulnerability')),
  entity_id TEXT NOT NULL,
  
  -- Quality and Relevance
  relevance_score DECIMAL(3,2) DEFAULT 0.5,
  quality_score DECIMAL(3,2) DEFAULT 0.5,
  last_verified TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  added_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(url, entity_type, entity_id)
);

-- =============================================================================
-- PHASE 2: ADVANCED CONFIGURATION INTELLIGENCE
-- =============================================================================

-- Wireless configuration templates and best practices
CREATE TABLE IF NOT EXISTS wireless_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Configuration Identity
  vendor TEXT NOT NULL,
  product TEXT NOT NULL,
  model TEXT,
  firmware_version TEXT,
  
  -- Wireless Standards and Security
  wireless_standard TEXT CHECK (wireless_standard IN ('802.11ac', '802.11ax', '802.11be')),
  auth_method TEXT CHECK (auth_method IN ('WPA2-Enterprise', 'WPA3-Enterprise', '802.1X', 'EAP-TLS', 'PEAP', 'EAP-TTLS')),
  encryption_type TEXT CHECK (encryption_type IN ('CCMP', 'GCMP', 'GCMP-256')),
  key_management TEXT CHECK (key_management IN ('WPA2', 'WPA3', 'OWE', 'SAE')),
  
  -- RADIUS Configuration
  radius_config JSONB DEFAULT '{}',
  
  -- Advanced Wireless Settings
  advanced_settings JSONB DEFAULT '{}',
  
  -- Configuration Template
  config_template TEXT NOT NULL,
  cli_commands JSONB DEFAULT '[]',
  gui_steps JSONB DEFAULT '[]',
  
  -- Use Case and Security
  use_case TEXT NOT NULL,
  security_level TEXT NOT NULL CHECK (security_level IN ('basic', 'standard', 'advanced', 'enterprise')),
  
  -- Best Practices and Warnings
  best_practices JSONB DEFAULT '[]',
  warnings JSONB DEFAULT '[]',
  common_issues JSONB DEFAULT '[]',
  
  -- Quality and Validation
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'deprecated')),
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  source_url TEXT,
  last_tested TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Security alerts and vulnerability monitoring
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Alert Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  alert_type TEXT CHECK (alert_type IN ('vulnerability', 'eol_notice', 'security_update', 'patch_available', 'configuration_issue')),
  
  -- Affected Products
  affected_vendors TEXT[] NOT NULL,
  affected_products TEXT[] NOT NULL,
  affected_versions JSONB DEFAULT '[]',
  
  -- Vulnerability Information
  cve_id TEXT,
  cvss_score DECIMAL(3,1),
  cvss_vector TEXT,
  vendor_advisory_id TEXT,
  
  -- Resolution Information
  patch_available BOOLEAN DEFAULT false,
  patch_details JSONB DEFAULT '{}',
  workaround TEXT,
  mitigation_steps JSONB DEFAULT '[]',
  
  -- Timeline
  discovered_at TIMESTAMP,
  published_at TIMESTAMP,
  patch_release_date TIMESTAMP,
  eol_date TIMESTAMP,
  
  -- Source and References
  source_url TEXT,
  references JSONB DEFAULT '[]',
  source_type TEXT DEFAULT 'external',
  
  -- Status and Processing
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive', 'archived')),
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  impact_assessment JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PHASE 3: BUSINESS INTELLIGENCE SYSTEM
-- =============================================================================

-- Business profiles and market intelligence
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company Details
  company_name TEXT NOT NULL,
  domain TEXT,
  industry TEXT NOT NULL,
  sub_industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  
  -- Financial Information
  market_cap BIGINT,
  annual_revenue BIGINT,
  employee_count INTEGER,
  
  -- Business Intelligence
  recent_news JSONB DEFAULT '[]',
  acquisitions JSONB DEFAULT '[]',
  partnerships JSONB DEFAULT '[]',
  job_openings JSONB DEFAULT '[]',
  
  -- Financial Reports
  quarterly_reports JSONB DEFAULT '[]',
  strategic_initiatives JSONB DEFAULT '[]',
  
  -- Cybersecurity Profile
  cybersecurity_maturity TEXT CHECK (cybersecurity_maturity IN ('basic', 'developing', 'defined', 'managed', 'optimized')),
  recent_incidents JSONB DEFAULT '[]',
  insurance_coverage JSONB DEFAULT '{}',
  compliance_status JSONB DEFAULT '[]',
  security_frameworks TEXT[] DEFAULT '{}',
  
  -- Compliance Requirements
  compliance_requirements JSONB DEFAULT '[]',
  regulatory_environment JSONB DEFAULT '{}',
  
  -- Market Analysis
  competitors JSONB DEFAULT '[]',
  market_trends JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  
  -- NAC Readiness Assessment
  nac_readiness_score DECIMAL(3,2) DEFAULT 0.5,
  current_nac_solution TEXT,
  key_drivers JSONB DEFAULT '[]',
  implementation_challenges JSONB DEFAULT '[]',
  
  -- Budget and Timeline
  budget_profile JSONB DEFAULT '{}',
  timeline_profile JSONB DEFAULT '{}',
  
  -- Stakeholders
  stakeholders JSONB DEFAULT '[]',
  decision_makers JSONB DEFAULT '[]',
  
  -- Technical Requirements
  technical_requirements JSONB DEFAULT '[]',
  preferred_vendors JSONB DEFAULT '[]',
  
  -- Intelligence Metadata
  profile_completeness DECIMAL(3,2) DEFAULT 0.3,
  last_intelligence_update TIMESTAMP DEFAULT NOW(),
  intelligence_sources JSONB DEFAULT '[]',
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(company_name, domain)
);

-- News and market intelligence
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content Details
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT,
  
  -- Classification
  intelligence_type TEXT NOT NULL CHECK (intelligence_type IN ('news', 'financial_report', 'acquisition', 'partnership', 'job_posting', 'regulatory_update')),
  industry TEXT,
  companies_mentioned TEXT[] DEFAULT '{}',
  
  -- Relevance and Analysis
  nac_relevance_score DECIMAL(3,2) DEFAULT 0.5,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  business_impact TEXT CHECK (business_impact IN ('low', 'medium', 'high', 'critical')),
  
  -- Timeline
  published_at TIMESTAMP,
  discovered_at TIMESTAMP DEFAULT NOW(),
  
  -- Source Information
  source TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('news', 'social', 'financial', 'regulatory', 'jobs', 'blog')),
  source_credibility DECIMAL(3,2) DEFAULT 0.5,
  
  -- Processing Status
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'analyzed', 'archived')),
  ai_analysis JSONB DEFAULT '{}',
  
  -- Associations
  related_profiles UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job market intelligence for NAC specialists
CREATE TABLE IF NOT EXISTS job_market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Job Details
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  department TEXT,
  location TEXT,
  salary_range TEXT,
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'consulting')),
  
  -- NAC Relevance
  nac_relevance_score DECIMAL(3,2) DEFAULT 0.5,
  vendor_specific TEXT, -- Cisco ISE, ClearPass, FortiNAC, etc.
  required_skills TEXT[] DEFAULT '{}',
  preferred_certifications TEXT[] DEFAULT '{}',
  
  -- Job Requirements
  experience_level TEXT CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'expert')),
  education_requirements TEXT[] DEFAULT '{}',
  technical_requirements TEXT[] DEFAULT '{}',
  
  -- Market Analysis
  demand_indicator DECIMAL(3,2) DEFAULT 0.5,
  salary_competitiveness DECIMAL(3,2) DEFAULT 0.5,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent')),
  
  -- Source Information
  source_url TEXT,
  job_board TEXT,
  posted_at TIMESTAMP,
  discovered_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  -- Company Intelligence
  company_profile_id UUID REFERENCES business_profiles(id),
  company_size_estimate TEXT,
  industry_segment TEXT,
  
  -- Processing
  processing_status TEXT DEFAULT 'pending',
  ai_analysis JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PHASE 4: CONTENT SEARCH AND ANALYTICS
-- =============================================================================

-- Search analytics and query tracking
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Query Details
  query_text TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  
  -- Search Context
  search_type TEXT CHECK (search_type IN ('content', 'vendor', 'configuration', 'vulnerability', 'business')),
  filters_applied JSONB DEFAULT '{}',
  
  -- Results
  results_count INTEGER DEFAULT 0,
  top_result_relevance DECIMAL(3,2),
  clicked_results INTEGER[] DEFAULT '{}',
  
  -- Performance
  response_time INTEGER, -- milliseconds
  search_quality_score DECIMAL(3,2) DEFAULT 0.5,
  
  -- User Behavior
  time_spent_on_results INTEGER, -- seconds
  follow_up_queries TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content recommendations and suggestions
CREATE TABLE IF NOT EXISTS content_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recommendation Context
  user_id UUID REFERENCES auth.users(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  
  -- Recommended Content
  recommended_content_id UUID REFERENCES crawled_content(id),
  recommendation_type TEXT CHECK (recommendation_type IN ('related', 'trending', 'personalized', 'similar', 'complementary')),
  
  -- Recommendation Quality
  relevance_score DECIMAL(3,2) NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  reasoning TEXT,
  
  -- User Interaction
  viewed BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  rated INTEGER CHECK (rated >= 1 AND rated <= 5),
  feedback TEXT,
  
  -- Metadata
  recommendation_source TEXT DEFAULT 'ai',
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PHASE 5: PERFORMANCE INDEXES
-- =============================================================================

-- Indexes for crawl_targets
CREATE INDEX IF NOT EXISTS idx_crawl_targets_type ON crawl_targets(type);
CREATE INDEX IF NOT EXISTS idx_crawl_targets_vendor ON crawl_targets(vendor);
CREATE INDEX IF NOT EXISTS idx_crawl_targets_priority ON crawl_targets(priority);
CREATE INDEX IF NOT EXISTS idx_crawl_targets_active ON crawl_targets(is_active);

-- Indexes for crawled_content
CREATE INDEX IF NOT EXISTS idx_crawled_content_target_id ON crawled_content(target_id);
CREATE INDEX IF NOT EXISTS idx_crawled_content_content_type ON crawled_content(content_type);
CREATE INDEX IF NOT EXISTS idx_crawled_content_quality_score ON crawled_content(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_crawled_content_crawled_at ON crawled_content(crawled_at DESC);
CREATE INDEX IF NOT EXISTS idx_crawled_content_vendor_mentions ON crawled_content USING GIN(vendor_mentions);
CREATE INDEX IF NOT EXISTS idx_crawled_content_key_topics ON crawled_content USING GIN(key_topics);
CREATE INDEX IF NOT EXISTS idx_crawled_content_content_hash ON crawled_content(content_hash);

-- Full-text search index for content
CREATE INDEX IF NOT EXISTS idx_crawled_content_search ON crawled_content USING GIN(to_tsvector('english', title || ' ' || content));

-- Indexes for external_links
CREATE INDEX IF NOT EXISTS idx_external_links_entity ON external_links(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_external_links_type ON external_links(link_type);
CREATE INDEX IF NOT EXISTS idx_external_links_active ON external_links(is_active);
CREATE INDEX IF NOT EXISTS idx_external_links_relevance ON external_links(relevance_score DESC);

-- Indexes for wireless_configurations
CREATE INDEX IF NOT EXISTS idx_wireless_configurations_vendor ON wireless_configurations(vendor);
CREATE INDEX IF NOT EXISTS idx_wireless_configurations_security_level ON wireless_configurations(security_level);
CREATE INDEX IF NOT EXISTS idx_wireless_configurations_use_case ON wireless_configurations(use_case);
CREATE INDEX IF NOT EXISTS idx_wireless_configurations_success_rate ON wireless_configurations(success_rate DESC);

-- Indexes for security_alerts
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_published_at ON security_alerts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_vendors ON security_alerts USING GIN(affected_vendors);
CREATE INDEX IF NOT EXISTS idx_security_alerts_cve_id ON security_alerts(cve_id);

-- Indexes for business_profiles
CREATE INDEX IF NOT EXISTS idx_business_profiles_company_name ON business_profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_business_profiles_industry ON business_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_business_profiles_nac_readiness ON business_profiles(nac_readiness_score DESC);
CREATE INDEX IF NOT EXISTS idx_business_profiles_completeness ON business_profiles(profile_completeness DESC);

-- Indexes for market_intelligence
CREATE INDEX IF NOT EXISTS idx_market_intelligence_type ON market_intelligence(intelligence_type);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_companies ON market_intelligence USING GIN(companies_mentioned);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_published_at ON market_intelligence(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_relevance ON market_intelligence(nac_relevance_score DESC);

-- Indexes for job_market_intelligence
CREATE INDEX IF NOT EXISTS idx_job_market_intelligence_nac_relevance ON job_market_intelligence(nac_relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_job_market_intelligence_vendor ON job_market_intelligence(vendor_specific);
CREATE INDEX IF NOT EXISTS idx_job_market_intelligence_posted_at ON job_market_intelligence(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_market_intelligence_company ON job_market_intelligence(company_name);

-- Indexes for search_analytics
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query_text ON search_analytics(query_text);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at DESC);

-- Indexes for content_recommendations
CREATE INDEX IF NOT EXISTS idx_content_recommendations_user_id ON content_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_entity ON content_recommendations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_relevance ON content_recommendations(relevance_score DESC);

-- =============================================================================
-- PHASE 6: ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE crawl_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawled_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE wireless_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crawl_targets
CREATE POLICY "Admins can manage crawl targets" ON crawl_targets
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view active crawl targets" ON crawl_targets
  FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

-- RLS Policies for crawled_content
CREATE POLICY "All authenticated users can view crawled content" ON crawled_content
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for external_links
CREATE POLICY "Users can view external links" ON external_links
  FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

CREATE POLICY "Users can add external links" ON external_links
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND added_by = auth.uid());

CREATE POLICY "Users can update their own external links" ON external_links
  FOR UPDATE USING (added_by = auth.uid());

-- RLS Policies for wireless_configurations
CREATE POLICY "All authenticated users can view wireless configurations" ON wireless_configurations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create wireless configurations" ON wireless_configurations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own wireless configurations" ON wireless_configurations
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for security_alerts
CREATE POLICY "All authenticated users can view security alerts" ON security_alerts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage security alerts" ON security_alerts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for business_profiles
CREATE POLICY "All authenticated users can view business profiles" ON business_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage business profiles" ON business_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for market_intelligence
CREATE POLICY "All authenticated users can view market intelligence" ON market_intelligence
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can manage market intelligence" ON market_intelligence
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for job_market_intelligence
CREATE POLICY "All authenticated users can view job market intelligence" ON job_market_intelligence
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for search_analytics
CREATE POLICY "Users can view their own search analytics" ON search_analytics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own search analytics" ON search_analytics
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for content_recommendations
CREATE POLICY "Users can view their own content recommendations" ON content_recommendations
  FOR SELECT USING (user_id = auth.uid());

-- =============================================================================
-- PHASE 7: INITIAL DATA SEEDING
-- =============================================================================

-- Insert default crawl targets for major vendors
INSERT INTO crawl_targets (url, type, vendor, category, priority, crawl_frequency, metadata) VALUES
-- Cisco
('https://www.cisco.com/c/en/us/support/security/identity-services-engine/series.html', 'vendor_docs', 'Cisco', 'ISE Documentation', 'high', 'weekly', '{"tags": ["cisco", "ise", "nac"], "associatedEntities": ["cisco-ise"]}'),
('https://www.cisco.com/c/en/us/td/docs/security/ise/3-2/admin_guide/b_ise_admin_3_2.html', 'vendor_docs', 'Cisco', 'ISE Admin Guide', 'high', 'weekly', '{"tags": ["cisco", "ise", "admin", "configuration"], "associatedEntities": ["cisco-ise"]}'),
('https://www.cisco.com/c/en/us/support/docs/security/identity-services-engine/200268-Wireless-802-1x-Authentication-with-ISE.html', 'best_practices', 'Cisco', 'Wireless 802.1X with ISE', 'high', 'monthly', '{"tags": ["cisco", "ise", "wireless", "802.1x"], "associatedEntities": ["cisco-ise"]}'),

-- Aruba
('https://www.arubanetworks.com/techdocs/ClearPass/', 'vendor_docs', 'Aruba', 'ClearPass Documentation', 'high', 'weekly', '{"tags": ["aruba", "clearpass", "nac"], "associatedEntities": ["aruba-clearpass"]}'),
('https://www.arubanetworks.com/techdocs/ClearPass/6.11/PolicyManager/Content/CPPM_UserGuide/Admin/Wireless_SSID_Profiles.htm', 'vendor_docs', 'Aruba', 'Wireless SSID Configuration', 'high', 'monthly', '{"tags": ["aruba", "clearpass", "wireless", "ssid"], "associatedEntities": ["aruba-clearpass"]}'),

-- Fortinet
('https://docs.fortinet.com/fortigate', 'vendor_docs', 'Fortinet', 'FortiGate Documentation', 'medium', 'weekly', '{"tags": ["fortinet", "fortigate"], "associatedEntities": ["fortinet-fortigate"]}'),
('https://docs.fortinet.com/document/fortinac/9.4.0/administration-guide', 'vendor_docs', 'Fortinet', 'FortiNAC Administration', 'high', 'weekly', '{"tags": ["fortinet", "fortinac", "nac"], "associatedEntities": ["fortinet-fortinac"]}'),

-- Security Sources
('https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=network+access+control', 'security_advisory', NULL, 'CVE Database NAC', 'critical', 'daily', '{"tags": ["cve", "vulnerability", "nac"], "associatedEntities": []}'),
('https://www.us-cert.gov/ncas/alerts', 'security_advisory', NULL, 'US-CERT Alerts', 'critical', 'daily', '{"tags": ["us-cert", "security", "alerts"], "associatedEntities": []}'),

-- Best Practices Sources
('https://www.nist.gov/cyberframework', 'best_practices', NULL, 'NIST Cybersecurity Framework', 'high', 'monthly', '{"tags": ["nist", "framework", "cybersecurity"], "associatedEntities": []}'),
('https://www.sans.org/white-papers/', 'best_practices', NULL, 'SANS White Papers', 'medium', 'weekly', '{"tags": ["sans", "whitepaper", "security"], "associatedEntities": []}')

ON CONFLICT (url, type) DO NOTHING;

-- Insert sample wireless configurations
INSERT INTO wireless_configurations (vendor, product, model, wireless_standard, auth_method, encryption_type, key_management, use_case, security_level, config_template, best_practices, warnings) VALUES
-- Cisco ISE Wireless Configurations
('Cisco', 'ISE', '3415', '802.11ax', 'WPA3-Enterprise', 'GCMP-256', 'WPA3', 'Enterprise Wireless', 'enterprise', 
'# Cisco ISE WPA3-Enterprise Configuration
wlan create 21 Enterprise-WPA3 Enterprise-WPA3
wlan ssid 21 "YourSSID"
wlan security wpa akm 802.1x 21
wlan security wpa akm psk 21 disable
wlan security wpa wpa3 21
wlan security wpa wpa3 ciphers gcmp-256 21
wlan radius auth add 21 1 192.168.1.100 1812 ascii YourRadiusSecret
wlan enable 21',
'["Use WPA3 for maximum security", "Enable Protected Management Frames (PMF)", "Use strong RADIUS shared secrets", "Implement certificate-based authentication when possible"]',
'["WPA3 requires compatible client devices", "Mixed WPA2/WPA3 environments may have compatibility issues", "Ensure RADIUS server supports WPA3"]'),

('Aruba', 'ClearPass', '6.11', '802.11ac', 'WPA2-Enterprise', 'CCMP', 'WPA2', 'Enterprise Wireless', 'standard',
'# Aruba ClearPass WPA2-Enterprise Configuration
wlan ssid-profile "Enterprise-SSID"
   ssid "YourSSID"
   wpa-passphrase-type wpa2
   wpa2-psk-mixed disable
   authentication-server-group "ClearPass-Servers"
   exit
   
authentication-server radius "ClearPass-Primary"
   host 192.168.1.100
   key YourRadiusSecret
   exit',
'["Use 802.1X with EAP-TLS for strongest security", "Implement dynamic VLAN assignment", "Enable accounting for user tracking"]',
'["Ensure client certificates are properly deployed", "Monitor RADIUS server availability", "Test roaming scenarios thoroughly"]')

ON CONFLICT DO NOTHING;

-- Insert sample business profile
INSERT INTO business_profiles (company_name, industry, company_size, nac_readiness_score, cybersecurity_maturity, key_drivers, technical_requirements) VALUES
('Sample Healthcare Organization', 'Healthcare', 'large', 0.7, 'defined', 
'[{"driver": "HIPAA Compliance", "priority": "critical"}, {"driver": "Medical Device Security", "priority": "high"}, {"driver": "Network Segmentation", "priority": "high"}]',
'[{"requirement": "802.1X Authentication", "priority": "critical"}, {"requirement": "Dynamic VLAN Assignment", "priority": "high"}, {"requirement": "Guest Network Isolation", "priority": "medium"}]')

ON CONFLICT (company_name, domain) DO NOTHING;

-- =============================================================================
-- FINAL REPORT
-- =============================================================================

DO $$
DECLARE
    crawl_targets_count INTEGER;
    wireless_configs_count INTEGER;
    business_profiles_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO crawl_targets_count FROM crawl_targets;
    SELECT COUNT(*) INTO wireless_configs_count FROM wireless_configurations;
    SELECT COUNT(*) INTO business_profiles_count FROM business_profiles;
    
    RAISE NOTICE 'Web Crawling & Business Intelligence System Setup Complete!';
    RAISE NOTICE 'Tables created: crawl_targets, crawled_content, external_links, wireless_configurations, security_alerts, business_profiles, market_intelligence, job_market_intelligence, search_analytics, content_recommendations';
    RAISE NOTICE 'Crawl targets seeded: %', crawl_targets_count;
    RAISE NOTICE 'Wireless configurations seeded: %', wireless_configs_count;
    RAISE NOTICE 'Business profiles seeded: %', business_profiles_count;
    RAISE NOTICE 'Full-text search indexes created for content discovery';
    RAISE NOTICE 'All RLS policies applied for secure access';
    RAISE NOTICE 'System ready for comprehensive web crawling and business intelligence!';
END
$$;
