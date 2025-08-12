import { supabase } from "@/integrations/supabase/client";

export class PortnoxApiService {
  static async testConnection(opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "test", projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data;
  }

  static async listDevices(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listDevices", query: params ?? {}, projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async listSites(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listSites", query: params ?? {}, projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async listGroups(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listGroups", query: params ?? {}, projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createSite(site: { name: string; description?: string }, opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "createSite", body: site, projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createNAS(nas: { name: string; ip?: string; description?: string }, opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "createNAS", body: nas, projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async proxy(method: string, path: string, query?: Record<string, any>, body?: any, opts?: { projectId?: string; credentialId?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method, path, query, body, projectId: opts?.projectId, credentialId: opts?.credentialId },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async fetchOpenApiSpec() {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "fetchSpec" },
    });
    if (error) throw error;
    return data?.data || data;
  }
}
