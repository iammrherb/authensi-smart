import { supabase } from '@/integrations/supabase/client';

interface VendorModelData {
  vendor_name: string;
  models: {
    model_name: string;
    model_number: string;
    product_line: string;
    category: string;
    specifications: any;
    supported_features: string[];
    lifecycle_status: string;
    firmware_versions: {
      version: string;
      is_latest: boolean;
      is_recommended: boolean;
      new_features: string[];
      known_issues: string[];
    }[];
  }[];
}

interface ComplianceFrameworkData {
  framework_name: string;
  acronym: string;
  controls: {
    control_id: string;
    control_title: string;
    control_description: string;
    control_family: string;
    risk_level: string;
    implementation_guidance: string;
  }[];
}

export class PremiumDataSeeder {
  
  // Comprehensive vendor data with models and firmware
  private static readonly VENDOR_DATA: VendorModelData[] = [
    {
      vendor_name: 'Cisco',
      models: [
        {
          model_name: 'ISE 3.3',
          model_number: 'ISE-3.3',
          product_line: 'Identity Services Engine',
          category: 'nac_appliance',
          specifications: {
            max_endpoints: 500000,
            max_concurrent_sessions: 100000,
            deployment_options: ['Physical', 'Virtual', 'Cloud'],
            high_availability: true,
            clustering_support: true
          },
          supported_features: [
            '802.1X Authentication',
            'MAC Authentication Bypass (MAB)',
            'Web Authentication',
            'Guest Access',
            'BYOD Onboarding',
            'Posture Assessment',
            'TrustSec',
            'pxGrid Integration',
            'TACACS+',
            'Device Profiling',
            'Threat-Centric NAC',
            'API Gateway'
          ],
          lifecycle_status: 'current',
          firmware_versions: [
            {
              version: '3.3.0.430',
              is_latest: true,
              is_recommended: true,
              new_features: [
                'Enhanced Zero Trust workflows',
                'Improved API performance',
                'New compliance dashboard',
                'AI-powered threat detection'
              ],
              known_issues: [
                'Memory leak in large deployments (>100k endpoints)',
                'GUI timeout on complex policy views'
              ]
            },
            {
              version: '3.2.0.542',
              is_latest: false,
              is_recommended: false,
              new_features: [
                'Cloud-native deployment option',
                'Enhanced SAML support'
              ],
              known_issues: [
                'Certificate renewal bug',
                'Performance degradation with >50k MAB devices'
              ]
            }
          ]
        },
        {
          model_name: 'Catalyst 9300',
          model_number: 'C9300-48P',
          product_line: 'Catalyst 9000',
          category: 'switch',
          specifications: {
            ports: 48,
            poe_budget: 740,
            stacking_support: true,
            throughput: '240 Gbps',
            switching_capacity: '480 Gbps'
          },
          supported_features: [
            'Dynamic Segmentation',
            'Encrypted Traffic Analytics',
            'SD-Access',
            'Model-Driven Telemetry',
            'Application Visibility',
            'Flexible NetFlow'
          ],
          lifecycle_status: 'current',
          firmware_versions: [
            {
              version: '17.9.4a',
              is_latest: true,
              is_recommended: true,
              new_features: [
                'Enhanced macro segmentation',
                'Improved PoE efficiency'
              ],
              known_issues: []
            }
          ]
        }
      ]
    },
    {
      vendor_name: 'Aruba',
      models: [
        {
          model_name: 'ClearPass 6.11',
          model_number: 'CP-6.11',
          product_line: 'ClearPass Policy Manager',
          category: 'nac_appliance',
          specifications: {
            max_endpoints: 150000,
            max_concurrent_sessions: 50000,
            deployment_options: ['Physical', 'Virtual'],
            clustering_support: true,
            database: 'PostgreSQL'
          },
          supported_features: [
            '802.1X Authentication',
            'MAC Authentication',
            'Captive Portal',
            'OnGuard Posture',
            'Device Profiling',
            'Guest Management',
            'OnConnect Enforcement',
            'CPPM API',
            'Exchange Integration',
            'AirGroup Support',
            'ClearPass Extensions'
          ],
          lifecycle_status: 'current',
          firmware_versions: [
            {
              version: '6.11.4',
              is_latest: true,
              is_recommended: true,
              new_features: [
                'Enhanced cloud integration',
                'Improved profiling accuracy',
                'New REST API endpoints'
              ],
              known_issues: [
                'Cluster sync delay in large deployments'
              ]
            }
          ]
        }
      ]
    },
    {
      vendor_name: 'Fortinet',
      models: [
        {
          model_name: 'FortiNAC 9.4',
          model_number: 'FNAC-9.4',
          product_line: 'FortiNAC',
          category: 'nac_appliance',
          specifications: {
            max_endpoints: 200000,
            deployment_options: ['Physical', 'Virtual'],
            integration_methods: ['SNMP', 'CLI', 'API', 'Syslog']
          },
          supported_features: [
            'Automated Threat Response',
            'IoT Device Visibility',
            'Network Access Control',
            'Guest Management',
            'BYOD Support',
            'Rogue Device Detection',
            'FortiGate Integration',
            'Zero Trust Network Access'
          ],
          lifecycle_status: 'current',
          firmware_versions: [
            {
              version: '9.4.3',
              is_latest: true,
              is_recommended: true,
              new_features: [
                'Enhanced IoT profiling',
                'Improved FortiGate integration'
              ],
              known_issues: []
            }
          ]
        }
      ]
    },
    {
      vendor_name: 'Portnox',
      models: [
        {
          model_name: 'Portnox CLEAR',
          model_number: 'CLEAR-2024',
          product_line: 'Cloud-Native NAC',
          category: 'cloud_service',
          specifications: {
            deployment: 'Cloud-Native',
            multi_tenancy: true,
            global_presence: true,
            sla: '99.99%'
          },
          supported_features: [
            'Agentless NAC',
            'Cloud-Native Architecture',
            'Risk-Based Access Control',
            'Passwordless Authentication',
            'Device Profiling & Fingerprinting',
            'Automated Remediation',
            'API-First Design',
            'Multi-Cloud Support',
            'Zero Trust Principles',
            'AI-Powered Threat Detection'
          ],
          lifecycle_status: 'current',
          firmware_versions: [
            {
              version: '2024.1',
              is_latest: true,
              is_recommended: true,
              new_features: [
                'AI-powered risk scoring',
                'Enhanced cloud integrations',
                'Passwordless authentication'
              ],
              known_issues: []
            }
          ]
        }
      ]
    }
  ];

  // Comprehensive compliance frameworks
  private static readonly COMPLIANCE_FRAMEWORKS: ComplianceFrameworkData[] = [
    {
      framework_name: 'NIST Cybersecurity Framework',
      acronym: 'NIST CSF',
      controls: [
        {
          control_id: 'ID.AM-1',
          control_title: 'Physical devices and systems inventory',
          control_description: 'Physical devices and systems within the organization are inventoried',
          control_family: 'Asset Management',
          risk_level: 'high',
          implementation_guidance: 'Implement automated discovery and inventory of all network devices'
        },
        {
          control_id: 'PR.AC-1',
          control_title: 'Identity and credential management',
          control_description: 'Identities and credentials are issued, managed, verified, revoked, and audited',
          control_family: 'Identity Management and Access Control',
          risk_level: 'critical',
          implementation_guidance: 'Deploy NAC solution with strong authentication and credential lifecycle management'
        },
        {
          control_id: 'PR.AC-3',
          control_title: 'Remote access management',
          control_description: 'Remote access is managed',
          control_family: 'Identity Management and Access Control',
          risk_level: 'high',
          implementation_guidance: 'Implement VPN with NAC integration for remote access control'
        },
        {
          control_id: 'PR.AC-4',
          control_title: 'Access permissions with least privilege',
          control_description: 'Access permissions and authorizations are managed, incorporating least privilege',
          control_family: 'Identity Management and Access Control',
          risk_level: 'critical',
          implementation_guidance: 'Configure role-based access control with principle of least privilege'
        },
        {
          control_id: 'DE.CM-7',
          control_title: 'Unauthorized device monitoring',
          control_description: 'Monitoring for unauthorized personnel, connections, devices, and software',
          control_family: 'Security Continuous Monitoring',
          risk_level: 'high',
          implementation_guidance: 'Deploy continuous monitoring for rogue devices and unauthorized access'
        }
      ]
    },
    {
      framework_name: 'ISO 27001',
      acronym: 'ISO27001',
      controls: [
        {
          control_id: 'A.9.1.2',
          control_title: 'Access to networks and network services',
          control_description: 'Users should only be provided with access to network services they are authorized to use',
          control_family: 'Access Control',
          risk_level: 'high',
          implementation_guidance: 'Implement network segmentation and access control based on user roles'
        },
        {
          control_id: 'A.9.2.1',
          control_title: 'User registration and de-registration',
          control_description: 'Formal user registration and de-registration process for granting access',
          control_family: 'User Access Management',
          risk_level: 'critical',
          implementation_guidance: 'Implement automated user provisioning and de-provisioning workflows'
        },
        {
          control_id: 'A.12.1.1',
          control_title: 'Documented operating procedures',
          control_description: 'Operating procedures should be documented and made available',
          control_family: 'Operations Security',
          risk_level: 'medium',
          implementation_guidance: 'Document all NAC operational procedures and runbooks'
        }
      ]
    },
    {
      framework_name: 'PCI DSS',
      acronym: 'PCI-DSS',
      controls: [
        {
          control_id: '1.1.2',
          control_title: 'Network diagram current',
          control_description: 'Current network diagram identifying all connections',
          control_family: 'Network Security',
          risk_level: 'high',
          implementation_guidance: 'Maintain updated network topology with all NAC enforcement points'
        },
        {
          control_id: '8.1.1',
          control_title: 'Unique user IDs',
          control_description: 'Assign all users a unique ID before allowing access',
          control_family: 'Access Control',
          risk_level: 'critical',
          implementation_guidance: 'Enforce unique user authentication through NAC'
        },
        {
          control_id: '8.2.3',
          control_title: 'Strong authentication',
          control_description: 'Passwords/passphrases must require minimum strength and complexity',
          control_family: 'Access Control',
          risk_level: 'critical',
          implementation_guidance: 'Implement strong authentication policies in NAC solution'
        }
      ]
    },
    {
      framework_name: 'HIPAA',
      acronym: 'HIPAA',
      controls: [
        {
          control_id: '164.312(a)(1)',
          control_title: 'Access Control',
          control_description: 'Implement technical policies for electronic PHI access',
          control_family: 'Technical Safeguards',
          risk_level: 'critical',
          implementation_guidance: 'Deploy NAC with healthcare-specific access policies'
        },
        {
          control_id: '164.312(d)',
          control_title: 'Person or Entity Authentication',
          control_description: 'Verify person or entity seeking access to ePHI',
          control_family: 'Technical Safeguards',
          risk_level: 'critical',
          implementation_guidance: 'Implement multi-factor authentication for PHI access'
        }
      ]
    },
    {
      framework_name: 'SOC 2',
      acronym: 'SOC2',
      controls: [
        {
          control_id: 'CC6.1',
          control_title: 'Logical Access Controls',
          control_description: 'Logical access to systems and data is restricted',
          control_family: 'Logical and Physical Access',
          risk_level: 'high',
          implementation_guidance: 'Implement logical access controls through NAC policies'
        },
        {
          control_id: 'CC6.2',
          control_title: 'User Authentication',
          control_description: 'User authentication through system access controls',
          control_family: 'Logical and Physical Access',
          risk_level: 'critical',
          implementation_guidance: 'Deploy strong authentication mechanisms'
        }
      ]
    }
  ];

  // Premium use case scenarios
  private static readonly USE_CASE_SCENARIOS = [
    {
      use_case: 'Zero Trust Network Implementation',
      scenarios: [
        {
          scenario_name: 'Complete Zero Trust Transformation',
          implementation_steps: [
            'Deploy NAC for device visibility',
            'Implement micro-segmentation',
            'Enable continuous verification',
            'Deploy SASE/SSE components',
            'Integrate with SIEM/SOAR'
          ],
          required_components: [
            'NAC Solution',
            'Identity Provider',
            'MFA Solution',
            'SIEM Platform',
            'Network Segmentation Tools'
          ],
          success_criteria: [
            'All devices authenticated before network access',
            'Continuous risk assessment active',
            'Automated threat response < 5 minutes',
            'Zero lateral movement capability'
          ],
          kpis: {
            mean_time_to_detect: '< 1 minute',
            mean_time_to_respond: '< 5 minutes',
            unauthorized_access_attempts_blocked: '100%',
            compliance_score: '> 95%'
          }
        }
      ]
    },
    {
      use_case: 'BYOD Program Implementation',
      scenarios: [
        {
          scenario_name: 'Enterprise BYOD with Guest Access',
          implementation_steps: [
            'Define BYOD policy',
            'Deploy self-service onboarding portal',
            'Configure device profiling',
            'Implement certificate-based authentication',
            'Setup guest sponsorship workflow'
          ],
          required_components: [
            'NAC with BYOD support',
            'Certificate Authority',
            'MDM/EMM Solution',
            'Guest Management Portal'
          ],
          success_criteria: [
            'Self-service onboarding < 5 minutes',
            'Automatic device classification',
            'Policy-based network segmentation',
            'Complete audit trail'
          ],
          kpis: {
            onboarding_time: '< 5 minutes',
            help_desk_tickets_reduced: '> 70%',
            user_satisfaction: '> 4.5/5',
            security_incidents: '< 0.1%'
          }
        }
      ]
    },
    {
      use_case: 'IoT Device Security',
      scenarios: [
        {
          scenario_name: 'Healthcare IoT Management',
          implementation_steps: [
            'Discover and profile all medical devices',
            'Create IoT-specific VLANs',
            'Implement device-specific policies',
            'Enable anomaly detection',
            'Setup automated quarantine'
          ],
          required_components: [
            'NAC with IoT profiling',
            'Network segmentation capability',
            'Behavioral analytics',
            'CMDB integration'
          ],
          success_criteria: [
            '100% device visibility',
            'Zero unauthorized device access',
            'Automated threat containment',
            'HIPAA compliance maintained'
          ],
          kpis: {
            device_discovery_rate: '100%',
            false_positive_rate: '< 5%',
            compliance_violations: '0',
            incident_response_time: '< 2 minutes'
          }
        }
      ]
    }
  ];

  /**
   * Seed all premium vendor data
   */
  static async seedVendorData(): Promise<void> {
    console.log('🚀 Starting premium vendor data seeding...');
    
    for (const vendorData of this.VENDOR_DATA) {
      try {
        // Get vendor ID
        const { data: vendor } = await supabase
          .from('vendor_library')
          .select('id')
          .eq('vendor_name', vendorData.vendor_name)
          .single();
        
        if (!vendor) {
          console.warn(`Vendor ${vendorData.vendor_name} not found, skipping...`);
          continue;
        }
        
        // Seed models and firmware
        for (const modelData of vendorData.models) {
          const { data: model, error: modelError } = await supabase
            .from('vendor_models')
            .upsert({
              vendor_id: vendor.id,
              model_name: modelData.model_name,
              model_number: modelData.model_number,
              product_line: modelData.product_line,
              category: modelData.category,
              specifications: modelData.specifications,
              supported_features: modelData.supported_features,
              lifecycle_status: modelData.lifecycle_status
            }, {
              onConflict: 'vendor_id,model_name,model_number'
            })
            .select()
            .single();
          
          if (modelError) {
            console.error(`Error seeding model ${modelData.model_name}:`, modelError);
            continue;
          }
          
          // Seed firmware versions
          for (const firmwareData of modelData.firmware_versions) {
            await supabase
              .from('vendor_firmware')
              .upsert({
                model_id: model.id,
                version: firmwareData.version,
                is_latest: firmwareData.is_latest,
                is_recommended: firmwareData.is_recommended,
                new_features: firmwareData.new_features,
                known_issues: firmwareData.known_issues
              }, {
                onConflict: 'model_id,version'
              });
          }
          
          // Seed features for each model
          for (const feature of modelData.supported_features) {
            await supabase
              .from('vendor_features')
              .upsert({
                vendor_id: vendor.id,
                model_id: model.id,
                feature_name: feature,
                feature_category: this.categorizeFeature(feature),
                feature_type: 'standard',
                best_practices: this.generateBestPractices(feature),
                configuration_template: this.generateConfigTemplate(vendorData.vendor_name, feature)
              });
          }
        }
        
        // Seed market intelligence
        await this.seedMarketIntelligence(vendor.id, vendorData.vendor_name);
        
        console.log(`✅ Seeded data for ${vendorData.vendor_name}`);
      } catch (error) {
        console.error(`Error seeding ${vendorData.vendor_name}:`, error);
      }
    }
  }

  /**
   * Seed compliance frameworks and controls
   */
  static async seedComplianceData(): Promise<void> {
    console.log('🚀 Starting compliance framework seeding...');
    
    for (const frameworkData of this.COMPLIANCE_FRAMEWORKS) {
      try {
        // Create framework
        const { data: framework, error: frameworkError } = await supabase
          .from('compliance_frameworks')
          .upsert({
            framework_name: frameworkData.framework_name,
            acronym: frameworkData.acronym,
            total_controls: frameworkData.controls.length
          }, {
            onConflict: 'framework_name'
          })
          .select()
          .single();
        
        if (frameworkError || !framework) {
          console.error(`Error seeding framework ${frameworkData.framework_name}:`, frameworkError);
          continue;
        }
        
        // Seed controls
        for (const controlData of frameworkData.controls) {
          await supabase
            .from('compliance_controls')
            .upsert({
              framework_id: framework.id,
              control_id: controlData.control_id,
              control_title: controlData.control_title,
              control_description: controlData.control_description,
              control_family: controlData.control_family,
              risk_level: controlData.risk_level,
              implementation_guidance: controlData.implementation_guidance
            }, {
              onConflict: 'framework_id,control_id'
            });
        }
        
        console.log(`✅ Seeded ${frameworkData.framework_name} with ${frameworkData.controls.length} controls`);
      } catch (error) {
        console.error(`Error seeding framework ${frameworkData.framework_name}:`, error);
      }
    }
    
    // Map vendors to compliance controls
    await this.mapVendorCompliance();
  }

  /**
   * Seed use case scenarios
   */
  static async seedUseCaseScenarios(): Promise<void> {
    console.log('🚀 Starting use case scenario seeding...');
    
    for (const useCaseData of this.USE_CASE_SCENARIOS) {
      try {
        // Find use case
        const { data: useCase } = await supabase
          .from('use_case_library')
          .select('id')
          .ilike('use_case_name', `%${useCaseData.use_case}%`)
          .single();
        
        if (!useCase) {
          console.warn(`Use case "${useCaseData.use_case}" not found`);
          continue;
        }
        
        // Seed scenarios
        for (const scenario of useCaseData.scenarios) {
          await supabase
            .from('use_case_scenarios')
            .upsert({
              use_case_id: useCase.id,
              scenario_name: scenario.scenario_name,
              implementation_steps: scenario.implementation_steps,
              required_components: scenario.required_components,
              success_criteria: scenario.success_criteria,
              kpis: scenario.kpis
            });
        }
        
        console.log(`✅ Seeded scenarios for ${useCaseData.use_case}`);
      } catch (error) {
        console.error(`Error seeding use case ${useCaseData.use_case}:`, error);
      }
    }
  }

  /**
   * Helper: Categorize feature
   */
  private static categorizeFeature(feature: string): string {
    const categories: { [key: string]: string[] } = {
      authentication: ['802.1X', 'MAB', 'Web Auth', 'SAML', 'OAuth', 'MFA', 'Certificate'],
      authorization: ['RBAC', 'Policy', 'TrustSec', 'Segmentation', 'Access Control'],
      accounting: ['TACACS', 'RADIUS', 'Logging', 'Audit', 'Reporting'],
      security: ['Posture', 'Threat', 'Zero Trust', 'Encryption', 'Compliance'],
      integration: ['API', 'pxGrid', 'REST', 'SIEM', 'Integration', 'Webhook']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => feature.toLowerCase().includes(keyword.toLowerCase()))) {
        return category;
      }
    }
    
    return 'general';
  }

  /**
   * Helper: Generate best practices for a feature
   */
  private static generateBestPractices(feature: string): string[] {
    const practices: { [key: string]: string[] } = {
      '802.1X': [
        'Use EAP-TLS for highest security',
        'Implement machine and user authentication',
        'Configure authentication timers appropriately',
        'Enable MAB as fallback for non-802.1X devices',
        'Use dynamic VLAN assignment'
      ],
      'Guest': [
        'Implement sponsor approval workflow',
        'Set appropriate session timeouts',
        'Use captive portal with terms acceptance',
        'Enable bandwidth limitations',
        'Log all guest activity'
      ],
      'BYOD': [
        'Require device registration',
        'Implement certificate-based authentication',
        'Use separate VLAN for personal devices',
        'Enable device compliance checking',
        'Provide self-service portal'
      ]
    };
    
    for (const [key, practiceList] of Object.entries(practices)) {
      if (feature.includes(key)) {
        return practiceList;
      }
    }
    
    return [
      'Follow vendor best practices',
      'Test in lab environment first',
      'Document configuration changes',
      'Monitor for anomalies',
      'Regular review and updates'
    ];
  }

  /**
   * Helper: Generate configuration template
   */
  private static generateConfigTemplate(vendor: string, feature: string): string {
    if (vendor === 'Cisco' && feature.includes('802.1X')) {
      return `
! Cisco 802.1X Configuration Template
interface GigabitEthernet1/0/1
 switchport mode access
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
!
radius server ISE-SERVER
 address ipv4 <ISE_IP> auth-port 1812 acct-port 1813
 key <RADIUS_KEY>
!`;
    }
    
    if (vendor === 'Aruba' && feature.includes('802.1X')) {
      return `
# Aruba 802.1X Configuration Template
aaa authentication dot1x default group radius
aaa accounting dot1x default start-stop group radius
!
interface gigabitethernet 0/0/1
  aaa authentication port-access dot1x authenticator
  aaa authentication port-access enable
!`;
    }
    
    return '# Configuration template pending';
  }

  /**
   * Helper: Seed market intelligence
   */
  private static async seedMarketIntelligence(vendorId: string, vendorName: string): Promise<void> {
    const marketData: { [key: string]: any } = {
      'Cisco': {
        market_share: 45.5,
        gartner_quadrant: 'Leader',
        customer_count: 50000,
        average_deal_size: 250000,
        customer_satisfaction_score: 4.2,
        key_differentiators: [
          'Largest market share',
          'Comprehensive ecosystem',
          'Strong partner network',
          'Extensive integration options'
        ]
      },
      'Aruba': {
        market_share: 18.3,
        gartner_quadrant: 'Leader',
        customer_count: 25000,
        average_deal_size: 150000,
        customer_satisfaction_score: 4.3,
        key_differentiators: [
          'Strong wireless integration',
          'Cloud-native options',
          'Simplified licensing',
          'AI-powered insights'
        ]
      },
      'Fortinet': {
        market_share: 12.7,
        gartner_quadrant: 'Challenger',
        customer_count: 20000,
        average_deal_size: 100000,
        customer_satisfaction_score: 4.1,
        key_differentiators: [
          'Security-first approach',
          'Integrated Security Fabric',
          'Cost-effective solutions',
          'Strong IoT capabilities'
        ]
      },
      'Portnox': {
        market_share: 3.5,
        gartner_quadrant: 'Niche Player',
        customer_count: 5000,
        average_deal_size: 50000,
        customer_satisfaction_score: 4.4,
        key_differentiators: [
          'Cloud-native architecture',
          'Agentless approach',
          'Rapid deployment',
          'Modern API-first design'
        ]
      }
    };
    
    const data = marketData[vendorName];
    if (data) {
      await supabase
        .from('vendor_market_intelligence')
        .upsert({
          vendor_id: vendorId,
          ...data,
          data_as_of: new Date().toISOString()
        });
    }
  }

  /**
   * Helper: Map vendors to compliance controls
   */
  private static async mapVendorCompliance(): Promise<void> {
    // Get all vendors
    const { data: vendors } = await supabase
      .from('vendor_library')
      .select('id, vendor_name');
    
    // Get key compliance controls
    const { data: controls } = await supabase
      .from('compliance_controls')
      .select('id, control_id, framework_id')
      .in('control_id', ['PR.AC-1', 'PR.AC-4', 'A.9.1.2', '8.1.1', '164.312(a)(1)']);
    
    if (!vendors || !controls) return;
    
    // Map each vendor to relevant controls
    for (const vendor of vendors) {
      for (const control of controls) {
        await supabase
          .from('vendor_compliance_mappings')
          .upsert({
            vendor_id: vendor.id,
            control_id: control.id,
            compliance_status: 'fully_compliant',
            implementation_method: `${vendor.vendor_name} NAC implementation`,
            validation_steps: {
              steps: [
                'Deploy NAC solution',
                'Configure policies',
                'Test compliance',
                'Generate evidence'
              ]
            }
          }, {
            onConflict: 'vendor_id,control_id'
          });
      }
    }
  }

  /**
   * Main seeding function
   */
  static async seedAllPremiumData(): Promise<{
    success: boolean;
    message: string;
    stats: any;
  }> {
    try {
      console.log('🚀 Starting comprehensive premium data seeding...');
      
      // Seed in sequence
      await this.seedVendorData();
      await this.seedComplianceData();
      await this.seedUseCaseScenarios();
      
      // Get statistics
      const { count: modelCount } = await supabase
        .from('vendor_models')
        .select('*', { count: 'exact', head: true });
      
      const { count: featureCount } = await supabase
        .from('vendor_features')
        .select('*', { count: 'exact', head: true });
      
      const { count: controlCount } = await supabase
        .from('compliance_controls')
        .select('*', { count: 'exact', head: true });
      
      const { count: scenarioCount } = await supabase
        .from('use_case_scenarios')
        .select('*', { count: 'exact', head: true });
      
      return {
        success: true,
        message: 'Premium data seeding completed successfully',
        stats: {
          vendor_models: modelCount || 0,
          vendor_features: featureCount || 0,
          compliance_controls: controlCount || 0,
          use_case_scenarios: scenarioCount || 0
        }
      };
    } catch (error) {
      console.error('Error during premium seeding:', error);
      return {
        success: false,
        message: 'Premium data seeding failed',
        stats: {}
      };
    }
  }
}

