export interface DeviceType {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  os_types: string[];
  typical_ports: string[];
  security_requirements: string[];
  authentication_methods: string[];
  deployment_considerations: string[];
  common_vendors: string[];
  icon: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  onboarding_complexity: 'simple' | 'moderate' | 'complex';
  management_overhead: 'low' | 'medium' | 'high';
  common_issues: string[];
  best_practices: string[];
}

export const deviceLibrary: DeviceType[] = [
  // Network Infrastructure
  {
    id: 'managed-switch',
    name: 'Managed Network Switch',
    category: 'Network Infrastructure',
    subcategory: 'Core Infrastructure',
    description: 'Enterprise-grade managed switches with VLAN and security capabilities',
    os_types: ['Linux', 'Proprietary'],
    typical_ports: ['22 (SSH)', '23 (Telnet)', '80 (HTTP)', '443 (HTTPS)', '161 (SNMP)'],
    security_requirements: ['MAC-based authentication', 'Port security', 'VLAN isolation'],
    authentication_methods: ['802.1X', 'MAC authentication', 'Web authentication'],
    deployment_considerations: ['Requires network segmentation', 'Certificate management', 'RADIUS integration'],
    common_vendors: ['Cisco', 'Juniper', 'HPE', 'Aruba', 'Extreme Networks'],
    icon: '🔗',
    risk_level: 'high',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['Certificate expiration', 'VLAN misconfiguration', 'Port security conflicts'],
    best_practices: ['Implement least privilege access', 'Regular firmware updates', 'Monitor port status']
  },
  {
    id: 'wireless-access-point',
    name: 'Wireless Access Point',
    category: 'Network Infrastructure',
    subcategory: 'Wireless',
    description: 'Enterprise wireless access points providing WiFi connectivity',
    os_types: ['Linux', 'Proprietary'],
    typical_ports: ['22 (SSH)', '80 (HTTP)', '443 (HTTPS)', '161 (SNMP)'],
    security_requirements: ['WPA3 encryption', 'Certificate-based authentication', 'Rogue AP detection'],
    authentication_methods: ['802.1X', 'PSK', 'Certificate authentication'],
    deployment_considerations: ['Wireless security policies', 'Certificate distribution', 'RF optimization'],
    common_vendors: ['Cisco', 'Aruba', 'Ruckus', 'Meraki', 'Ubiquiti'],
    icon: '📶',
    risk_level: 'high',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['Certificate problems', 'RF interference', 'Authentication failures'],
    best_practices: ['Regular security audits', 'Proper certificate management', 'Monitor wireless security']
  },

  // End User Devices
  {
    id: 'corporate-laptop',
    name: 'Corporate Laptop',
    category: 'End User Devices',
    subcategory: 'Computers',
    description: 'Company-owned laptops managed by IT department',
    os_types: ['Windows', 'macOS', 'Linux'],
    typical_ports: ['443 (HTTPS)', '80 (HTTP)', '22 (SSH)', '3389 (RDP)'],
    security_requirements: ['Domain authentication', 'Endpoint protection', 'Full disk encryption'],
    authentication_methods: ['Active Directory', '802.1X', 'Certificate authentication', 'SAML SSO'],
    deployment_considerations: ['Group policy management', 'Software deployment', 'Update management'],
    common_vendors: ['Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft'],
    icon: '💻',
    risk_level: 'medium',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['Certificate expiration', 'Policy conflicts', 'Driver compatibility'],
    best_practices: ['Automated enrollment', 'Regular patching', 'Endpoint monitoring']
  },
  {
    id: 'desktop-workstation',
    name: 'Desktop Workstation',
    category: 'End User Devices',
    subcategory: 'Computers',
    description: 'Fixed desktop computers for office workers',
    os_types: ['Windows', 'Linux', 'macOS'],
    typical_ports: ['443 (HTTPS)', '80 (HTTP)', '3389 (RDP)', '22 (SSH)'],
    security_requirements: ['Domain authentication', 'Local security policies', 'Asset management'],
    authentication_methods: ['Active Directory', '802.1X', 'Local authentication'],
    deployment_considerations: ['Physical security', 'Wake-on-LAN', 'Power management'],
    common_vendors: ['Dell', 'HP', 'Lenovo', 'Apple'],
    icon: '🖥️',
    risk_level: 'low',
    onboarding_complexity: 'simple',
    management_overhead: 'low',
    common_issues: ['Hardware failures', 'OS compatibility', 'Network connectivity'],
    best_practices: ['Regular maintenance', 'Automated deployment', 'Hardware lifecycle management']
  },
  {
    id: 'byod-smartphone',
    name: 'BYOD Smartphone',
    category: 'End User Devices',
    subcategory: 'Mobile BYOD',
    description: 'Personal smartphones accessing corporate resources',
    os_types: ['iOS', 'Android'],
    typical_ports: ['443 (HTTPS)', '80 (HTTP)', '993 (IMAPS)', '587 (SMTP)'],
    security_requirements: ['MDM enrollment', 'App containerization', 'Remote wipe capability'],
    authentication_methods: ['Certificate authentication', 'MDM authentication', 'App-based authentication'],
    deployment_considerations: ['Privacy concerns', 'App whitelisting', 'Data separation'],
    common_vendors: ['Apple', 'Samsung', 'Google', 'OnePlus'],
    icon: '📱',
    risk_level: 'high',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['Certificate trust', 'App compatibility', 'User compliance'],
    best_practices: ['Clear BYOD policy', 'User training', 'Regular compliance checks']
  },
  {
    id: 'byod-tablet',
    name: 'BYOD Tablet',
    category: 'End User Devices',
    subcategory: 'Mobile BYOD',
    description: 'Personal tablets used for business purposes',
    os_types: ['iOS', 'iPadOS', 'Android'],
    typical_ports: ['443 (HTTPS)', '80 (HTTP)', '993 (IMAPS)'],
    security_requirements: ['MDM management', 'App restrictions', 'Content filtering'],
    authentication_methods: ['Certificate authentication', 'MDM enrollment', 'SSO integration'],
    deployment_considerations: ['Screen size variations', 'App compatibility', 'User experience'],
    common_vendors: ['Apple', 'Samsung', 'Microsoft', 'Amazon'],
    icon: '📟',
    risk_level: 'medium',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['App installation', 'Network configuration', 'User adoption'],
    best_practices: ['Standardized apps', 'User self-service', 'Regular policy updates']
  },

  // Guest Devices
  {
    id: 'guest-device',
    name: 'Guest Device',
    category: 'Guest Access',
    subcategory: 'Temporary Access',
    description: 'Visitor devices requiring temporary network access',
    os_types: ['Windows', 'macOS', 'iOS', 'Android', 'Linux'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', '53 (DNS)'],
    security_requirements: ['Network isolation', 'Time-based access', 'Content filtering'],
    authentication_methods: ['Captive portal', 'Sponsor authentication', 'Self-registration'],
    deployment_considerations: ['Guest network segregation', 'Bandwidth limitations', 'Access duration'],
    common_vendors: ['Various'],
    icon: '🚪',
    risk_level: 'high',
    onboarding_complexity: 'simple',
    management_overhead: 'low',
    common_issues: ['Captive portal issues', 'DNS resolution', 'Certificate warnings'],
    best_practices: ['Strong network isolation', 'Regular access review', 'Clear usage policies']
  },
  {
    id: 'contractor-device',
    name: 'Contractor Device',
    category: 'Guest Access',
    subcategory: 'Extended Access',
    description: 'External contractor devices with extended access needs',
    os_types: ['Windows', 'macOS', 'Linux'],
    typical_ports: ['443 (HTTPS)', '80 (HTTP)', '22 (SSH)', '3389 (RDP)'],
    security_requirements: ['Endpoint compliance', 'VPN access', 'Activity monitoring'],
    authentication_methods: ['Sponsor authentication', 'Certificate-based', 'VPN authentication'],
    deployment_considerations: ['Access scope definition', 'Compliance verification', 'Time limitations'],
    common_vendors: ['Various'],
    icon: '👥',
    risk_level: 'high',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['Compliance verification', 'Access scope creep', 'Certificate management'],
    best_practices: ['Regular access reviews', 'Compliance monitoring', 'Clear contract terms']
  },

  // Printers and Office Equipment
  {
    id: 'network-printer',
    name: 'Network Printer',
    category: 'Office Equipment',
    subcategory: 'Printers',
    description: 'Multi-function network printers and copiers',
    os_types: ['Embedded Linux', 'Proprietary'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', '515 (LPR)', '9100 (RAW)', '161 (SNMP)'],
    security_requirements: ['Secure printing', 'User authentication', 'Audit logging'],
    authentication_methods: ['LDAP authentication', 'Card-based authentication', 'PIN codes'],
    deployment_considerations: ['Print queue security', 'Document retention', 'Access controls'],
    common_vendors: ['HP', 'Canon', 'Xerox', 'Ricoh', 'Brother'],
    icon: '🖨️',
    risk_level: 'medium',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['Authentication failures', 'Print queue issues', 'Security updates'],
    best_practices: ['Regular security updates', 'Secure configuration', 'Print audit trails']
  },
  {
    id: 'wireless-printer',
    name: 'Wireless Printer',
    category: 'Office Equipment',
    subcategory: 'Printers',
    description: 'WiFi-enabled printers for wireless printing',
    os_types: ['Embedded Linux', 'Proprietary'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', '9100 (RAW)'],
    security_requirements: ['WiFi security', 'Print encryption', 'Access controls'],
    authentication_methods: ['WiFi authentication', 'Print authentication', 'Cloud authentication'],
    deployment_considerations: ['Wireless security', 'Guest printing', 'Mobile printing'],
    common_vendors: ['HP', 'Canon', 'Epson', 'Brother'],
    icon: '📶🖨️',
    risk_level: 'medium',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['WiFi connectivity', 'Mobile compatibility', 'Security configuration'],
    best_practices: ['Secure WiFi setup', 'Regular updates', 'Access monitoring']
  },

  // IP Phones and Communication
  {
    id: 'voip-phone',
    name: 'VoIP Desk Phone',
    category: 'Communication Devices',
    subcategory: 'IP Phones',
    description: 'Voice over IP desk phones for business communication',
    os_types: ['Embedded Linux', 'Proprietary'],
    typical_ports: ['5060 (SIP)', '5061 (SIPS)', '80 (HTTP)', '443 (HTTPS)'],
    security_requirements: ['SIP security', 'Voice encryption', 'Device authentication'],
    authentication_methods: ['SIP authentication', 'Certificate-based', '802.1X'],
    deployment_considerations: ['QoS requirements', 'VLAN configuration', 'Power over Ethernet'],
    common_vendors: ['Cisco', 'Polycom', 'Yealink', 'Grandstream', 'Avaya'],
    icon: '☎️',
    risk_level: 'medium',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['Voice quality', 'Authentication issues', 'Network configuration'],
    best_practices: ['QoS implementation', 'Regular updates', 'Security monitoring']
  },
  {
    id: 'conference-phone',
    name: 'Conference Room Phone',
    category: 'Communication Devices',
    subcategory: 'Conference Equipment',
    description: 'Specialized phones for conference rooms and meeting spaces',
    os_types: ['Embedded Linux', 'Proprietary'],
    typical_ports: ['5060 (SIP)', '80 (HTTP)', '443 (HTTPS)'],
    security_requirements: ['Meeting security', 'Audio encryption', 'Access controls'],
    authentication_methods: ['Room-based authentication', 'User authentication', 'Calendar integration'],
    deployment_considerations: ['Room acoustics', 'Integration requirements', 'Scheduling systems'],
    common_vendors: ['Polycom', 'Cisco', 'Zoom', 'Microsoft'],
    icon: '🎤',
    risk_level: 'medium',
    onboarding_complexity: 'complex',
    management_overhead: 'medium',
    common_issues: ['Audio quality', 'Integration problems', 'User adoption'],
    best_practices: ['Proper acoustics', 'User training', 'Regular testing']
  },

  // IoT and OT Devices
  {
    id: 'security-camera',
    name: 'IP Security Camera',
    category: 'IoT/OT Devices',
    subcategory: 'Security Systems',
    description: 'Network-connected security cameras for surveillance',
    os_types: ['Embedded Linux', 'Proprietary'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', '554 (RTSP)', '37777 (Proprietary)'],
    security_requirements: ['Video encryption', 'Access controls', 'Firmware security'],
    authentication_methods: ['Device certificates', 'Username/password', 'Network isolation'],
    deployment_considerations: ['Bandwidth requirements', 'Storage considerations', 'Privacy compliance'],
    common_vendors: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha'],
    icon: '📹',
    risk_level: 'high',
    onboarding_complexity: 'moderate',
    management_overhead: 'medium',
    common_issues: ['Default credentials', 'Firmware vulnerabilities', 'Bandwidth usage'],
    best_practices: ['Change default passwords', 'Regular updates', 'Network segmentation']
  },
  {
    id: 'door-controller',
    name: 'Access Control System',
    category: 'IoT/OT Devices',
    subcategory: 'Physical Security',
    description: 'Electronic door locks and access control systems',
    os_types: ['Embedded', 'Proprietary'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', 'Custom TCP/UDP'],
    security_requirements: ['Physical security', 'Encrypted communication', 'Audit logging'],
    authentication_methods: ['Card-based', 'Biometric', 'PIN codes', 'Mobile credentials'],
    deployment_considerations: ['Physical installation', 'Power backup', 'Emergency access'],
    common_vendors: ['HID', 'Honeywell', 'Johnson Controls', 'Lenel'],
    icon: '🚪🔒',
    risk_level: 'critical',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['Power failures', 'Connectivity issues', 'Card compatibility'],
    best_practices: ['Redundant power', 'Regular testing', 'Access audit trails']
  },
  {
    id: 'hvac-controller',
    name: 'HVAC Control System',
    category: 'IoT/OT Devices',
    subcategory: 'Building Management',
    description: 'Heating, ventilation, and air conditioning control systems',
    os_types: ['Embedded', 'Windows Embedded', 'Linux'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', '502 (Modbus)', '47808 (BACnet)'],
    security_requirements: ['OT network security', 'Protocol security', 'Change management'],
    authentication_methods: ['System authentication', 'Network isolation', 'Protocol authentication'],
    deployment_considerations: ['Critical system availability', 'Environmental monitoring', 'Integration requirements'],
    common_vendors: ['Johnson Controls', 'Honeywell', 'Siemens', 'Schneider Electric'],
    icon: '🌡️',
    risk_level: 'high',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['Protocol compatibility', 'Network interference', 'System integration'],
    best_practices: ['Network segregation', 'Regular monitoring', 'Change control procedures']
  },

  // Industrial and Manufacturing
  {
    id: 'plc-controller',
    name: 'Programmable Logic Controller',
    category: 'Industrial/Manufacturing',
    subcategory: 'Process Control',
    description: 'Industrial control systems for manufacturing processes',
    os_types: ['Proprietary', 'Real-time OS'],
    typical_ports: ['502 (Modbus)', '44818 (OPC-UA)', '2222 (EtherNet/IP)'],
    security_requirements: ['Process integrity', 'Change control', 'Network isolation'],
    authentication_methods: ['Engineering authentication', 'Network segmentation', 'Protocol security'],
    deployment_considerations: ['Safety systems', 'Real-time requirements', 'Redundancy'],
    common_vendors: ['Siemens', 'Allen-Bradley', 'Schneider Electric', 'ABB'],
    icon: '⚙️',
    risk_level: 'critical',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['Safety implications', 'Real-time constraints', 'Legacy protocols'],
    best_practices: ['Air-gapped networks', 'Change approval processes', 'Safety-first approach']
  },
  {
    id: 'hmi-terminal',
    name: 'Human Machine Interface',
    category: 'Industrial/Manufacturing',
    subcategory: 'Operator Interfaces',
    description: 'Operator interface terminals for industrial control',
    os_types: ['Windows Embedded', 'Linux', 'Proprietary'],
    typical_ports: ['80 (HTTP)', '443 (HTTPS)', '502 (Modbus)', '44818 (OPC-UA)'],
    security_requirements: ['Operator authentication', 'Display security', 'Process protection'],
    authentication_methods: ['User authentication', 'Role-based access', 'Biometric authentication'],
    deployment_considerations: ['Harsh environments', 'Operator training', 'Safety requirements'],
    common_vendors: ['Siemens', 'Rockwell', 'Wonderware', 'GE'],
    icon: '🖥️⚙️',
    risk_level: 'high',
    onboarding_complexity: 'complex',
    management_overhead: 'high',
    common_issues: ['User training', 'Interface design', 'Security awareness'],
    best_practices: ['Role-based access', 'Regular training', 'Security awareness programs']
  }
];

export const deviceCategories = [
  'Network Infrastructure',
  'End User Devices', 
  'Guest Access',
  'Office Equipment',
  'Communication Devices',
  'IoT/OT Devices',
  'Industrial/Manufacturing'
];

export const riskLevels = ['low', 'medium', 'high', 'critical'] as const;
export const complexityLevels = ['simple', 'moderate', 'complex'] as const;
export const managementLevels = ['low', 'medium', 'high'] as const;