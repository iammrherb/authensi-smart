import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CountryRegion {
  id: string;
  country_code: string;
  country_name: string;
  region_name: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export const useCountriesRegions = () => {
  return useQuery({
    queryKey: ['countries-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries_regions')
        .select('*')
        .order('country_name', { ascending: true })
        .order('region_name', { ascending: true });
      
      if (error) throw error;
      return data as CountryRegion[];
    },
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries_regions')
        .select('country_code, country_name')
        .order('country_name', { ascending: true });
      
      if (error) throw error;
      
      // Remove duplicates
      const uniqueCountries = data.reduce((acc: any[], current) => {
        const exists = acc.find(item => item.country_code === current.country_code);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      return uniqueCountries;
    },
  });
};

export const useRegionsByCountry = (countryCode: string) => {
  return useQuery({
    queryKey: ['regions', countryCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries_regions')
        .select('region_name, timezone')
        .eq('country_code', countryCode)
        .order('region_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!countryCode,
  });
};