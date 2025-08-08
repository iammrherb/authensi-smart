import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ScopingSessionRow {
  id: string;
  name: string;
  status: "draft" | "completed" | "archived" | string;
  data: any;
  created_by: string;
  project_id?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export const useScopingSessions = () => {
  return useQuery({
    queryKey: ["scoping-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scoping_sessions")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ScopingSessionRow[];
    },
  });
};

export const useCreateScopingSession = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: { name: string; data: any; status?: string; project_id?: string | null }) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("scoping_sessions")
        .insert({
          name: payload.name,
          data: payload.data,
          status: payload.status ?? "draft",
          project_id: payload.project_id ?? null,
          created_by: user.data.user?.id,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as ScopingSessionRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scoping-sessions"] });
      toast({ title: "Session saved", description: "Scoping session stored securely." });
    },
  });
};

export const useUpdateScopingSession = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ScopingSessionRow> & { id: string }) => {
      const { data, error } = await supabase
        .from("scoping_sessions")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as ScopingSessionRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scoping-sessions"] });
    },
  });
};

export const useDeleteScopingSession = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scoping_sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scoping-sessions"] });
      toast({ title: "Session deleted" });
    },
  });
};
