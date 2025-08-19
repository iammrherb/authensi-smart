-- Insert comprehensive report templates covering all project lifecycle phases
INSERT INTO public.report_templates (
  name, 
  description, 
  category, 
  template_type, 
  content_template, 
  variables, 
  ai_prompt_template, 
  tags, 
  complexity_level,
  estimated_time_minutes,
  is_active,
  is_public,
  created_by
) VALUES 
-- ONBOARDING TEMPLATES
(
  'Customer Onboarding Checklist Report',
  'Comprehensive onboarding checklist and progress tracking for new Portnox customers',
  'onboarding',
  'checklist',
  '# Customer Onboarding Report

## Customer Information
**Customer:** {{customer_name}}
**Project Manager:** {{project_manager}}
**Industry:** {{industry}}
**Start Date:** {{start_date}}
**Expected Completion:** {{expected_completion}}

## Project Scope & Objectives
- **Deployment Type:** {{deployment_type}}
- **Number of Sites:** {{site_count}}
- **Estimated Devices:** {{device_count}}
- **Compliance Requirements:** {{compliance_frameworks}}

## Key Stakeholders & Contacts
[Generated based on project stakeholders]

## Project Timeline & Milestones
[AI-generated timeline based on scope]

## Technical Requirements
[Detailed technical assessment]

## Compliance & Security Requirements
[Compliance framework mapping]

## Onboarding Task Checklist
- [ ] Initial assessment completed
- [ ] Stakeholder alignment confirmed
- [ ] Technical requirements validated
- [ ] Project timeline approved
- [ ] Resource allocation confirmed

## Success Criteria & KPIs
[Measurable success metrics]',
  '{
    "customer_name": {"type": "string", "required": true, "description": "Customer organization name"},
    "project_manager": {"type": "string", "required": true, "description": "Assigned project manager"},
    "start_date": {"type": "date", "required": true, "description": "Project start date"},
    "expected_completion": {"type": "date", "required": true, "description": "Expected completion date"},
    "industry": {"type": "string", "required": false, "description": "Customer industry vertical"},
    "deployment_type": {"type": "string", "required": true, "description": "Type of deployment (greenfield, migration, expansion)"},
    "site_count": {"type": "number", "required": true, "description": "Number of sites to be implemented"},
    "device_count": {"type": "number", "required": false, "description": "Estimated number of devices"},
    "compliance_frameworks": {"type": "array", "required": false, "description": "Required compliance frameworks"}
  }',
  'Generate a comprehensive customer onboarding report for Portnox NAC implementation focusing on {{customer_name}} in the {{industry}} industry. The project involves {{deployment_type}} deployment across {{site_count}} sites with {{device_count}} devices. Include detailed project readiness assessment, stakeholder alignment, technical requirements for {{compliance_frameworks}} compliance, and clear next steps with timeline from {{start_date}} to {{expected_completion}}. Ensure all sections are complete with actionable items and measurable KPIs.',
  '["onboarding", "customer", "checklist", "project-initiation", "portnox"]',
  'intermediate',
  45,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- PROJECT TRACKING TEMPLATES
(
  'Executive Project Status Dashboard',
  'High-level executive summary of project status, risks, and key metrics',
  'project-tracking',
  'dashboard',
  '# Executive Project Status Report

## Executive Summary
**Project:** {{project_name}}
**Reporting Period:** {{reporting_period}}
**Overall Status:** {{overall_status}}
**Completion:** {{completion_percentage}}%

## Project Health Status
- **Status Indicator:** {{overall_status}}
- **Budget Utilization:** {{budget_utilized}}%
- **Team Satisfaction:** {{team_satisfaction}}/10
- **Customer Satisfaction:** {{customer_satisfaction}}/10

## Milestone Progress
[Progress against planned milestones]

## Budget & Resource Status
**Budget Performance:** {{budget_utilized}}% utilized
[Resource allocation and efficiency metrics]

## Risk Assessment & Mitigation
**Critical Issues:** {{critical_issues}}
[Top risks with impact assessment and mitigation strategies]

## Upcoming Activities
**Key Milestones:** {{upcoming_milestones}}
[Critical activities and required decisions]

## Stakeholder Feedback
[Key stakeholder feedback and satisfaction metrics]

## Recommendations & Next Steps
[Actionable recommendations for project acceleration]',
  '{
    "project_name": {"type": "string", "required": true, "description": "Project name"},
    "reporting_period": {"type": "string", "required": true, "description": "Reporting period"},
    "overall_status": {"type": "string", "required": true, "description": "Overall project status (Green/Yellow/Red)"},
    "completion_percentage": {"type": "number", "required": true, "description": "Overall completion percentage"},
    "budget_utilized": {"type": "number", "required": false, "description": "Budget utilized percentage"},
    "team_satisfaction": {"type": "number", "required": false, "description": "Team satisfaction score (1-10)"},
    "customer_satisfaction": {"type": "number", "required": false, "description": "Customer satisfaction score (1-10)"},
    "critical_issues": {"type": "number", "required": true, "description": "Number of critical issues"},
    "upcoming_milestones": {"type": "array", "required": true, "description": "Upcoming milestone dates"}
  }',
  'Generate an executive-level project status report for {{project_name}} covering {{reporting_period}}. Current status is {{overall_status}} with {{completion_percentage}}% completion. Report on {{critical_issues}} critical issues, budget utilization of {{budget_utilized}}%, team satisfaction {{team_satisfaction}}/10, and customer satisfaction {{customer_satisfaction}}/10. Focus on upcoming milestones: {{upcoming_milestones}}. Keep it concise, action-oriented, and focused on business impact with clear status indicators and reasoning.',
  '["executive", "project-tracking", "dashboard", "status", "portnox"]',
  'intermediate',
  20,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- IMPLEMENTATION TEMPLATES
(
  'Site Implementation Readiness Assessment',
  'Comprehensive assessment of site readiness for Portnox NAC deployment',
  'implementation',
  'assessment',
  '# Site Implementation Readiness Assessment

## Site Overview & Context
**Site:** {{site_name}}
**Type:** {{site_type}}
**Employees:** {{employee_count}}
**Devices:** {{device_count}}
**Network Complexity:** {{network_complexity}}

## Network Infrastructure Assessment
[Network infrastructure readiness evaluation]

## Device Inventory & Compatibility
[Device compatibility assessment with Portnox]

## Current Security Posture
**Current NAC:** {{current_nac_solution}}
[Security controls review]

## Compliance Requirements
**Frameworks:** {{compliance_requirements}}
[Compliance requirements mapping]

## Implementation Plan & Timeline
**Phase:** {{implementation_phase}}
**Go-Live Date:** {{go_live_date}}
[Phased implementation approach]

## Resource Requirements
[Personnel, hardware, and timeline requirements]

## Risk Assessment & Mitigation
[Implementation risks and mitigation strategies]

## Success Metrics & KPIs
[Measurable success criteria]',
  '{
    "site_name": {"type": "string", "required": true, "description": "Site name or location"},
    "site_type": {"type": "string", "required": true, "description": "Site type (headquarters, branch, datacenter, etc.)"},
    "employee_count": {"type": "number", "required": true, "description": "Number of employees at site"},
    "device_count": {"type": "number", "required": true, "description": "Estimated number of devices"},
    "network_complexity": {"type": "string", "required": true, "description": "Network complexity level (low/medium/high)"},
    "current_nac_solution": {"type": "string", "required": false, "description": "Current NAC solution in use"},
    "implementation_phase": {"type": "string", "required": true, "description": "Implementation phase (pilot, production, migration)"},
    "compliance_requirements": {"type": "array", "required": false, "description": "Applicable compliance frameworks"},
    "go_live_date": {"type": "date", "required": true, "description": "Target go-live date"}
  }',
  'Generate a detailed site implementation readiness assessment for {{site_name}} ({{site_type}}) with {{employee_count}} employees and {{device_count}} devices. Current environment has {{network_complexity}} network complexity and {{current_nac_solution}} NAC solution. Implementation is {{implementation_phase}} phase targeting {{go_live_date}} go-live. Address {{compliance_requirements}} compliance requirements. Focus on technical readiness, risk mitigation, and implementation success factors including network infrastructure, device compatibility, security posture enhancement, and detailed implementation plan.',
  '["implementation", "site-assessment", "readiness", "nac", "portnox"]',
  'advanced',
  60,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- PRE-DEPLOYMENT TEMPLATES
(
  'Pre-Deployment Validation Checklist',
  'Comprehensive pre-deployment validation and go/no-go decision framework',
  'pre-deployment',
  'checklist',
  '# Pre-Deployment Validation Report

## Deployment Overview
**Planned Date:** {{deployment_date}}
**Validation Date:** {{validation_date}}
**Maintenance Window:** {{maintenance_window}}
**Rollback Time Limit:** {{rollback_time_limit}} hours
**Risk Tolerance:** {{risk_tolerance}}

## Infrastructure Validation
✅ Network infrastructure ready
✅ Server capacity validated
✅ Dependencies confirmed

## Configuration Review & Validation
[Portnox configuration validation against requirements]

## Integration Testing Results
[Integration testing with existing systems]

## Security Validation
[Security controls validation]

## Performance Testing
[Performance and capacity validation]

## Backup & Recovery Procedures
✅ Backup procedures in place and tested

## Rollback Plan & Procedures
[Detailed rollback procedures and validation]

## Team Readiness & Training
[Team training completion and operational readiness]

## Go/No-Go Decision Matrix
**Stakeholder Approval:** {{stakeholder_approval}}
**Critical Applications:** {{critical_applications}}
**Recommendation:** [GO/NO-GO based on validation]',
  '{
    "deployment_date": {"type": "date", "required": true, "description": "Planned deployment date"},
    "validation_date": {"type": "date", "required": true, "description": "Validation completion date"},
    "test_environment": {"type": "string", "required": true, "description": "Test environment details"},
    "production_environment": {"type": "string", "required": true, "description": "Production environment details"},
    "critical_applications": {"type": "array", "required": true, "description": "Critical applications that must remain operational"},
    "maintenance_window": {"type": "string", "required": true, "description": "Available maintenance window"},
    "rollback_time_limit": {"type": "number", "required": true, "description": "Maximum time before rollback decision (hours)"},
    "stakeholder_approval": {"type": "boolean", "required": true, "description": "Stakeholder approval received"},
    "risk_tolerance": {"type": "string", "required": true, "description": "Risk tolerance level (low/medium/high)"}
  }',
  'Generate a comprehensive pre-deployment validation report for Portnox NAC deployment on {{deployment_date}} with {{maintenance_window}} maintenance window. Validation completed on {{validation_date}} with {{risk_tolerance}} risk tolerance and {{rollback_time_limit}} hours rollback limit. Critical applications: {{critical_applications}}. Stakeholder approval: {{stakeholder_approval}}. Test environment: {{test_environment}}, Production: {{production_environment}}. Focus on risk mitigation, validation completeness, and clear go/no-go criteria with detailed infrastructure, configuration, integration, security, and performance validation.',
  '["pre-deployment", "validation", "checklist", "go-no-go", "portnox"]',
  'expert',
  90,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- MILESTONE TEMPLATES
(
  'Project Milestone Achievement Report',
  'Detailed milestone completion report with lessons learned and next phase planning',
  'milestones',
  'achievement',
  '# Project Milestone Achievement Report

## Milestone Summary
**Milestone:** {{milestone_name}}
**Phase:** {{milestone_phase}}
**Completed:** {{completion_date}}
**Originally Planned:** {{planned_completion_date}}
**Quality Score:** {{quality_score}}/10

## Objectives Achieved
[Specific objectives achieved with measurable outcomes]

## Deliverables Completed
[All deliverables completed with quality assessment]

## Timeline Analysis
[Timeline performance including delays and accelerations]

## Budget Analysis
**Allocated:** {{budget_allocated}}
**Used:** {{budget_used}}
[Budget performance and resource utilization]

## Quality Metrics & KPIs
**Quality Score:** {{quality_score}}/10
**Stakeholder Satisfaction:** {{stakeholder_satisfaction}}/10

## Challenges Overcome
[Significant challenges and resolution methods]

## Lessons Learned
[Key lessons for future milestone execution]

## Next Phase Planning
**Team Members:** {{team_members}}
[Preparation for subsequent project phases]',
  '{
    "milestone_name": {"type": "string", "required": true, "description": "Milestone name"},
    "completion_date": {"type": "date", "required": true, "description": "Actual completion date"},
    "planned_completion_date": {"type": "date", "required": true, "description": "Originally planned completion date"},
    "milestone_phase": {"type": "string", "required": true, "description": "Project phase"},
    "budget_allocated": {"type": "number", "required": false, "description": "Budget allocated for this milestone"},
    "budget_used": {"type": "number", "required": false, "description": "Actual budget used"},
    "quality_score": {"type": "number", "required": false, "description": "Quality score (1-10)"},
    "stakeholder_satisfaction": {"type": "number", "required": false, "description": "Stakeholder satisfaction (1-10)"},
    "team_members": {"type": "array", "required": true, "description": "Team members involved"}
  }',
  'Generate a comprehensive milestone achievement report for {{milestone_name}} in {{milestone_phase}} phase. Completed on {{completion_date}} (planned: {{planned_completion_date}}) with quality score {{quality_score}}/10 and stakeholder satisfaction {{stakeholder_satisfaction}}/10. Budget: {{budget_used}} used of {{budget_allocated}} allocated. Team: {{team_members}}. Focus on accomplishments, measurable outcomes, timeline analysis, budget performance, challenges overcome, lessons learned, and preparation for next phase.',
  '["milestone", "achievement", "project-tracking", "lessons-learned", "portnox"]',
  'intermediate',
  40,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- GO-LIVE TEMPLATES
(
  'Go-Live Success Report',
  'Comprehensive go-live execution report with performance metrics and post-deployment assessment',
  'go-live',
  'success-report',
  '# Go-Live Success Report

## Go-Live Summary
**Date:** {{go_live_date}}
**Duration:** {{deployment_duration}} hours
**Systems Deployed:** {{systems_deployed}}
**Rollback Executed:** {{rollback_executed}}

## Deployment Execution
[Deployment process and timeline adherence]

## System Performance Metrics
**Users Onboarded:** {{users_onboarded}}
**Devices Authenticated:** {{devices_authenticated}}
**Business Downtime:** {{business_downtime}} minutes
[Performance vs baseline expectations]

## User Adoption & Feedback
[User adoption rates and feedback]

## Issues & Resolution
**Critical Issues:** {{critical_issues}}
[Issues encountered and resolution effectiveness]

## Business Impact Assessment
[Security improvements and operational benefits]

## Compliance Validation
[Post-deployment compliance verification]

## Support Transition
[Support handover and operational readiness]

## Optimization Opportunities
[Performance and efficiency optimization recommendations]',
  '{
    "go_live_date": {"type": "date", "required": true, "description": "Actual go-live date"},
    "deployment_duration": {"type": "number", "required": true, "description": "Deployment duration in hours"},
    "systems_deployed": {"type": "array", "required": true, "description": "Systems successfully deployed"},
    "users_onboarded": {"type": "number", "required": true, "description": "Number of users onboarded"},
    "devices_authenticated": {"type": "number", "required": true, "description": "Number of devices successfully authenticated"},
    "critical_issues": {"type": "number", "required": true, "description": "Number of critical issues encountered"},
    "business_downtime": {"type": "number", "required": true, "description": "Business downtime in minutes"},
    "rollback_executed": {"type": "boolean", "required": true, "description": "Whether rollback was executed"}
  }',
  'Generate a comprehensive go-live success report for Portnox NAC deployment on {{go_live_date}} lasting {{deployment_duration}} hours. Successfully deployed {{systems_deployed}} with {{users_onboarded}} users onboarded and {{devices_authenticated}} devices authenticated. Encountered {{critical_issues}} critical issues with {{business_downtime}} minutes downtime. Rollback executed: {{rollback_executed}}. Focus on execution quality, performance achievements, business value delivery, user adoption, issue resolution effectiveness, compliance validation, support transition, and optimization opportunities.',
  '["go-live", "deployment", "success", "performance", "portnox"]',
  'advanced',
  50,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- SCOPING TEMPLATES  
(
  'Comprehensive Project Scoping Report',
  'Detailed project scoping assessment with requirements analysis and solution design',
  'scoping',
  'analysis',
  '# Comprehensive Project Scoping Report

## Customer Overview
**Customer:** {{customer_name}}
**Scoping Date:** {{scoping_date}}
**Business Drivers:** {{business_drivers}}
**Timeline Requirements:** {{timeline_requirements}}

## Business Requirements Analysis
[Security goals, compliance needs, operational objectives]

## Technical Requirements
**Users:** {{user_count}}
**Devices:** {{device_count}}
**Sites:** {{site_count}}
[Infrastructure, integration, performance needs]

## Current State Assessment
**Current Solutions:** {{current_solutions}}
[Existing security infrastructure and capabilities]

## Gap Analysis
[Gaps between current and desired future state]

## Proposed Solution Design
[Portnox solution design tailored to requirements]

## Implementation Approach
[Recommended methodology and phasing]

## Resource Estimation
[Personnel, hardware, services requirements]

## Timeline Projection
[Implementation timeline with key milestones]

## Risk Assessment
[Implementation risks and mitigation strategies]

## Investment Analysis
**Budget Range:** {{budget_range}}
**Compliance:** {{compliance_requirements}}
[ROI and business case analysis]',
  '{
    "customer_name": {"type": "string", "required": true, "description": "Customer name"},
    "scoping_date": {"type": "date", "required": true, "description": "Scoping assessment date"},
    "business_drivers": {"type": "array", "required": true, "description": "Primary business drivers"},
    "current_solutions": {"type": "array", "required": false, "description": "Current NAC/security solutions"},
    "user_count": {"type": "number", "required": true, "description": "Total user count"},
    "device_count": {"type": "number", "required": true, "description": "Total device count"},
    "site_count": {"type": "number", "required": true, "description": "Number of sites"},
    "compliance_requirements": {"type": "array", "required": false, "description": "Compliance requirements"},
    "budget_range": {"type": "string", "required": false, "description": "Budget range"},
    "timeline_requirements": {"type": "string", "required": true, "description": "Timeline requirements"}
  }',
  'Generate a comprehensive project scoping report for {{customer_name}} dated {{scoping_date}}. Business drivers: {{business_drivers}} with {{timeline_requirements}} timeline. Environment: {{user_count}} users, {{device_count}} devices across {{site_count}} sites. Current solutions: {{current_solutions}}. Budget range: {{budget_range}}. Address {{compliance_requirements}} compliance. Focus on requirements analysis, current state assessment, gap identification, Portnox solution design, implementation approach, resource estimation, timeline projection, risk assessment, and investment analysis with ROI.',
  '["scoping", "requirements", "analysis", "solution-design", "portnox"]',
  'expert',
  75,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- SECURITY & COMPLIANCE TEMPLATES
(
  'Security Posture Assessment Report',
  'Comprehensive security posture assessment with Portnox NAC impact analysis',
  'security',
  'assessment',
  '# Security Posture Assessment Report

## Security Overview
**Assessment Date:** {{assessment_date}}
**Security Maturity:** {{security_maturity}}
**Threat Level:** {{threat_level}}

## Threat Landscape Analysis
[Relevant threat landscape and attack vectors]

## Current Security Controls
**Current NAC:** {{current_nac_solution}}
**Network Segmentation:** {{network_segmentation}}
**Endpoint Security:** {{endpoint_security}}
**Identity Management:** {{identity_management}}

## Vulnerability Assessment
**Security Incidents (12mo):** {{security_incidents}}
[Security vulnerabilities and exposure areas]

## NAC Security Benefits
[How Portnox addresses identified security gaps]

## Compliance Impact
**Frameworks:** {{compliance_frameworks}}
[Compliance support and objectives]

## Risk Mitigation Strategies
[Risk mitigation enabled by NAC implementation]

## Security Metrics & KPIs
[Metrics to measure security improvement]

## Security Recommendations
[Actionable recommendations beyond NAC]',
  '{
    "assessment_date": {"type": "date", "required": true, "description": "Assessment date"},
    "security_maturity": {"type": "string", "required": true, "description": "Current security maturity level"},
    "threat_level": {"type": "string", "required": true, "description": "Threat level assessment"},
    "compliance_frameworks": {"type": "array", "required": false, "description": "Applicable compliance frameworks"},
    "security_incidents": {"type": "number", "required": false, "description": "Security incidents in last 12 months"},
    "current_nac_solution": {"type": "string", "required": false, "description": "Current NAC solution"},
    "network_segmentation": {"type": "string", "required": true, "description": "Current network segmentation level"},
    "endpoint_security": {"type": "string", "required": true, "description": "Current endpoint security posture"},
    "identity_management": {"type": "string", "required": true, "description": "Current identity management maturity"}
  }',
  'Generate a comprehensive security posture assessment on {{assessment_date}} with {{security_maturity}} maturity and {{threat_level}} threat level. Current environment: {{current_nac_solution}} NAC, {{network_segmentation}} network segmentation, {{endpoint_security}} endpoint security, {{identity_management}} identity management. {{security_incidents}} incidents in 12 months. Address {{compliance_frameworks}} frameworks. Focus on threat landscape, current controls assessment, vulnerability identification, Portnox NAC security benefits, compliance impact, risk mitigation strategies, security metrics, and actionable recommendations.',
  '["security", "assessment", "posture", "compliance", "portnox"]',
  'expert',
  65,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- BEST PRACTICES TEMPLATES
(
  'Best Practices & Optimization Report',
  'Comprehensive best practices guide and optimization recommendations for Portnox deployment',
  'best-practices',
  'optimization',
  '# Best Practices & Optimization Report

## Deployment Overview
**Phase:** {{deployment_phase}}
**Environment:** {{environment_type}}
**Goals:** {{optimization_goals}}
**Business Criticality:** {{business_criticality}}

## Deployment Best Practices
[Phase-specific deployment best practices]

## Configuration Optimization
[Performance and security optimization]

## Performance Tuning Recommendations
[Performance tuning strategies]

## Security Hardening Guidelines
[Security hardening best practices]

## Operational Excellence
**Maturity:** {{operational_maturity}}
**Team Expertise:** {{team_expertise}}
**Automation Level:** {{automation_level}}
[Ongoing management practices]

## Monitoring & Alerting Best Practices
[Monitoring strategies and recommended metrics]

## Troubleshooting Guide
[Common issues and resolutions]

## Maintenance Procedures
[Recommended maintenance schedules]

## Continuous Improvement Plan
**Compliance:** {{compliance_requirements}}
[Optimization cycles and improvement strategies]',
  '{
    "deployment_phase": {"type": "string", "required": true, "description": "Current deployment phase"},
    "environment_type": {"type": "string", "required": true, "description": "Environment type (production, staging, pilot)"},
    "optimization_goals": {"type": "array", "required": true, "description": "Optimization goals"},
    "compliance_requirements": {"type": "array", "required": false, "description": "Compliance requirements"},
    "operational_maturity": {"type": "string", "required": true, "description": "Operational maturity level"},
    "team_expertise": {"type": "string", "required": true, "description": "Team expertise level"},
    "automation_level": {"type": "string", "required": true, "description": "Current automation level"},
    "business_criticality": {"type": "string", "required": true, "description": "Business criticality level"}
  }',
  'Generate comprehensive best practices and optimization recommendations for Portnox NAC in {{deployment_phase}} phase with {{environment_type}} environment. Goals: {{optimization_goals}} with {{business_criticality}} criticality. Team has {{team_expertise}} expertise, {{operational_maturity}} maturity, {{automation_level}} automation. Address {{compliance_requirements}} compliance. Cover deployment best practices, configuration optimization, performance tuning, security hardening, operational excellence, monitoring/alerting, troubleshooting, maintenance procedures, and continuous improvement.',
  '["best-practices", "optimization", "recommendations", "operations", "portnox"]',
  'advanced',
  55,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_report_templates_category ON public.report_templates(category);
CREATE INDEX IF NOT EXISTS idx_report_templates_template_type ON public.report_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_report_templates_tags ON public.report_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_report_templates_active ON public.report_templates(is_active) WHERE is_active = true;