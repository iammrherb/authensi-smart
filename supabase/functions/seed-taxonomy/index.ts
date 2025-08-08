// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SeedRequest {
  datasets?: Array<
    | "authentication_methods"
    | "device_types"
    | "business_domains"
    | "deployment_types"
    | "industry_options"
    | "network_segments"
    | "compliance_frameworks"
  >;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Only super_admins can trigger seeding
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "super_admin",
      _scope_type: "global",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body: SeedRequest = await req.json().catch(() => ({}));
    const requested = new Set(
      (body.datasets && body.datasets.length
        ? body.datasets
        : [
            "authentication_methods",
            "device_types",
            "business_domains",
            "deployment_types",
            "industry_options",
            "network_segments",
            "compliance_frameworks",
          ]) as string[]
    );

    // Curated taxonomy datasets (concise but representative)
    const authenticationMethods = [
      {
        name: "EAP-TLS",
        method_type: "802.1X",
        description: "Certificate-based authentication for wired/wireless 802.1X.",
        security_level: "high",
        configuration_complexity: "high",
        tags: ["802.1X", "certificates", "mutual-auth"],
        vendor_support: ["Cisco", "Aruba", "Juniper", "Extreme", "Ruckus"],
        documentation_links: [
          "https://datatracker.ietf.org/doc/html/rfc5216",
          "https://www.cisco.com/c/en/us/support/docs/security-vpn/802-1x/",
        ],
      },
      {
        name: "PEAP-MSCHAPv2",
        method_type: "802.1X",
        description: "Tunnelled password-based EAP method.",
        security_level: "medium",
        configuration_complexity: "medium",
        tags: ["password", "tunnel", "802.1X"],
        vendor_support: ["Cisco", "Aruba", "Ubiquiti"],
        documentation_links: [
          "https://datatracker.ietf.org/doc/html/draft-josefsson-pppext-eap-tls-eap",
        ],
      },
      {
        name: "EAP-TTLS",
        method_type: "802.1X",
        description: "Tunnelled EAP supporting multiple inner methods.",
        security_level: "medium",
        configuration_complexity: "medium",
        tags: ["tunnel", "pluggable"],
        vendor_support: ["Aruba", "FreeRADIUS"],
        documentation_links: ["https://datatracker.ietf.org/doc/html/rfc5281"],
      },
      {
        name: "MAC Authentication Bypass (MAB)",
        method_type: "RADIUS",
        description: "Fallback based on device MAC address for non-802.1X devices.",
        security_level: "low",
        configuration_complexity: "low",
        tags: ["fallback", "iot", "printers"],
        vendor_support: ["Cisco", "Aruba", "Juniper", "Extreme"],
        documentation_links: [],
      },
      {
        name: "RADSEC",
        method_type: "RADIUS",
        description: "RADIUS over TLS for secure proxying.",
        security_level: "high",
        configuration_complexity: "medium",
        tags: ["proxy", "tls", "eduroam"],
        vendor_support: ["Cisco", "Aruba", "FreeRADIUS", "Portnox"],
        documentation_links: ["https://datatracker.ietf.org/doc/html/rfc6614"],
      },
      {
        name: "TACACS+ (Device Admin)",
        method_type: "TACACS+",
        description: "Centralized admin authentication/authorization for network devices.",
        security_level: "high",
        configuration_complexity: "medium",
        tags: ["aaa", "device-admin", "privilege-levels"],
        vendor_support: ["Cisco", "Aruba", "Juniper"],
        documentation_links: [],
      },
    ];

    const deviceTypes = [
      { device_name: "Windows Workstation", manufacturer: "Microsoft", category: "Endpoint", description: "Windows 10/11 enterprise PCs", documentation_links: [] },
      { device_name: "macOS Device", manufacturer: "Apple", category: "Endpoint", description: "macOS endpoints", documentation_links: [] },
      { device_name: "iOS Device", manufacturer: "Apple", category: "Mobile", description: "iPhone/iPad managed via MDM", documentation_links: [] },
      { device_name: "Android Device", manufacturer: "Various", category: "Mobile", description: "Android devices with work profile", documentation_links: [] },
      { device_name: "Network Switch", manufacturer: "Cisco", category: "Network", description: "Managed L2/L3 switch", documentation_links: [] },
      { device_name: "Wireless Access Point", manufacturer: "Aruba", category: "Network", description: "Enterprise Wi‑Fi AP", documentation_links: [] },
      { device_name: "Router", manufacturer: "Juniper", category: "Network", description: "WAN edge router", documentation_links: [] },
      { device_name: "Printer", manufacturer: "HP", category: "IoT", description: "Enterprise network printer", documentation_links: [] },
      { device_name: "IP Camera", manufacturer: "Axis", category: "IoT", description: "Surveillance camera", documentation_links: [] },
      { device_name: "IP Phone", manufacturer: "Cisco", category: "IoT", description: "VoIP handset", documentation_links: [] },
    ];

    const businessDomains = [
      { name: "Financial Services", description: "Banking, insurance, capital markets", tags: ["PCI-DSS", "SOX"] },
      { name: "Healthcare", description: "Hospitals, clinics, pharma", tags: ["HIPAA", "FDA"] },
      { name: "Manufacturing", description: "Industrial and OT environments", tags: ["IEC 62443", "NIST"] },
      { name: "Retail", description: "Stores and e-commerce", tags: ["PCI-DSS"] },
      { name: "Public Sector", description: "Government agencies", tags: ["FISMA", "FedRAMP"] },
    ];

    const deploymentTypes = [
      { name: "Greenfield", description: "New environment deployment", complexity_level: "low", tags: ["new"] },
      { name: "Phased Rollout", description: "Wave-based deployment across sites", complexity_level: "medium", tags: ["phased"] },
      { name: "Pilot then Rollout", description: "Pilot group prior to full rollout", complexity_level: "medium", tags: ["pilot"] },
      { name: "Global Program", description: "Enterprise multi-region deployment", complexity_level: "high", tags: ["global"] },
    ];

    const industryOptions = [
      { name: "Banking", category: "financial", description: "Retail and commercial banking" },
      { name: "Healthcare Provider", category: "healthcare", description: "Hospitals and clinics" },
      { name: "Pharmaceuticals", category: "healthcare", description: "Drug manufacturing" },
      { name: "Manufacturing", category: "industrial", description: "Discrete/process manufacturing" },
      { name: "Retail", category: "commerce", description: "Brick-and-mortar and online" },
      { name: "Government", category: "public", description: "Federal/state/local agencies" },
    ];

    const networkSegments = [
      { name: "User VLAN", segment_type: "access", description: "End-user devices", security_requirements: ["802.1X", "DACLs"], tags: ["endpoint"] },
      { name: "Guest VLAN", segment_type: "guest", description: "Internet-only guest access", security_requirements: ["Captive Portal"], tags: ["guest"] },
      { name: "IoT VLAN", segment_type: "iot", description: "Printers, cameras, sensors", security_requirements: ["MAB", "Segmentation"], tags: ["iot"] },
      { name: "Management VLAN", segment_type: "mgmt", description: "Device management plane", security_requirements: ["TACACS+", "SSH"], tags: ["mgmt"] },
      { name: "Voice VLAN", segment_type: "voice", description: "IP telephony", security_requirements: ["QOS", "DHCP option 150"], tags: ["voice"] },
    ];

    const complianceFrameworks = [
      { name: "PCI-DSS", description: "Payment Card Industry Data Security Standard", tags: ["cardholder-data"], requirements: [] },
      { name: "HIPAA", description: "Health Insurance Portability and Accountability Act", tags: ["phi"], requirements: [] },
      { name: "ISO 27001", description: "Information Security Management", tags: ["isms"], requirements: [] },
      { name: "NIST 800-53", description: "Security and Privacy Controls for Federal Systems", tags: ["fisma"], requirements: [] },
      { name: "IEC 62443", description: "Industrial communication networks – IT security", tags: ["ot"], requirements: [] },
    ];

    async function seedByName(table: string, items: any[], uniqueField: string, addCreatedBy = false) {
      if (!items.length) return { inserted: 0, skipped: 0 };

      const { data: existing, error: readErr } = await admin
        .from(table)
        .select(uniqueField);
      if (readErr) throw readErr;

      const existingSet = new Set(
        (existing || []).map((r: any) => (r as any)[uniqueField]?.toString().toLowerCase())
      );

      const toInsert = items
        .filter((i) => !existingSet.has((i as any)[uniqueField]?.toString().toLowerCase()))
        .map((i) => (addCreatedBy ? { ...i, created_by: user.id } : i));

      if (toInsert.length === 0) return { inserted: 0, skipped: items.length };

      const { error: insErr } = await admin.from(table).insert(toInsert);
      if (insErr) throw insErr;
      return { inserted: toInsert.length, skipped: items.length - toInsert.length };
    }

    const summary: Record<string, { inserted: number; skipped: number }> = {};

    if (requested.has("authentication_methods")) {
      summary.authentication_methods = await seedByName(
        "authentication_methods",
        authenticationMethods,
        "name"
      );
    }

    if (requested.has("device_types")) {
      summary.device_types = await seedByName(
        "device_types",
        deviceTypes,
        "device_name",
        true
      );
    }

    if (requested.has("business_domains")) {
      summary.business_domains = await seedByName(
        "business_domains",
        businessDomains,
        "name"
      );
    }

    if (requested.has("deployment_types")) {
      summary.deployment_types = await seedByName(
        "deployment_types",
        deploymentTypes,
        "name"
      );
    }

    if (requested.has("industry_options")) {
      summary.industry_options = await seedByName(
        "industry_options",
        industryOptions,
        "name"
      );
    }

    if (requested.has("network_segments")) {
      summary.network_segments = await seedByName(
        "network_segments",
        networkSegments,
        "name"
      );
    }

    if (requested.has("compliance_frameworks")) {
      summary.compliance_frameworks = await seedByName(
        "compliance_frameworks",
        complianceFrameworks,
        "name"
      );
    }

    return new Response(
      JSON.stringify({ success: true, summary }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Seed taxonomy error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
