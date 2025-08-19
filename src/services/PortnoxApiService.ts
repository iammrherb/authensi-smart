import { supabase } from "@/integrations/supabase/client";

export class PortnoxApiService {
  // ===== CONNECTION & HEALTH =====
  static async testConnection(opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "test", projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data;
  }

  static async getSystemInfo(opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/system/info", projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== DEVICE MANAGEMENT =====
  static async listDevices(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listDevices", query: params ?? {}, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getDevice(deviceId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: `/restapi/devices/${deviceId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async updateDevice(deviceId: string, device: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "PUT", path: `/restapi/devices/${deviceId}`, body: device, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async quarantineDevice(deviceId: string, reason?: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: `/restapi/devices/${deviceId}/quarantine`, body: { reason }, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async releaseDevice(deviceId: string, reason?: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: `/restapi/devices/${deviceId}/release`, body: { reason }, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async deleteDevice(deviceId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "DELETE", path: `/restapi/devices/${deviceId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== SITE MANAGEMENT =====
  static async listSites(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listSites", query: params ?? {}, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createSite(site: { name: string; description?: string; location?: string; contactEmail?: string }, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "createSite", body: site, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getSite(siteId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: `/restapi/sites/${siteId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async updateSite(siteId: string, site: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "PUT", path: `/restapi/sites/${siteId}`, body: site, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async deleteSite(siteId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "DELETE", path: `/restapi/sites/${siteId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== NAS DEVICE MANAGEMENT =====
  static async listNASDevices(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/nas", query: params, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createNAS(nas: { name: string; ip?: string; description?: string; vendor?: string; model?: string; sharedSecret?: string }, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "createNAS", body: nas, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getNAS(nasId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: `/restapi/nas/${nasId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async updateNAS(nasId: string, nas: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "PUT", path: `/restapi/nas/${nasId}`, body: nas, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async deleteNAS(nasId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "DELETE", path: `/restapi/nas/${nasId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== USER MANAGEMENT =====
  static async listUsers(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/users", query: params, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createUser(user: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: "/restapi/users", body: user, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getUser(userId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: `/restapi/users/${userId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async updateUser(userId: string, user: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "PUT", path: `/restapi/users/${userId}`, body: user, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async deleteUser(userId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "DELETE", path: `/restapi/users/${userId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== GROUP MANAGEMENT =====
  static async listGroups(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "listGroups", query: params ?? {}, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createGroup(group: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: "/restapi/groups", body: group, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getGroup(groupId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: `/restapi/groups/${groupId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async updateGroup(groupId: string, group: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "PUT", path: `/restapi/groups/${groupId}`, body: group, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async deleteGroup(groupId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "DELETE", path: `/restapi/groups/${groupId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== POLICY MANAGEMENT =====
  static async listPolicies(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/policies", query: params, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createPolicy(policy: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: "/restapi/policies", body: policy, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getPolicy(policyId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: `/restapi/policies/${policyId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async updatePolicy(policyId: string, policy: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "PUT", path: `/restapi/policies/${policyId}`, body: policy, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async deletePolicy(policyId: string, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "DELETE", path: `/restapi/policies/${policyId}`, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== NETWORK CONFIGURATION =====
  static async listVLANs(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/vlans", query: params, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createVLAN(vlan: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: "/restapi/vlans", body: vlan, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== REPORTING & ANALYTICS =====
  static async getReports(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/reports", query: params, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async createReport(report: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "POST", path: "/restapi/reports", body: report, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async getAnalytics(params?: Record<string, any>, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method: "GET", path: "/restapi/analytics", query: params, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl },
    });
    if (error) throw error;
    return data?.data || data;
  }

  // ===== GENERIC PROXY =====
  static async proxy(method: string, path: string, query?: Record<string, any>, body?: any, opts?: { projectId?: string; credentialId?: string; directToken?: string; baseUrl?: string; debug?: boolean }) {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "proxy", method, path, query, body, projectId: opts?.projectId, credentialId: opts?.credentialId, directToken: opts?.directToken, base: opts?.baseUrl, debug: opts?.debug },
    });
    if (error) throw error;
    return data?.data || data;
  }

  static async fetchOpenApiSpec() {
    const { data, error } = await supabase.functions.invoke("portnox-api", {
      body: { action: "fetchSpec" },
    });
    if (error) throw error;
    return data; // return full payload to expose meta
  }
}
