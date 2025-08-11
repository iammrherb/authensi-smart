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
    // Try the documented /doc endpoint via our proxy
    const data = await PortnoxApiService.proxy("GET", "/doc", undefined, undefined, opts);
    // Edge returns { status, data }
    const spec = (data?.data ?? data) as OpenApiSpec;
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
