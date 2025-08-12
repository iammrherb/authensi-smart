import { BaseTemplate } from './templates/common';
import { fortinetTemplates } from './templates/fortinet';
import { ciscoTemplates } from './templates/cisco';
import { arubaTemplates } from './templates/aruba';

// Unified template system combining all vendor templates
export const unifiedTemplates: BaseTemplate[] = [
  ...fortinetTemplates,
  ...ciscoTemplates,
  ...arubaTemplates
];

// Template statistics and metadata
export const templateStats = {
  total: unifiedTemplates.length,
  byVendor: {
    Fortinet: fortinetTemplates.length,
    Cisco: ciscoTemplates.length,
    Aruba: arubaTemplates.length
  },
  byComplexity: {
    basic: unifiedTemplates.filter(t => t.complexity_level === 'basic').length,
    intermediate: unifiedTemplates.filter(t => t.complexity_level === 'intermediate').length,
    advanced: unifiedTemplates.filter(t => t.complexity_level === 'advanced').length,
    expert: unifiedTemplates.filter(t => t.complexity_level === 'expert').length
  },
  byCategory: unifiedTemplates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};

// Vendor-specific template collections for easy access
export const templatesByVendor = {
  fortinet: fortinetTemplates,
  cisco: ciscoTemplates,
  aruba: arubaTemplates
};

// Category-based template collections
export const templatesByCategory = unifiedTemplates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = [];
  }
  acc[template.category].push(template);
  return acc;
}, {} as Record<string, BaseTemplate[]>);

// Complexity-based template collections
export const templatesByComplexity = {
  basic: unifiedTemplates.filter(t => t.complexity_level === 'basic'),
  intermediate: unifiedTemplates.filter(t => t.complexity_level === 'intermediate'),
  advanced: unifiedTemplates.filter(t => t.complexity_level === 'advanced'),
  expert: unifiedTemplates.filter(t => t.complexity_level === 'expert')
};

// Search and filter utilities
export function searchTemplates(query: string): BaseTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return unifiedTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.vendor.toLowerCase().includes(lowercaseQuery) ||
    template.model.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    template.use_cases.some(useCase => useCase.toLowerCase().includes(lowercaseQuery))
  );
}

export function filterTemplates(filters: {
  vendor?: string;
  category?: string;
  complexity?: string;
  model?: string;
  tags?: string[];
}): BaseTemplate[] {
  return unifiedTemplates.filter(template => {
    if (filters.vendor && template.vendor.toLowerCase() !== filters.vendor.toLowerCase()) {
      return false;
    }
    if (filters.category && template.category !== filters.category) {
      return false;
    }
    if (filters.complexity && template.complexity_level !== filters.complexity) {
      return false;
    }
    if (filters.model && !template.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    if (filters.tags && !filters.tags.some(tag => 
      template.tags.some(templateTag => templateTag.toLowerCase().includes(tag.toLowerCase()))
    )) {
      return false;
    }
    return true;
  });
}

export function getTemplateById(id: string): BaseTemplate | undefined {
  return unifiedTemplates.find(template => template.id === id);
}

export function getCompatibleTemplates(model: string, firmware?: string): BaseTemplate[] {
  return unifiedTemplates.filter(template => {
    // Check if model is compatible
    const modelMatch = template.model.toLowerCase().includes(model.toLowerCase()) ||
                      template.compatibility_matrix.some(compat => 
                        compat.model.toLowerCase().includes(model.toLowerCase())
                      );
    
    if (!modelMatch) return false;
    
    // If firmware is provided, check compatibility
    if (firmware) {
      const compatInfo = template.compatibility_matrix.find(compat => 
        compat.model.toLowerCase().includes(model.toLowerCase())
      );
      if (compatInfo && compatInfo.firmware_min) {
        // Basic version comparison (would need more sophisticated comparison in production)
        return firmware >= compatInfo.firmware_min;
      }
    }
    
    return true;
  });
}

export function getTemplatesByUseCase(useCase: string): BaseTemplate[] {
  return unifiedTemplates.filter(template =>
    template.use_cases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
  );
}

export function getRecommendedTemplates(
  vendor: string,
  model: string,
  useCase: string
): BaseTemplate[] {
  return unifiedTemplates
    .filter(template => {
      const vendorMatch = template.vendor.toLowerCase() === vendor.toLowerCase();
      const modelMatch = template.model.toLowerCase().includes(model.toLowerCase());
      const useCaseMatch = template.use_cases.some(uc => 
        uc.toLowerCase().includes(useCase.toLowerCase())
      );
      
      return vendorMatch && modelMatch && useCaseMatch;
    })
    .sort((a, b) => {
      // Sort by complexity (basic first) and then by name
      const complexityOrder = { basic: 0, intermediate: 1, advanced: 2, expert: 3 };
      const complexityDiff = complexityOrder[a.complexity_level] - complexityOrder[b.complexity_level];
      if (complexityDiff !== 0) return complexityDiff;
      return a.name.localeCompare(b.name);
    });
}

// Template validation utilities
export function validateTemplate(template: BaseTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required field validation
  if (!template.id) errors.push('Template ID is required');
  if (!template.name) errors.push('Template name is required');
  if (!template.vendor) errors.push('Vendor is required');
  if (!template.model) errors.push('Model is required');
  if (!template.content) errors.push('Template content is required');
  if (!template.category) errors.push('Category is required');
  if (!template.complexity_level) errors.push('Complexity level is required');
  
  // Variable validation
  template.variables.forEach((variable, index) => {
    if (!variable.name) errors.push(`Variable ${index + 1}: name is required`);
    if (!variable.type) errors.push(`Variable ${variable.name || index + 1}: type is required`);
    if (!variable.description) errors.push(`Variable ${variable.name || index + 1}: description is required`);
    if (variable.required === undefined) errors.push(`Variable ${variable.name || index + 1}: required field must be specified`);
  });
  
  // Content validation - check for variable placeholders
  const variableNames = template.variables.map(v => v.name);
  const contentVariables = template.content.match(/\{\{([^}]+)\}\}/g) || [];
  const undefinedVariables = contentVariables
    .map(v => v.replace(/[{}]/g, ''))
    .filter(v => !variableNames.includes(v));
  
  if (undefinedVariables.length > 0) {
    errors.push(`Undefined variables in content: ${undefinedVariables.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function getAllVendors(): string[] {
  return [...new Set(unifiedTemplates.map(t => t.vendor))].sort();
}

export function getAllCategories(): string[] {
  return [...new Set(unifiedTemplates.map(t => t.category))].sort();
}

export function getAllTags(): string[] {
  const allTags = unifiedTemplates.flatMap(t => t.tags);
  return [...new Set(allTags)].sort();
}

export function getModelsByVendor(vendor: string): string[] {
  const vendorTemplates = unifiedTemplates.filter(t => 
    t.vendor.toLowerCase() === vendor.toLowerCase()
  );
  return [...new Set(vendorTemplates.map(t => t.model))].sort();
}

// Export everything for backward compatibility and easy access
export * from './templates/common';
export * from './templates/fortinet';
export * from './templates/cisco';
export * from './templates/aruba';

// Default export
export default {
  templates: unifiedTemplates,
  stats: templateStats,
  byVendor: templatesByVendor,
  byCategory: templatesByCategory,
  byComplexity: templatesByComplexity,
  search: searchTemplates,
  filter: filterTemplates,
  getById: getTemplateById,
  getCompatible: getCompatibleTemplates,
  getByUseCase: getTemplatesByUseCase,
  getRecommended: getRecommendedTemplates,
  validate: validateTemplate,
  vendors: getAllVendors(),
  categories: getAllCategories(),
  tags: getAllTags()
};