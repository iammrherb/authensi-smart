// Common interfaces and utilities for network configuration templates

export interface BaseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  vendor: string;
  model: string;
  firmware: string;
  content: string;
  complexity_level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimated_time: string; // e.g., "15 minutes", "1 hour"
  prerequisites: string[];
  post_deployment_tasks: string[];
  variables: TemplateVariable[];
  tags: string[];
  use_cases: string[];
  requirements: string[];
  compatibility_matrix: CompatibilityInfo[];
  troubleshooting: TroubleshootingItem[];
  validation_commands: ValidationCommand[];
  references: Reference[];
  created_date: string;
  updated_date: string;
  version: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'ip' | 'password' | 'multiselect' | 'json' | 'certificate';
  description: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  options?: string[];
  validation?: ValidationRule;
  placeholder?: string;
  helpText?: string;
  group?: string; // For organizing variables into groups
  dependencies?: VariableDependency[];
}

export interface ValidationRule {
  pattern?: string; // Regex pattern
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  customValidator?: string; // Custom validation function name
  errorMessage?: string;
}

export interface VariableDependency {
  variable: string;
  condition: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | boolean;
  action: 'show' | 'hide' | 'require' | 'optional';
}

export interface CompatibilityInfo {
  model: string;
  firmware_min: string;
  firmware_max?: string;
  feature_support: FeatureSupport[];
  limitations?: string[];
  notes?: string;
}

export interface FeatureSupport {
  feature: string;
  supported: boolean;
  version_introduced?: string;
  notes?: string;
}

export interface TroubleshootingItem {
  issue: string;
  symptoms?: string[];
  solution: string;
  commands?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  common_causes?: string[];
  prevention_tips?: string[];
}

export interface ValidationCommand {
  command: string;
  description: string;
  expected_output?: string;
  success_criteria: string;
  failure_indicators?: string[];
  category: 'connectivity' | 'authentication' | 'authorization' | 'configuration' | 'performance';
}

export interface Reference {
  title: string;
  url: string;
  type: 'documentation' | 'kb' | 'guide' | 'video' | 'blog' | 'whitepaper';
  vendor_official: boolean;
  description?: string;
}

// Template categories
export const TEMPLATE_CATEGORIES = {
  AUTHENTICATION: 'Authentication',
  AUTHORIZATION: 'Authorization', 
  NETWORK_ACCESS: 'Network Access Control',
  SECURITY: 'Security',
  MANAGEMENT: 'Management',
  MONITORING: 'Monitoring',
  QOS: 'Quality of Service',
  ROUTING: 'Routing',
  SWITCHING: 'Switching',
  WIRELESS: 'Wireless',
  VPN: 'VPN',
  FIREWALL: 'Firewall'
} as const;

// Complexity levels with descriptions
export const COMPLEXITY_LEVELS = {
  basic: {
    level: 'basic',
    description: 'Basic configuration suitable for beginners',
    time_estimate: '15-30 minutes',
    skill_level: 'Beginner'
  },
  intermediate: {
    level: 'intermediate', 
    description: 'Standard configuration requiring network knowledge',
    time_estimate: '30-60 minutes',
    skill_level: 'Intermediate'
  },
  advanced: {
    level: 'advanced',
    description: 'Complex configuration with multiple features',
    time_estimate: '1-2 hours', 
    skill_level: 'Advanced'
  },
  expert: {
    level: 'expert',
    description: 'Expert-level configuration with custom integrations',
    time_estimate: '2+ hours',
    skill_level: 'Expert'
  }
} as const;

// Common validation patterns
export const VALIDATION_PATTERNS = {
  IPV4: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
  IPV6: '^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$',
  MAC_ADDRESS: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
  HOSTNAME: '^[a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?$',
  VLAN_ID: '^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-3][0-9][0-9][0-9]|40[0-8][0-9]|409[0-4])$',
  PORT_RANGE: '^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-5][0-9][0-9][0-9][0-9]|6[0-4][0-9][0-9][0-9]|65[0-4][0-9][0-9]|655[0-2][0-9]|6553[0-5])$'
} as const;

// Common variable groups
export const VARIABLE_GROUPS = {
  BASIC: 'Basic Configuration',
  NETWORK: 'Network Settings',
  AUTHENTICATION: 'Authentication Settings',
  AUTHORIZATION: 'Authorization Settings', 
  SECURITY: 'Security Settings',
  MANAGEMENT: 'Management Settings',
  ADVANCED: 'Advanced Settings',
  TROUBLESHOOTING: 'Troubleshooting Settings'
} as const;

// Utility functions
export function validateTemplate(template: BaseTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation
  if (!template.id) errors.push('Template ID is required');
  if (!template.name) errors.push('Template name is required');
  if (!template.vendor) errors.push('Vendor is required');
  if (!template.model) errors.push('Model is required');
  if (!template.content) errors.push('Template content is required');
  
  // Variable validation
  template.variables.forEach((variable, index) => {
    if (!variable.name) errors.push(`Variable ${index} missing name`);
    if (!variable.type) errors.push(`Variable ${variable.name} missing type`);
    if (!variable.description) errors.push(`Variable ${variable.name} missing description`);
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function getTemplatesByVendor(templates: BaseTemplate[], vendor: string): BaseTemplate[] {
  return templates.filter(t => t.vendor.toLowerCase() === vendor.toLowerCase());
}

export function getTemplatesByCategory(templates: BaseTemplate[], category: string): BaseTemplate[] {
  return templates.filter(t => t.category === category);
}

export function getTemplatesByComplexity(templates: BaseTemplate[], complexity: string): BaseTemplate[] {
  return templates.filter(t => t.complexity_level === complexity);
}

export function searchTemplates(templates: BaseTemplate[], query: string): BaseTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowercaseQuery) ||
    t.description.toLowerCase().includes(lowercaseQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    t.use_cases.some(useCase => useCase.toLowerCase().includes(lowercaseQuery))
  );
}