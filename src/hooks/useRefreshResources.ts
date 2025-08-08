import { useQueryClient } from '@tanstack/react-query';

export const useRefreshResources = () => {
  const queryClient = useQueryClient();

  const keys: (string | string[])[] = [
    'vendors',
    'enhanced-vendors',
    'vendor-models',
    'device-types',
    'industry-options',
    'compliance-frameworks',
    'deployment-types',
    'business-domains',
    'authentication-methods',
    'project-phases',
    'network-segments',
    'use-cases',
    'requirements',
    'resource-tags',
    'resource-categories',
  ];

  const refreshAll = () => {
    keys.forEach((k) => {
      queryClient.invalidateQueries({ queryKey: Array.isArray(k) ? k : [k] });
      queryClient.refetchQueries({ queryKey: Array.isArray(k) ? k : [k], type: 'active' });
    });
  };

  return { refreshAll };
};
