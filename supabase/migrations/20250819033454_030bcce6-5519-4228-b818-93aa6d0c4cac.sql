-- =============================================================================
-- POPULATE DEFAULT DATA FOR AI INTEGRATION AND WORKFLOWS (FIXED)
-- =============================================================================

-- Insert default AI providers (only if they don't exist)
INSERT INTO public.ai_providers (provider_name, api_endpoint, supported_models, capabilities, pricing_info) VALUES
('OpenAI', 'https://api.openai.com/v1', 
 '["gpt-5-2025-08-07", "gpt-5-mini-2025-08-07", "gpt-5-nano-2025-08-07", "gpt-4.1-2025-04-14", "o3-2025-04-16", "o4-mini-2025-04-16", "gpt-4o", "gpt-4o-mini"]'::jsonb,
 '["text-generation", "code-generation", "analysis", "reasoning", "vision"]'::jsonb,
 '{"model_pricing": {"gpt-5": {"input": 10, "output": 30}, "gpt-4": {"input": 5, "output": 15}}}'::jsonb),

('Anthropic', 'https://api.anthropic.com/v1', 
 '["claude-opus-4-20250514", "claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022"]'::jsonb,
 '["text-generation", "analysis", "reasoning", "code-generation", "vision"]'::jsonb,
 '{"model_pricing": {"claude-4": {"input": 15, "output": 75}, "claude-3-5-sonnet": {"input": 3, "output": 15}}}'::jsonb),

('Google', 'https://generativelanguage.googleapis.com/v1', 
 '["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"]'::jsonb,
 '["text-generation", "analysis", "vision", "multimodal"]'::jsonb,
 '{"model_pricing": {"gemini-1.5-pro": {"input": 2.5, "output": 7.5}}}'::jsonb)
ON CONFLICT (provider_name) DO UPDATE SET 
  supported_models = EXCLUDED.supported_models,
  capabilities = EXCLUDED.capabilities,
  pricing_info = EXCLUDED.pricing_info,
  updated_at = now();

-- Insert comprehensive system settings for AI integration
INSERT INTO public.system_settings (setting_key, setting_value, created_by) VALUES
('ai_integration_settings', 
 '{
   "auto_analysis_enabled": true, 
   "default_provider": "openai", 
   "max_tokens_per_request": 4000, 
   "analysis_confidence_threshold": 0.8,
   "supported_file_types": ["pdf", "docx", "txt", "md", "csv", "xlsx"],
   "auto_tag_enabled": true,
   "auto_summary_enabled": true,
   "batch_processing_enabled": true
 }'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('portnox_integration_settings', 
 '{
   "auto_sync_enabled": true, 
   "sync_interval_minutes": 15, 
   "max_retry_attempts": 3, 
   "webhook_enabled": true,
   "bulk_operations_enabled": true,
   "site_auto_creation": true,
   "nas_auto_configuration": true,
   "policy_sync_enabled": true
 }'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('security_compliance_settings', 
 '{
   "auto_assessment_enabled": true, 
   "required_frameworks": ["SOC2", "ISO27001", "NIST", "PCI-DSS"], 
   "assessment_schedule": "monthly",
   "critical_finding_alerts": true,
   "compliance_dashboard_enabled": true,
   "automated_remediation": false
 }'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('workflow_automation_settings', 
 '{
   "auto_workflow_enabled": true,
   "parallel_execution_enabled": true,
   "error_handling_mode": "retry_with_backoff",
   "notification_channels": ["email", "in_app"],
   "audit_logging_enabled": true
 }'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('vendor_integration_settings', 
 '{
   "supported_vendors": ["cisco", "aruba", "fortinet", "palo_alto", "checkpoint", "juniper", "extreme", "ruckus"],
   "api_timeout_seconds": 30,
   "bulk_config_enabled": true,
   "config_validation_enabled": true,
   "backup_before_changes": true
 }'::jsonb,
 (SELECT id FROM profiles LIMIT 1))
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Create storage buckets for file management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('project-files', 'project-files', false, 52428800, ARRAY['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','text/markdown','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/png','image/jpeg','application/zip']),
('site-files', 'site-files', false, 52428800, ARRAY['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','text/markdown','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/png','image/jpeg','application/zip']),
('ai-analysis-cache', 'ai-analysis-cache', false, 10485760, ARRAY['application/json','text/plain'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the new buckets
CREATE POLICY "Users can view project files they have access to" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'project-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT p.id::text FROM projects p 
    WHERE p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Users can upload project files to their projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT p.id::text FROM projects p 
    WHERE p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Users can view site files they have access to" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'site-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT s.id::text FROM sites s 
    WHERE s.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Users can upload site files to their sites" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'site-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT s.id::text FROM sites s 
    WHERE s.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "System can manage AI analysis cache" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'ai-analysis-cache')
WITH CHECK (bucket_id = 'ai-analysis-cache');

-- Insert comprehensive device library data for NAC integration
INSERT INTO device_types (device_name, category, manufacturer, description, authentication_capabilities, security_features, management_options, typical_use_cases, deployment_considerations, compliance_requirements, tags, created_by) VALUES
('iPhone/iPad', 'Mobile Device', 'Apple', 'iOS mobile devices with enterprise management capabilities', 
 '["certificate-based", "username-password", "biometric", "device-certificate"]'::jsonb,
 '["device-encryption", "remote-wipe", "app-sandboxing", "secure-boot"]'::jsonb,
 '["mdm", "mam", "self-service", "automated-enrollment"]'::jsonb,
 '["byod", "corporate-owned", "executive-devices", "field-workers"]'::jsonb,
 '["mdm-enrollment", "certificate-distribution", "wifi-profiles", "app-deployment"]'::jsonb,
 '["hipaa", "sox", "gdpr", "pci-dss"]'::jsonb,
 '["mobile", "ios", "enterprise", "byod"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('Android Devices', 'Mobile Device', 'Various', 'Android enterprise devices with work profile support',
 '["certificate-based", "username-password", "biometric", "device-certificate", "work-profile"]'::jsonb,
 '["work-profile-isolation", "device-encryption", "remote-wipe", "app-verification"]'::jsonb,
 '["android-enterprise", "emm", "work-profile", "kiosk-mode"]'::jsonb,
 '["byod", "corporate-owned", "kiosk-devices", "rugged-deployments"]'::jsonb,
 '["work-profile-setup", "google-play-managed", "zero-touch-enrollment"]'::jsonb,
 '["hipaa", "sox", "gdpr", "pci-dss"]'::jsonb,
 '["mobile", "android", "enterprise", "byod"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('IoT Sensors', 'IoT Device', 'Various', 'Industrial IoT sensors and monitoring devices',
 '["device-certificate", "psk", "eap-tls", "mac-authentication"]'::jsonb,
 '["hardware-security-module", "secure-boot", "encrypted-communication"]'::jsonb,
 '["centralized-management", "bulk-provisioning", "firmware-updates"]'::jsonb,
 '["industrial-monitoring", "environmental-sensors", "asset-tracking"]'::jsonb,
 '["network-segmentation", "certificate-management", "device-lifecycle"]'::jsonb,
 '["iec-62443", "nist-cybersecurity", "iso-27001"]'::jsonb,
 '["iot", "industrial", "sensors", "monitoring"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1))
ON CONFLICT (device_name, manufacturer) DO NOTHING;

-- Create comprehensive pain points and recommendations
INSERT INTO pain_points_library (title, description, category, severity, industry_specific, recommended_solutions, created_by) VALUES
('Complex Multi-Vendor Integration', 'Difficulty integrating multiple network vendors with NAC solutions', 'integration', 'high',
 '["enterprise", "healthcare", "finance", "education"]'::jsonb,
 '["unified-policy-management", "vendor-agnostic-nac", "standardized-apis", "configuration-templates"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('IoT Device Onboarding Complexity', 'Challenging to securely onboard large numbers of IoT devices', 'device_management', 'high',
 '["manufacturing", "smart_buildings", "healthcare", "retail"]'::jsonb,
 '["automated-device-discovery", "bulk-certificate-provisioning", "device-profiling", "zero-touch-onboarding"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('BYOD Security Gaps', 'Personal devices creating security vulnerabilities in enterprise networks', 'security', 'medium',
 '["enterprise", "education", "healthcare", "consulting"]'::jsonb,
 '["mobile-device-management", "network-segmentation", "conditional-access", "user-behavior-analytics"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1)),

('Compliance Reporting Overhead', 'Manual compliance reporting consuming excessive time and resources', 'compliance', 'medium',
 '["finance", "healthcare", "government", "retail"]'::jsonb,
 '["automated-compliance-scanning", "real-time-monitoring", "dashboard-reporting", "audit-trail-automation"]'::jsonb,
 (SELECT id FROM profiles LIMIT 1))
ON CONFLICT DO NOTHING;

-- Enable realtime subscriptions for critical tables
ALTER publication supabase_realtime ADD TABLE public.ai_usage_analytics;
ALTER publication supabase_realtime ADD TABLE public.workflow_instances;
ALTER publication supabase_realtime ADD TABLE public.security_compliance_assessments;
ALTER publication supabase_realtime ADD TABLE public.project_files;
ALTER publication supabase_realtime ADD TABLE public.site_files;
ALTER publication supabase_realtime ADD TABLE public.vendor_api_integrations;
ALTER publication supabase_realtime ADD TABLE public.portnox_site_configurations;