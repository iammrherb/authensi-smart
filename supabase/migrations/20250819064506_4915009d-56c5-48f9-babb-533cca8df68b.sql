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
  'executive-summary',
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
  'executive-summary',
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
  'deployment-readiness',
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
  'deployment-readiness',
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

-- SECURITY & COMPLIANCE TEMPLATES
(
  'Security Posture Assessment Report',
  'Comprehensive security posture assessment with Portnox NAC impact analysis',
  'security',
  'security-assessment',
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

-- ROI ANALYSIS TEMPLATES
(
  'ROI Analysis & Business Case Report',
  'Comprehensive ROI analysis and business case for Portnox NAC investment',
  'business-case',
  'roi-analysis',
  '# ROI Analysis & Business Case Report

## Executive Summary
**Investment:** {{total_investment}}
**Expected ROI:** {{expected_roi}}%
**Payback Period:** {{payback_period}} months
**Risk Level:** {{risk_level}}

## Investment Breakdown
**Software Licensing:** {{software_cost}}
**Professional Services:** {{services_cost}}
**Hardware:** {{hardware_cost}}
**Training:** {{training_cost}}

## Cost Savings Analysis
**Security Incident Reduction:** {{incident_reduction}}%
**Operational Efficiency:** {{efficiency_gains}}%
**Compliance Cost Savings:** {{compliance_savings}}

## Risk Mitigation Value
**Data Breach Prevention:** {{breach_prevention_value}}
**Compliance Fines Avoidance:** {{compliance_fine_avoidance}}
**Reputation Protection:** {{reputation_value}}

## Productivity Gains
**IT Team Efficiency:** {{it_efficiency}}%
**User Productivity:** {{user_productivity}}%
**Automated Processes:** {{automation_percentage}}%

## Timeline & Milestones
**Implementation:** {{implementation_timeline}}
**Break-even Point:** {{breakeven_point}}
**Full ROI Realization:** {{roi_timeline}}

## Risk Assessment
**Implementation Risks:** {{implementation_risks}}
**Market Risks:** {{market_risks}}
**Technology Risks:** {{technology_risks}}

## Recommendations
[Strategic recommendations for maximizing ROI]',
  '{
    "total_investment": {"type": "number", "required": true, "description": "Total investment amount"},
    "expected_roi": {"type": "number", "required": true, "description": "Expected ROI percentage"},
    "payback_period": {"type": "number", "required": true, "description": "Payback period in months"},
    "risk_level": {"type": "string", "required": true, "description": "Investment risk level"},
    "software_cost": {"type": "number", "required": false, "description": "Software licensing cost"},
    "services_cost": {"type": "number", "required": false, "description": "Professional services cost"},
    "hardware_cost": {"type": "number", "required": false, "description": "Hardware cost"},
    "training_cost": {"type": "number", "required": false, "description": "Training cost"},
    "incident_reduction": {"type": "number", "required": false, "description": "Security incident reduction percentage"},
    "efficiency_gains": {"type": "number", "required": false, "description": "Operational efficiency gains percentage"}
  }',
  'Generate a comprehensive ROI analysis and business case for Portnox NAC investment of {{total_investment}} with {{expected_roi}}% expected ROI and {{payback_period}} month payback period. Risk level: {{risk_level}}. Include software cost {{software_cost}}, services {{services_cost}}, hardware {{hardware_cost}}, training {{training_cost}}. Focus on {{incident_reduction}}% incident reduction and {{efficiency_gains}}% efficiency gains. Provide detailed financial analysis, cost savings breakdown, risk mitigation value, productivity gains, implementation timeline, and strategic recommendations.',
  '["roi", "business-case", "financial", "investment", "portnox"]',
  'expert',
  80,
  true,
  true,
  '00000000-0000-0000-0000-000000000000'
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_report_templates_category ON public.report_templates(category);
CREATE INDEX IF NOT EXISTS idx_report_templates_template_type ON public.report_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_report_templates_tags ON public.report_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_report_templates_active ON public.report_templates(is_active) WHERE is_active = true;