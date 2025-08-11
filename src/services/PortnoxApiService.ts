import { supabase } from "@/integrations/supabase/client";

export class PortnoxApiService {
  static async testConnection() {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "test" },
    });
    if (error) throw error;
    return data;
  }

  static async listDevices(params?: Record<string, any>) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listDevices", query: params ?? {} },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async listSites(params?: Record<string, any>) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listSites", query: params ?? {} },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async listGroups(params?: Record<string, any>) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listGroups", query: params ?? {} },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createSite(site: { name: string; description?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "createSite", body: site },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createNAS(nas: { name: string; ip?: string; description?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "createNAS", body: nas },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async proxy(method: string, path: string, query?: Record<string, any>, body?: any) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method, path, query, body },
    });
    if (error) throw error;
    return data?.data || data;
  }
}
