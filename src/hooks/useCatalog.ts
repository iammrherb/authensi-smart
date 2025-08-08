import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CatalogCategoryKey =
  | "wired_wireless"
  | "security"
  | "edr"
  | "siem"
  | "mdr"
  | "mdm"
  | "firewall"
  | "vpn"
  | "idp"
  | "sso"
  | "nac"
  | "pki"
  | "cloud";

export interface CatalogItem {
  id: string;
  category_key: CatalogCategoryKey;
  name: string;
  vendor?: string | null;
  model?: string | null;
  firmware_version?: string | null;
  labels: string[];
  tags: string[];
  metadata: Record<string, any>;
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export const useCatalogCategories = () => {
  return useQuery({
    queryKey: ["catalog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_categories")
        .select("key, name, description, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as { key: CatalogCategoryKey; name: string; description?: string; display_order?: number }[];
    },
  });
};

export const useCatalogItems = (category: CatalogCategoryKey, search?: string) => {
  return useQuery({
    queryKey: ["catalog-items", category, search ?? ""],
    queryFn: async () => {
      let query = supabase
        .from("catalog_items")
        .select("*")
        .eq("category_key", category)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (search && search.trim()) {
        // Basic name filter; could be extended to tags using PostgREST contains
        query = query.ilike("name", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CatalogItem[];
    },
  });
};

export const useCreateCatalogItem = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: Omit<CatalogItem, "id" | "created_at" | "updated_at">) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("catalog_items")
        .insert({
          ...payload,
          created_by: user.data.user?.id,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as CatalogItem;
    },
    onSuccess: (item) => {
      qc.invalidateQueries({ queryKey: ["catalog-items", item.category_key] });
      toast({ title: "Added to catalog", description: `${item.name} saved` });
    },
    onError: () => {
      toast({ title: "Failed to add item", description: "Please try again", variant: "destructive" });
    },
  });
};
