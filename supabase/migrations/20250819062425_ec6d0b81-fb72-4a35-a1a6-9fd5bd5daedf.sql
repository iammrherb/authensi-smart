-- Insert comprehensive report templates covering all project lifecycle phases
INSERT INTO public.report_templates (
  name, 
  description, 
  category, 
  template_type, 
  template_structure, 
  variable_definitions, 
  ai_generation_prompts, 
  tags, 
  is_active,
  created_by
) VALUES 
-- ONBOARDING TEMPLATES
(
  'Customer Onboarding Checklist Report',
  'Comprehensive onboarding checklist and progress tracking for new Portnox customers',
  'onboarding',
  'checklist',
  '{
    "sections": [
      {"id": "customer_info", "title": "Customer Information", "required": true},
      {"id": "project_scope", "title": "Project Scope & Objectives", "required": true},
      {"id": "stakeholders", "title": "Key Stakeholders & Contacts", "required": true},
      {"id": "timeline", "title": "Project Timeline & Milestones", "required": true},
      {"id": "technical_requirements", "title": "Technical Requirements", "required": true},
      {"id": "compliance_needs", "title": "Compliance & Security Requirements", "required": true},
      {"id": "onboarding_tasks", "title": "Onboarding Task Checklist", "required": true},
      {"id": "success_criteria", "title": "Success Criteria & KPIs", "required": true}
    ]
  }',
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
  '{
    "system_prompt": "Generate a comprehensive customer onboarding report for Portnox NAC implementation. Focus on project readiness, stakeholder alignment, and clear next steps.",
    "sections": {
      "customer_info": "Summarize customer background, industry context, and business drivers for NAC implementation",
      "project_scope": "Define project scope, objectives, and expected outcomes with specific KPIs",
      "stakeholders": "List key stakeholders with roles, responsibilities, and contact information",
      "timeline": "Create detailed project timeline with key milestones and dependencies",
      "technical_requirements": "Outline technical requirements, infrastructure needs, and integration points",
      "compliance_needs": "Detail compliance requirements and how Portnox will address them",
      "onboarding_tasks": "Provide comprehensive task checklist with owners and deadlines",
      "success_criteria": "Define measurable success criteria and project KPIs"
    }
  }',
  '["onboarding", "customer", "checklist", "project-initiation", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- PROJECT TRACKING TEMPLATES
(
  'Executive Project Status Dashboard',
  'High-level executive summary of project status, risks, and key metrics',
  'project-tracking',
  'dashboard',
  '{
    "sections": [
      {"id": "executive_summary", "title": "Executive Summary", "required": true},
      {"id": "project_health", "title": "Project Health Status", "required": true},
      {"id": "milestone_progress", "title": "Milestone Progress", "required": true},
      {"id": "budget_status", "title": "Budget & Resource Status", "required": true},
      {"id": "risk_assessment", "title": "Risk Assessment & Mitigation", "required": true},
      {"id": "upcoming_activities", "title": "Upcoming Activities", "required": true},
      {"id": "stakeholder_feedback", "title": "Stakeholder Feedback", "required": false},
      {"id": "recommendations", "title": "Recommendations & Next Steps", "required": true}
    ]
  }',
  '{
    "project_name": {"type": "string", "required": true, "description": "Project name"},
    "reporting_period": {"type": "string", "required": true, "description": "Reporting period (e.g., Week of Jan 15-22)"},
    "overall_status": {"type": "string", "required": true, "description": "Overall project status (Green/Yellow/Red)"},
    "completion_percentage": {"type": "number", "required": true, "description": "Overall completion percentage"},
    "budget_utilized": {"type": "number", "required": false, "description": "Budget utilized percentage"},
    "team_satisfaction": {"type": "number", "required": false, "description": "Team satisfaction score (1-10)"},
    "customer_satisfaction": {"type": "number", "required": false, "description": "Customer satisfaction score (1-10)"},
    "critical_issues": {"type": "number", "required": true, "description": "Number of critical issues"},
    "upcoming_milestones": {"type": "array", "required": true, "description": "Upcoming milestone dates"}
  }',
  '{
    "system_prompt": "Generate an executive-level project status report for Portnox implementation. Keep it concise, action-oriented, and focused on business impact.",
    "sections": {
      "executive_summary": "Provide a 2-3 sentence summary of current project status and key achievements",
      "project_health": "Assess overall project health with clear status indicators and reasoning",
      "milestone_progress": "Report progress against planned milestones with specific completion percentages",
      "budget_status": "Summarize budget utilization and resource allocation efficiency",
      "risk_assessment": "Identify top risks with impact assessment and mitigation strategies",
      "upcoming_activities": "Highlight critical upcoming activities and required decisions",
      "stakeholder_feedback": "Summarize key stakeholder feedback and satisfaction metrics",
      "recommendations": "Provide actionable recommendations for project acceleration or issue resolution"
    }
  }',
  '["executive", "project-tracking", "dashboard", "status", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- IMPLEMENTATION TEMPLATES
(
  'Site Implementation Readiness Assessment',
  'Comprehensive assessment of site readiness for Portnox NAC deployment',
  'implementation',
  'assessment',
  '{
    "sections": [
      {"id": "site_overview", "title": "Site Overview & Context", "required": true},
      {"id": "network_assessment", "title": "Network Infrastructure Assessment", "required": true},
      {"id": "device_inventory", "title": "Device Inventory & Compatibility", "required": true},
      {"id": "security_posture", "title": "Current Security Posture", "required": true},
      {"id": "compliance_requirements", "title": "Compliance Requirements", "required": true},
      {"id": "implementation_plan", "title": "Implementation Plan & Timeline", "required": true},
      {"id": "resource_requirements", "title": "Resource Requirements", "required": true},
      {"id": "risk_mitigation", "title": "Risk Assessment & Mitigation", "required": true},
      {"id": "success_metrics", "title": "Success Metrics & KPIs", "required": true}
    ]
  }',
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
  '{
    "system_prompt": "Generate a detailed site implementation readiness assessment for Portnox NAC deployment. Focus on technical readiness, risk mitigation, and implementation success factors.",
    "sections": {
      "site_overview": "Describe site characteristics, business context, and strategic importance",
      "network_assessment": "Evaluate network infrastructure readiness including switches, wireless, and network segmentation",
      "device_inventory": "Assess device types, compatibility with Portnox, and potential integration challenges",
      "security_posture": "Review current security controls and how Portnox will enhance the security posture",
      "compliance_requirements": "Detail compliance requirements and how implementation will address them",
      "implementation_plan": "Outline phased implementation approach with timeline and dependencies",
      "resource_requirements": "Specify required resources including personnel, hardware, and timeline",
      "risk_mitigation": "Identify implementation risks and detailed mitigation strategies",
      "success_metrics": "Define measurable success criteria and KPIs for the implementation"
    }
  }',
  '["implementation", "site-assessment", "readiness", "nac", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- PRE-DEPLOYMENT TEMPLATES
(
  'Pre-Deployment Validation Checklist',
  'Comprehensive pre-deployment validation and go/no-go decision framework',
  'pre-deployment',
  'checklist',
  '{
    "sections": [
      {"id": "infrastructure_validation", "title": "Infrastructure Validation", "required": true},
      {"id": "configuration_review", "title": "Configuration Review & Validation", "required": true},
      {"id": "integration_testing", "title": "Integration Testing Results", "required": true},
      {"id": "security_validation", "title": "Security Validation", "required": true},
      {"id": "performance_testing", "title": "Performance Testing", "required": true},
      {"id": "backup_procedures", "title": "Backup & Recovery Procedures", "required": true},
      {"id": "rollback_plan", "title": "Rollback Plan & Procedures", "required": true},
      {"id": "team_readiness", "title": "Team Readiness & Training", "required": true},
      {"id": "go_no_go_decision", "title": "Go/No-Go Decision Matrix", "required": true}
    ]
  }',
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
  '{
    "system_prompt": "Generate a comprehensive pre-deployment validation report for Portnox NAC. Focus on risk mitigation, validation completeness, and clear go/no-go criteria.",
    "sections": {
      "infrastructure_validation": "Confirm infrastructure readiness including network, servers, and dependencies",
      "configuration_review": "Validate all Portnox configurations against requirements and best practices",
      "integration_testing": "Report integration testing results with existing systems and applications",
      "security_validation": "Confirm security controls are properly configured and functioning",
      "performance_testing": "Report performance testing results and capacity validation",
      "backup_procedures": "Confirm backup procedures are in place and tested",
      "rollback_plan": "Detail rollback procedures and validation of rollback capability",
      "team_readiness": "Assess team training completion and operational readiness",
      "go_no_go_decision": "Provide clear go/no-go recommendation with supporting criteria"
    }
  }',
  '["pre-deployment", "validation", "checklist", "go-no-go", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- MILESTONE TEMPLATES
(
  'Project Milestone Achievement Report',
  'Detailed milestone completion report with lessons learned and next phase planning',
  'milestones',
  'achievement',
  '{
    "sections": [
      {"id": "milestone_summary", "title": "Milestone Summary", "required": true},
      {"id": "objectives_achieved", "title": "Objectives Achieved", "required": true},
      {"id": "deliverables_completed", "title": "Deliverables Completed", "required": true},
      {"id": "timeline_analysis", "title": "Timeline Analysis", "required": true},
      {"id": "budget_analysis", "title": "Budget Analysis", "required": true},
      {"id": "quality_metrics", "title": "Quality Metrics & KPIs", "required": true},
      {"id": "challenges_overcome", "title": "Challenges Overcome", "required": true},
      {"id": "lessons_learned", "title": "Lessons Learned", "required": true},
      {"id": "next_phase_planning", "title": "Next Phase Planning", "required": true}
    ]
  }',
  '{
    "milestone_name": {"type": "string", "required": true, "description": "Milestone name"},
    "completion_date": {"type": "date", "required": true, "description": "Actual completion date"},
    "planned_completion_date": {"type": "date", "required": true, "description": "Originally planned completion date"},
    "milestone_phase": {"type": "string", "required": true, "description": "Project phase (initiation, planning, execution, etc.)"},
    "budget_allocated": {"type": "number", "required": false, "description": "Budget allocated for this milestone"},
    "budget_used": {"type": "number", "required": false, "description": "Actual budget used"},
    "quality_score": {"type": "number", "required": false, "description": "Quality score (1-10)"},
    "stakeholder_satisfaction": {"type": "number", "required": false, "description": "Stakeholder satisfaction (1-10)"},
    "team_members": {"type": "array", "required": true, "description": "Team members involved"}
  }',
  '{
    "system_prompt": "Generate a comprehensive milestone achievement report for Portnox project. Focus on accomplishments, lessons learned, and preparation for next phase.",
    "sections": {
      "milestone_summary": "Provide overview of milestone significance and context within overall project",
      "objectives_achieved": "Detail specific objectives achieved with measurable outcomes",
      "deliverables_completed": "List all deliverables completed with quality assessment",
      "timeline_analysis": "Analyze timeline performance including delays and accelerations",
      "budget_analysis": "Review budget performance and resource utilization efficiency",
      "quality_metrics": "Report quality metrics and KPI achievement",
      "challenges_overcome": "Document significant challenges and how they were resolved",
      "lessons_learned": "Capture key lessons learned for future milestone execution",
      "next_phase_planning": "Outline preparation and planning for subsequent project phases"
    }
  }',
  '["milestone", "achievement", "project-tracking", "lessons-learned", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- GO-LIVE TEMPLATES
(
  'Go-Live Success Report',
  'Comprehensive go-live execution report with performance metrics and post-deployment assessment',
  'go-live',
  'success-report',
  '{
    "sections": [
      {"id": "go_live_summary", "title": "Go-Live Summary", "required": true},
      {"id": "deployment_execution", "title": "Deployment Execution", "required": true},
      {"id": "system_performance", "title": "System Performance Metrics", "required": true},
      {"id": "user_adoption", "title": "User Adoption & Feedback", "required": true},
      {"id": "issue_resolution", "title": "Issues & Resolution", "required": true},
      {"id": "business_impact", "title": "Business Impact Assessment", "required": true},
      {"id": "compliance_validation", "title": "Compliance Validation", "required": true},
      {"id": "support_transition", "title": "Support Transition", "required": true},
      {"id": "optimization_opportunities", "title": "Optimization Opportunities", "required": true}
    ]
  }',
  '{
    "go_live_date": {"type": "date", "required": true, "description": "Actual go-live date"},
    "deployment_duration": {"type": "number", "required": true, "description": "Deployment duration in hours"},
    "systems_deployed": {"type": "array", "required": true, "description": "Systems successfully deployed"},
    "users_onboarded": {"type": "number", "required": true, "description": "Number of users onboarded"},
    "devices_authenticated": {"type": "number", "required": true, "description": "Number of devices successfully authenticated"},
    "performance_baseline": {"type": "object", "required": false, "description": "Performance baseline metrics"},
    "critical_issues": {"type": "number", "required": true, "description": "Number of critical issues encountered"},
    "business_downtime": {"type": "number", "required": true, "description": "Business downtime in minutes"},
    "rollback_executed": {"type": "boolean", "required": true, "description": "Whether rollback was executed"}
  }',
  '{
    "system_prompt": "Generate a comprehensive go-live success report for Portnox NAC deployment. Focus on execution quality, performance achievements, and business value delivery.",
    "sections": {
      "go_live_summary": "Summarize go-live execution including timeline, scope, and overall success",
      "deployment_execution": "Detail deployment execution process including activities and timeline adherence",
      "system_performance": "Report system performance metrics and comparison to baseline expectations",
      "user_adoption": "Assess user adoption rates and feedback on the new NAC solution",
      "issue_resolution": "Document all issues encountered and resolution effectiveness",
      "business_impact": "Quantify business impact including security improvements and operational benefits",
      "compliance_validation": "Confirm compliance requirements are being met post-deployment",
      "support_transition": "Report on support transition and operational handover",
      "optimization_opportunities": "Identify opportunities for performance and efficiency optimization"
    }
  }',
  '["go-live", "deployment", "success", "performance", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- SCOPING TEMPLATES
(
  'Comprehensive Project Scoping Report',
  'Detailed project scoping assessment with requirements analysis and solution design',
  'scoping',
  'analysis',
  '{
    "sections": [
      {"id": "business_requirements", "title": "Business Requirements Analysis", "required": true},
      {"id": "technical_requirements", "title": "Technical Requirements", "required": true},
      {"id": "current_state_assessment", "title": "Current State Assessment", "required": true},
      {"id": "gap_analysis", "title": "Gap Analysis", "required": true},
      {"id": "solution_design", "title": "Proposed Solution Design", "required": true},
      {"id": "implementation_approach", "title": "Implementation Approach", "required": true},
      {"id": "resource_estimation", "title": "Resource Estimation", "required": true},
      {"id": "timeline_projection", "title": "Timeline Projection", "required": true},
      {"id": "risk_assessment", "title": "Risk Assessment", "required": true},
      {"id": "investment_analysis", "title": "Investment Analysis", "required": true}
    ]
  }',
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
  '{
    "system_prompt": "Generate a comprehensive project scoping report for Portnox NAC implementation. Focus on requirements analysis, solution fit, and implementation roadmap.",
    "sections": {
      "business_requirements": "Analyze business requirements including security goals, compliance needs, and operational objectives",
      "technical_requirements": "Detail technical requirements including infrastructure, integration, and performance needs",
      "current_state_assessment": "Assess current security infrastructure and identify existing capabilities",
      "gap_analysis": "Identify gaps between current state and desired future state",
      "solution_design": "Propose Portnox solution design tailored to customer requirements",
      "implementation_approach": "Outline recommended implementation approach and methodology",
      "resource_estimation": "Estimate required resources including personnel, hardware, and services",
      "timeline_projection": "Project implementation timeline with key milestones",
      "risk_assessment": "Identify implementation risks and mitigation strategies",
      "investment_analysis": "Provide investment analysis including ROI and business case"
    }
  }',
  '["scoping", "requirements", "analysis", "solution-design", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- SECURITY & COMPLIANCE TEMPLATES
(
  'Security Posture Assessment Report',
  'Comprehensive security posture assessment with Portnox NAC impact analysis',
  'security',
  'assessment',
  '{
    "sections": [
      {"id": "security_overview", "title": "Security Overview", "required": true},
      {"id": "threat_landscape", "title": "Threat Landscape Analysis", "required": true},
      {"id": "current_controls", "title": "Current Security Controls", "required": true},
      {"id": "vulnerability_assessment", "title": "Vulnerability Assessment", "required": true},
      {"id": "nac_security_benefits", "title": "NAC Security Benefits", "required": true},
      {"id": "compliance_impact", "title": "Compliance Impact", "required": true},
      {"id": "risk_mitigation", "title": "Risk Mitigation Strategies", "required": true},
      {"id": "security_metrics", "title": "Security Metrics & KPIs", "required": true},
      {"id": "recommendations", "title": "Security Recommendations", "required": true}
    ]
  }',
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
  '{
    "system_prompt": "Generate a comprehensive security posture assessment report focusing on how Portnox NAC will enhance the organization security posture.",
    "sections": {
      "security_overview": "Provide overview of current security posture and key challenges",
      "threat_landscape": "Analyze relevant threat landscape and attack vectors for the organization",
      "current_controls": "Assess effectiveness of current security controls and technologies",
      "vulnerability_assessment": "Identify security vulnerabilities and exposure areas",
      "nac_security_benefits": "Detail how Portnox NAC will address identified security gaps",
      "compliance_impact": "Analyze compliance impact and how NAC supports compliance objectives",
      "risk_mitigation": "Outline risk mitigation strategies enabled by NAC implementation",
      "security_metrics": "Define security metrics and KPIs to measure improvement",
      "recommendations": "Provide actionable security recommendations beyond NAC implementation"
    }
  }',
  '["security", "assessment", "posture", "compliance", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
),

-- RECOMMENDATIONS & BEST PRACTICES
(
  'Best Practices & Optimization Report',
  'Comprehensive best practices guide and optimization recommendations for Portnox deployment',
  'best-practices',
  'optimization',
  '{
    "sections": [
      {"id": "deployment_best_practices", "title": "Deployment Best Practices", "required": true},
      {"id": "configuration_optimization", "title": "Configuration Optimization", "required": true},
      {"id": "performance_tuning", "title": "Performance Tuning Recommendations", "required": true},
      {"id": "security_hardening", "title": "Security Hardening Guidelines", "required": true},
      {"id": "operational_excellence", "title": "Operational Excellence", "required": true},
      {"id": "monitoring_alerting", "title": "Monitoring & Alerting Best Practices", "required": true},
      {"id": "troubleshooting_guide", "title": "Troubleshooting Guide", "required": true},
      {"id": "maintenance_procedures", "title": "Maintenance Procedures", "required": true},
      {"id": "continuous_improvement", "title": "Continuous Improvement Plan", "required": true}
    ]
  }',
  '{
    "deployment_phase": {"type": "string", "required": true, "description": "Current deployment phase"},
    "environment_type": {"type": "string", "required": true, "description": "Environment type (production, staging, pilot)"},
    "performance_baseline": {"type": "object", "required": false, "description": "Performance baseline metrics"},
    "optimization_goals": {"type": "array", "required": true, "description": "Optimization goals"},
    "compliance_requirements": {"type": "array", "required": false, "description": "Compliance requirements"},
    "operational_maturity": {"type": "string", "required": true, "description": "Operational maturity level"},
    "team_expertise": {"type": "string", "required": true, "description": "Team expertise level"},
    "automation_level": {"type": "string", "required": true, "description": "Current automation level"},
    "business_criticality": {"type": "string", "required": true, "description": "Business criticality level"}
  }',
  '{
    "system_prompt": "Generate comprehensive best practices and optimization recommendations for Portnox NAC deployment and operations.",
    "sections": {
      "deployment_best_practices": "Outline deployment best practices specific to the environment and requirements",
      "configuration_optimization": "Provide configuration optimization recommendations for performance and security",
      "performance_tuning": "Detail performance tuning strategies and recommendations",
      "security_hardening": "Provide security hardening guidelines and best practices",
      "operational_excellence": "Outline operational excellence practices for ongoing management",
      "monitoring_alerting": "Define monitoring and alerting best practices and recommended metrics",
      "troubleshooting_guide": "Provide troubleshooting guide for common issues and resolutions",
      "maintenance_procedures": "Detail recommended maintenance procedures and schedules",
      "continuous_improvement": "Outline continuous improvement plan and optimization cycles"
    }
  }',
  '["best-practices", "optimization", "recommendations", "operations", "portnox"]',
  true,
  '00000000-0000-0000-0000-000000000000'
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_templates_category ON public.report_templates(category);
CREATE INDEX IF NOT EXISTS idx_report_templates_template_type ON public.report_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_report_templates_tags ON public.report_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_report_templates_active ON public.report_templates(is_active) WHERE is_active = true;