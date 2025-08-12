import { PortnoxApiService } from "./PortnoxApiService";

export interface OpenApiSpec {
  swagger?: string;
  openapi?: string;
  info?: any;
  paths?: Record<string, any>;
  tags?: Array<{ name: string; description?: string }>;
}

export class PortnoxOpenApi {
  private static cache: OpenApiSpec | null = null;

  static async fetchSpec(opts?: { projectId?: string; credentialId?: string }): Promise<OpenApiSpec> {
    if (this.cache) return this.cache;
    // Try fetching spec from public endpoint via edge function
    let spec: OpenApiSpec | null = null;
    try {
      const s = await PortnoxApiService.fetchOpenApiSpec();
      spec = (s?.data ?? s) as OpenApiSpec;
    } catch (_) {}

    if (!spec || (!spec.swagger && !spec.openapi)) {
      // Try the backend's /doc relative to base (for on-prem variations)
      try {
        const data = await PortnoxApiService.proxy("GET", "/doc", undefined, undefined, opts);
        spec = (data?.data ?? data) as OpenApiSpec;
      } catch (_) {}
    }

    if (!spec || (!spec.swagger && !spec.openapi)) {
      throw new Error("Failed to load Portnox OpenAPI spec");
    }
    this.cache = spec;
    return spec;
  }

  static clearCache() {
    this.cache = null;
  }
}
