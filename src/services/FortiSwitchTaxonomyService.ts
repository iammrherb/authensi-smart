import { supabase } from "@/integrations/supabase/client";
import { fortinetTemplates } from '../data/templates/fortinet';

export interface FortiSwitchModel {
  vendor_name: string;
  model_name: string;
  model_type: string;
  category: string;
  series: string;
  ports: string;
  stackable: boolean;
  poe: boolean;
  firmware_versions: string[];
  capabilities: string[];
  portnox_integration_level: 'native' | 'certified' | 'compatible' | 'limited';
  configuration_templates: number;
  documentation_links: Array<{
    title: string;
    url: string;
    type: 'setup' | 'api' | 'troubleshooting' | 'best-practices';
  }>;
  last_tested_date: string;
  support_status: 'active' | 'deprecated' | 'end-of-life';
}

export class FortiSwitchTaxonomyService {
  // Comprehensive FortiSwitch model data
  static getFortiSwitchModels(): FortiSwitchModel[] {
    return [
      // FortiSwitch 100 Series - Entry Level
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 108E",
        model_type: "Entry Level Switch",
        category: "Access Switch",
        series: "100 Series",
        ports: "8x GbE",
        stackable: false,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink"],
        portnox_integration_level: 'certified',
        configuration_templates: 8,
        documentation_links: [
          {
            title: "FortiSwitch 108E Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          },
          {
            title: "802.1X Authentication Configuration",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/110300/802-1x-authentication",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 124E",
        model_type: "Entry Level Switch",
        category: "Access Switch",
        series: "100 Series",
        ports: "24x GbE + 4x SFP",
        stackable: false,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Guest VLAN"],
        portnox_integration_level: 'certified',
        configuration_templates: 12,
        documentation_links: [
          {
            title: "FortiSwitch 124E Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 148E",
        model_type: "Entry Level Switch",
        category: "Access Switch",
        series: "100 Series",
        ports: "48x GbE + 4x SFP",
        stackable: false,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Guest VLAN"],
        portnox_integration_level: 'certified',
        configuration_templates: 15,
        documentation_links: [
          {
            title: "FortiSwitch 148E Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      // FortiSwitch 200 Series - Access with PoE
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 224D-FPOE",
        model_type: "Access PoE Switch",
        category: "Access Switch",
        series: "200 Series",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "PoE+", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Stacking", "Guest VLAN"],
        portnox_integration_level: 'certified',
        configuration_templates: 18,
        documentation_links: [
          {
            title: "FortiSwitch 224D Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 248D-FPOE",
        model_type: "Access PoE Switch",
        category: "Access Switch",
        series: "200 Series",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "PoE+", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Stacking", "Guest VLAN"],
        portnox_integration_level: 'certified',
        configuration_templates: 20,
        documentation_links: [
          {
            title: "FortiSwitch 248D Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      // FortiSwitch 400 Series - Distribution/Aggregation
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 424D",
        model_type: "Distribution Switch",
        category: "Distribution Switch",
        series: "400 Series",
        ports: "24x GbE + 4x 10GbE SFP+",
        stackable: true,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "L2/L3", "OSPF", "BGP", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Stacking"],
        portnox_integration_level: 'certified',
        configuration_templates: 25,
        documentation_links: [
          {
            title: "FortiSwitch 424D Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 448D",
        model_type: "Distribution Switch",
        category: "Distribution Switch",
        series: "400 Series",
        ports: "48x GbE + 4x 10GbE SFP+",
        stackable: true,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "L2/L3", "OSPF", "BGP", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Stacking"],
        portnox_integration_level: 'certified',
        configuration_templates: 28,
        documentation_links: [
          {
            title: "FortiSwitch 448D Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      // FortiSwitch 1000 Series - Data Center
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 1024D",
        model_type: "Data Center Switch",
        category: "Core Switch",
        series: "1000 Series",
        ports: "24x 10GbE SFP+ + 2x 40GbE QSFP+",
        stackable: true,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "L2/L3", "VXLAN", "EVPN", "BGP", "OSPF", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Stacking"],
        portnox_integration_level: 'certified',
        configuration_templates: 35,
        documentation_links: [
          {
            title: "FortiSwitch 1024D Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 1048E",
        model_type: "Data Center Switch",
        category: "Core Switch",
        series: "1000 Series",
        ports: "48x 10GbE SFP+ + 6x 40GbE QSFP+",
        stackable: true,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8", "7.2.7"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "L2/L3", "VXLAN", "EVPN", "BGP", "OSPF", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink", "Stacking"],
        portnox_integration_level: 'certified',
        configuration_templates: 40,
        documentation_links: [
          {
            title: "FortiSwitch 1048E Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      },
      // FortiSwitch 3000 Series - High Performance Data Center
      {
        vendor_name: "Fortinet",
        model_name: "FortiSwitch 3032D",
        model_type: "High Performance Data Center Switch",
        category: "Core Switch",
        series: "3000 Series",
        ports: "32x 100GbE QSFP28",
        stackable: false,
        poe: false,
        firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10"],
        capabilities: ["802.1X", "Multi-Auth", "MAB", "L2/L3", "VXLAN", "EVPN", "BGP", "OSPF", "MPLS", "VLAN", "QoS", "LLDP", "Security Fabric", "FortiLink"],
        portnox_integration_level: 'certified',
        configuration_templates: 45,
        documentation_links: [
          {
            title: "FortiSwitch 3032D Admin Guide",
            url: "https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide",
            type: "setup"
          }
        ],
        last_tested_date: "2024-01-15",
        support_status: "active"
      }
    ];
  }

  // Seed FortiSwitch models into vendor_models table
  static async seedFortiSwitchModels(): Promise<{ inserted: number; skipped: number }> {
    console.log("🔧 Seeding FortiSwitch models...");
    let inserted = 0;
    let skipped = 0;

    const models = this.getFortiSwitchModels();

    for (const model of models) {
      try {
        // Check if model already exists
        const { data: existing } = await supabase
          .from('vendor_models')
          .select('id')
          .eq('model_name', model.model_name)
          .maybeSingle();

        if (existing) {
          skipped++;
          continue;
        }

        // Insert new model
        const { error } = await supabase
          .from('vendor_models')
          .insert({
            vendor_id: "fortinet",
            model_name: model.model_name,
            model_series: model.series,
            firmware_versions: model.firmware_versions,
            supported_features: model.capabilities,
            documentation_links: model.documentation_links,
            hardware_specs: {
              series: model.series,
              ports: model.ports,
              stackable: model.stackable,
              poe: model.poe
            }
          });

        if (error) {
          console.error(`Failed to insert model ${model.model_name}:`, error);
          continue;
        }

        inserted++;
      } catch (error) {
        console.error(`Error processing model ${model.model_name}:`, error);
      }
    }

    console.log(`✅ FortiSwitch models: ${inserted} inserted, ${skipped} skipped`);
    return { inserted, skipped };
  }

  // Seed FortiSwitch configuration templates
  static async seedFortiSwitchTemplates(): Promise<{ inserted: number; skipped: number }> {
    console.log("🔧 Seeding FortiSwitch configuration templates...");
    let inserted = 0;
    let skipped = 0;

    for (const template of fortinetTemplates) {
      try {
        // Check if template already exists
        const { data: existing } = await supabase
          .from('configuration_templates')
          .select('id')
          .eq('name', template.name)
          .maybeSingle();

        if (existing) {
          skipped++;
          continue;
        }

        // Insert new template (mapped to unified BaseTemplate)
        const { error } = await supabase
          .from('configuration_templates')
          .insert([
            {
              name: template.name,
              description: template.description,
              category: template.category,
              subcategory: template.subcategory,
              configuration_type: 'CLI',
              complexity_level: template.complexity_level,
              template_content: template.content,
              template_variables: template.variables as any,
              supported_scenarios: template.use_cases as any,
              security_features: template.tags as any,
              troubleshooting_guide: (template.troubleshooting || []).map(t => ({
                issue: t.issue,
                solution: t.solution,
                commands: t.commands || []
              })) as any,
              validation_commands: (template as any).validation_commands || [],
              compatibility_matrix: (template as any).compatibility_matrix || [],
              is_validated: true,
              is_public: true,
              tags: template.tags as any,
              template_source: 'library'
            } as any
          ]);

        if (error) {
          console.error(`Failed to insert template ${template.name}:`, error);
          continue;
        }

        inserted++;
      } catch (error) {
        console.error(`Error processing template ${template.name}:`, error);
      }
    }

    console.log(`✅ FortiSwitch templates: ${inserted} inserted, ${skipped} skipped`);
    return { inserted, skipped };
  }

  // Main seeding function
  static async seedAll(): Promise<{
    models: { inserted: number; skipped: number };
    templates: { inserted: number; skipped: number };
  }> {
    console.log("🚀 Starting FortiSwitch comprehensive seeding...");
    
    const modelResults = await this.seedFortiSwitchModels();
    const templateResults = await this.seedFortiSwitchTemplates();

    console.log("✅ FortiSwitch seeding completed!");
    
    return {
      models: modelResults,
      templates: templateResults
    };
  }
}

export default FortiSwitchTaxonomyService;