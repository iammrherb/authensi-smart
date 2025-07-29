export interface AuthenticationMethod {
  id: string;
  name: string;
  category: string;
  description: string;
  use_cases: string[];
  device_compatibility: string[];
  security_level: 'basic' | 'standard' | 'high' | 'enterprise';
  complexity: 'simple' | 'moderate' | 'complex';
  protocols: string[];
  prerequisites: string[];
  best_practices: string[];
  common_issues: string[];
}

export const authenticationMethods: AuthenticationMethod[] = [
  {
    id: '802.1x-eap-tls',
    name: '802.1X EAP-TLS',
    category: 'Certificate-based',
    description: 'Certificate-based authentication using EAP-TLS protocol',
    use_cases: ['Corporate devices', 'High-security environments', 'Managed endpoints'],
    device_compatibility: ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Network devices'],
    security_level: 'enterprise',
    complexity: 'complex',
    protocols: ['EAP-TLS', '802.1X', 'RADIUS'],
    prerequisites: ['PKI infrastructure', 'Certificate management', 'RADIUS server'],
    best_practices: ['Regular certificate renewal', 'Strong private key protection', 'Certificate revocation lists'],
    common_issues: ['Certificate expiration', 'Trust chain problems', 'Client configuration']
  },
  {
    id: '802.1x-peap-mschapv2',
    name: '802.1X PEAP-MSCHAPv2',
    category: 'Username/Password',
    description: 'Password-based authentication with TLS tunnel protection',
    use_cases: ['BYOD devices', 'Quick deployment', 'Legacy device support'],
    device_compatibility: ['Windows', 'macOS', 'iOS', 'Android', 'Linux'],
    security_level: 'standard',
    complexity: 'moderate',
    protocols: ['PEAP', 'MSCHAPv2', '802.1X', 'RADIUS'],
    prerequisites: ['RADIUS server', 'User directory', 'Server certificate'],
    best_practices: ['Strong password policies', 'Server certificate validation', 'Regular password changes'],
    common_issues: ['Password expiration', 'Certificate validation', 'Configuration errors']
  },
  {
    id: 'saml-sso',
    name: 'SAML Single Sign-On',
    category: 'Federation',
    description: 'Federated authentication using SAML protocol',
    use_cases: ['Cloud integration', 'Multi-domain environments', 'Enterprise SSO'],
    device_compatibility: ['Web browsers', 'Modern applications', 'Cloud services'],
    security_level: 'enterprise',
    complexity: 'complex',
    protocols: ['SAML 2.0', 'HTTPS', 'XML Digital Signatures'],
    prerequisites: ['Identity provider', 'Service provider configuration', 'Certificate management'],
    best_practices: ['Attribute mapping', 'Session management', 'Security assertions'],
    common_issues: ['Clock synchronization', 'Attribute mapping', 'Certificate validation']
  },
  {
    id: 'oidc',
    name: 'OpenID Connect',
    category: 'Federation',
    description: 'Modern identity federation using OAuth 2.0 and OpenID Connect',
    use_cases: ['Modern applications', 'API access', 'Mobile applications'],
    device_compatibility: ['Modern browsers', 'Mobile apps', 'APIs', 'Cloud services'],
    security_level: 'enterprise',
    complexity: 'moderate',
    protocols: ['OpenID Connect', 'OAuth 2.0', 'JWT', 'HTTPS'],
    prerequisites: ['Authorization server', 'Client registration', 'Scope configuration'],
    best_practices: ['PKCE for mobile', 'Token validation', 'Scope limitations'],
    common_issues: ['Token expiration', 'Scope configuration', 'Client authentication']
  },
  {
    id: 'tacacs-plus',
    name: 'TACACS+',
    category: 'Network Device Authentication',
    description: 'Terminal Access Controller Access-Control System Plus',
    use_cases: ['Network device management', 'Administrative access', 'Command authorization'],
    device_compatibility: ['Cisco devices', 'Network equipment', 'Unix/Linux systems'],
    security_level: 'high',
    complexity: 'moderate',
    protocols: ['TACACS+', 'TCP'],
    prerequisites: ['TACACS+ server', 'Shared secret', 'User database'],
    best_practices: ['Command authorization', 'Accounting logs', 'Encrypted communication'],
    common_issues: ['Shared secret management', 'Server connectivity', 'Command mapping']
  },
  {
    id: 'conditional-access',
    name: 'Conditional Access',
    category: 'Policy-based',
    description: 'Risk-based access control with policy enforcement',
    use_cases: ['Zero trust security', 'Risk-based access', 'Compliance requirements'],
    device_compatibility: ['Azure AD', 'Office 365', 'Cloud applications'],
    security_level: 'enterprise',
    complexity: 'complex',
    protocols: ['OAuth 2.0', 'SAML', 'Modern Authentication'],
    prerequisites: ['Cloud identity platform', 'Policy configuration', 'Risk assessment'],
    best_practices: ['Regular policy review', 'User impact assessment', 'Monitoring and alerts'],
    common_issues: ['Policy conflicts', 'User experience', 'False positives']
  }
];

export const authCategories = [
  'Certificate-based',
  'Username/Password', 
  'Federation',
  'Network Device Authentication',
  'Policy-based'
];

export const securityLevels = ['basic', 'standard', 'high', 'enterprise'] as const;