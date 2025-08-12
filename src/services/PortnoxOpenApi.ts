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
    let data: any = null;
    try {
      data = await PortnoxApiService.proxy("GET", "/doc", undefined, undefined, opts);
    } catch (_) {}
    let spec = (data?.data ?? data) as OpenApiSpec;
    if (!spec || (!spec.swagger && !spec.openapi)) {
      // Fallback to /restapi/doc (served on some deployments)
      let alt: any = null;
      try {
        alt = await PortnoxApiService.proxy("GET", "/restapi/doc", undefined, undefined, opts);
      } catch (_) {}
      const altSpec = (alt?.data ?? alt) as OpenApiSpec;
      if (!altSpec || (!altSpec.swagger && !altSpec.openapi)) {
        throw new Error("Failed to load Portnox OpenAPI spec from /doc or /restapi/doc");
      }
      spec = altSpec;
    }
    this.cache = spec;
    return spec;
  }

  static clearCache() {
    this.cache = null;
  }
}
