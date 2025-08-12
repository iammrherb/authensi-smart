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
    let spec: OpenApiSpec | null = null;
    try {
      const s = await PortnoxApiService.fetchOpenApiSpec();
      spec = (s?.data ?? s) as OpenApiSpec;
    } catch (e) {
      console.error("Failed to fetch OpenAPI spec from edge function", e);
    }

    if (!spec || (!spec.swagger && !spec.openapi)) {
      throw new Error("Failed to load Portnox OpenAPI spec from https://clear.portnox.com/restapi/doc");
    }
    this.cache = spec;
    return spec;
  }

  static clearCache() {
    this.cache = null;
  }
}
