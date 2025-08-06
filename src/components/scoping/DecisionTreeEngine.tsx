
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface DecisionRule {
  id: string;
  condition: {
    field: string;
    operator: 'equals' | 'includes' | 'greater_than' | 'exists';
    value: any;
  };
  action: {
    type: 'suggest_pain_point' | 'suggest_use_case' | 'suggest_vendor' | 'suggest_requirement';
    data: any;
  };
}

interface DecisionTreeEngineProps {
  scopingData: any;
  onSuggestion: (suggestion: any) => void;
}

const decisionRules: DecisionRule[] = [
  // Industry-based suggestions
  {
    id: 'healthcare_compliance',
    condition: { field: 'organization.industry', operator: 'equals', value: 'Healthcare' },
    action: { 
      type: 'suggest_pain_point', 
      data: { id: 'hipaa_compliance', title: 'HIPAA Compliance Requirements', category: 'compliance' }
    }
  },
  {
    id: 'finance_security',
    condition: { field: 'organization.industry', operator: 'equals', value: 'Finance' },
    action: { 
      type: 'suggest_use_case', 
      data: { id: 'pci_compliance', name: 'PCI-DSS Compliance', category: 'compliance' }
    }
  },
  
  // Organization size-based suggestions
  {
    id: 'enterprise_byod',
    condition: { field: 'organization.total_users', operator: 'greater_than', value: 1000 },
    action: { 
      type: 'suggest_use_case', 
      data: { id: 'advanced_byod', name: 'Advanced BYOD Management', category: 'access' }
    }
  },
  
  // Vendor-specific suggestions
  {
    id: 'cisco_integration',
    condition: { field: 'vendor_ecosystem.wired_wireless', operator: 'includes', value: 'Cisco' },
    action: { 
      type: 'suggest_vendor', 
      data: { category: 'mfa_solutions', vendor: 'Cisco Duo' }
    }
  },
  {
    id: 'microsoft_ecosystem',
    condition: { field: 'vendor_ecosystem.sso_solutions', operator: 'includes', value: 'Microsoft Azure AD' },
    action: { 
      type: 'suggest_vendor', 
      data: { category: 'edr_solutions', vendor: 'Microsoft Defender' }
    }
  },
  
  // Pain point-based suggestions
  {
    id: 'iot_security_usecase',
    condition: { field: 'organization.pain_points', operator: 'includes', value: 'iot' },
    action: { 
      type: 'suggest_use_case', 
      data: { id: 'iot_device_profiling', name: 'IoT Device Profiling & Control', category: 'security' }
    }
  },
  {
    id: 'visibility_pain_solution',
    condition: { field: 'organization.pain_points', operator: 'includes', value: 'visibility' },
    action: { 
      type: 'suggest_use_case', 
      data: { id: 'network_discovery', name: 'Comprehensive Network Discovery', category: 'foundation' }
    }
  }
];

const DecisionTreeEngine: React.FC<DecisionTreeEngineProps> = ({
  scopingData,
  onSuggestion
}) => {
  const [activeSuggestions, setActiveSuggestions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newSuggestions: any[] = [];

    decisionRules.forEach(rule => {
      const { condition, action } = rule;
      let conditionMet = false;

      // Navigate to the field value
      const fieldValue = getNestedValue(scopingData, condition.field);

      switch (condition.operator) {
        case 'equals':
          conditionMet = fieldValue === condition.value;
          break;
        case 'includes':
          if (Array.isArray(fieldValue)) {
            conditionMet = fieldValue.some((item: any) => 
              typeof item === 'object' ? item.name === condition.value || item.id === condition.value : item === condition.value
            );
          }
          break;
        case 'greater_than':
          conditionMet = Number(fieldValue) > Number(condition.value);
          break;
        case 'exists':
          conditionMet = fieldValue !== undefined && fieldValue !== null;
          break;
      }

      if (conditionMet) {
        newSuggestions.push({
          ...action,
          ruleId: rule.id,
          reason: `Based on ${condition.field}: ${fieldValue}`
        });
      }
    });

    setActiveSuggestions(newSuggestions);
  }, [scopingData]);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const applySuggestion = (suggestion: any) => {
    onSuggestion(suggestion);
    // Remove the applied suggestion
    setActiveSuggestions(prev => prev.filter(s => s.ruleId !== suggestion.ruleId));
  };

  if (activeSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <h4 className="font-semibold text-blue-900">Smart Recommendations</h4>
      </div>
      
      <div className="space-y-2">
        {activeSuggestions.slice(0, 3).map((suggestion, index) => (
          <div key={suggestion.ruleId} className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex-1">
              <div className="font-medium text-sm">
                {suggestion.type === 'suggest_pain_point' && `Pain Point: ${suggestion.data.title}`}
                {suggestion.type === 'suggest_use_case' && `Use Case: ${suggestion.data.name}`}
                {suggestion.type === 'suggest_vendor' && `Vendor: ${suggestion.data.vendor}`}
                {suggestion.type === 'suggest_requirement' && `Requirement: ${suggestion.data.name}`}
              </div>
              <div className="text-xs text-muted-foreground">{suggestion.reason}</div>
            </div>
            <button
              onClick={() => applySuggestion(suggestion)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionTreeEngine;
