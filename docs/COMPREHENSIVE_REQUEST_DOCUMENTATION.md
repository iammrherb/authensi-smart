# Comprehensive Request Documentation
## Track and NAC Master Platform

This document provides detailed descriptions for all types of requests, workflows, and integrations in the Track and NAC Master platform.

---

## 1. API Endpoints & Database Requests

### 1.1 Authentication Requests

#### User Authentication
```typescript
// Sign In Request
POST /auth/sign-in
Headers: {
  "Content-Type": "application/json"
}
Body: {
  email: string;
  password: string;
}
Response: {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}
```

#### Customer Portal Authentication
```typescript
// Customer Authentication via Supabase Function
POST /rest/v1/rpc/authenticate_customer_user
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <anon-key>"
}
Body: {
  p_email: string;
  p_password: string;
}
Response: {
  user_id: uuid;
  project_id: uuid;
  role: string;
  project_name: string;
  customer_organization: string;
}
```

#### Two-Factor Authentication
```typescript
// Enable 2FA
POST /rest/v1/rpc/enable_two_factor_auth
Body: {
  p_user_id: uuid;
  p_secret: string;
  p_verification_code: string;
}
Response: boolean

// Verify TOTP Code
POST /rest/v1/rpc/verify_totp_code
Body: {
  p_user_id: uuid;
  p_code: string;
}
Response: boolean
```

### 1.2 User Management Requests

#### User Creation
```typescript
// Create User Safely
POST /rest/v1/rpc/create_user_safely
Body: {
  p_email: string;
  p_password?: string;
  p_first_name?: string;
  p_last_name?: string;
  p_role: 'super_admin' | 'project_creator' | 'product_manager' | 'sales_engineer' | 'technical_account_manager' | 'viewer';
  p_scope_type?: string;
  p_scope_id?: uuid;
  p_send_invitation?: boolean;
}
Response: {
  success: boolean;
  user_id?: uuid;
  temp_password?: string;
  message: string;
  error?: string;
}
```

#### User Profile Management
```typescript
// Get User Profiles
GET /rest/v1/profiles
Query Parameters: {
  select?: string;
  is_active?: eq.boolean;
  order?: string;
}
Response: Profile[]

// Update User Profile
PATCH /rest/v1/profiles?id=eq.{user_id}
Body: {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_blocked?: boolean;
}
Response: Profile
```

#### Role Management
```typescript
// Assign Role
POST /rest/v1/user_roles
Body: {
  user_id: uuid;
  role: AppRole;
  scope_type: 'global' | 'project' | 'site';
  scope_id?: uuid;
  assigned_by: uuid;
}
Response: UserRole

// Check User Role
POST /rest/v1/rpc/has_role
Body: {
  _user_id: uuid;
  _role: AppRole;
  _scope_type?: string;
  _scope_id?: uuid;
}
Response: boolean
```

### 1.3 Project Management Requests

#### Project CRUD Operations
```typescript
// Create Project
POST /rest/v1/projects
Body: {
  name: string;
  description?: string;
  customer_organization?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  pain_points?: any[];
  success_criteria?: any[];
  integration_requirements?: any[];
  created_by: uuid;
}
Response: Project

// Get Projects
GET /rest/v1/projects
Query Parameters: {
  select?: string;
  created_by?: eq.uuid;
  status?: eq.string;
  order?: string;
  limit?: number;
}
Response: Project[]

// Update Project
PATCH /rest/v1/projects?id=eq.{project_id}
Body: Partial<Project>
Response: Project
```

#### Customer Portal Access
```typescript
// Enable Customer Portal
PATCH /rest/v1/projects?id=eq.{project_id}
Body: {
  customer_portal_enabled: boolean;
  customer_portal_id: uuid;
  customer_access_expires_at?: string;
}
Response: Project

// Get Project by Portal ID
POST /rest/v1/rpc/get_project_by_customer_portal_id
Body: {
  portal_id: uuid;
}
Response: ProjectPortalData
```

### 1.4 Site Management Requests

#### Site CRUD Operations
```typescript
// Create Site
POST /rest/v1/sites
Body: {
  name: string;
  project_id: uuid;
  location?: string;
  site_type?: string;
  device_count?: number;
  configuration_status?: 'pending' | 'in_progress' | 'completed';
  site_metadata?: any;
  created_by: uuid;
}
Response: Site

// Bulk Site Creation
POST /rest/v1/sites
Body: Site[]
Response: Site[]
```

### 1.5 AI Integration Requests

#### AI Provider Management
```typescript
// Get AI Providers
GET /rest/v1/ai_providers
Query Parameters: {
  is_active?: eq.boolean;
  provider_name?: eq.string;
}
Response: AIProvider[]

// Save AI Provider Configuration
POST /functions/v1/save-ai-provider
Body: {
  provider: string;
  apiKey: string;
  modelPreferences?: any;
}
Response: {
  success: boolean;
  message: string;
}
```

#### AI Completion Requests
```typescript
// Enhanced AI Completion
POST /functions/v1/enhanced-ai-completion
Body: {
  prompt: string;
  context?: any;
  provider?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
Response: {
  completion: string;
  usage: TokenUsage;
  model: string;
  provider: string;
}
```

#### AI Context Management
```typescript
// Create AI Context Session
POST /rest/v1/ai_context_sessions
Body: {
  user_id: uuid;
  session_type: string;
  project_context?: any;
  expires_at: string;
}
Response: AIContextSession

// Update Context Session
PATCH /rest/v1/ai_context_sessions?id=eq.{session_id}
Body: {
  accumulated_context?: any;
  context_summary?: string;
  last_activity?: string;
}
Response: AIContextSession
```

---

## 2. User Workflow Requests

### 2.1 Project Creation Workflow

#### Step 1: Initial Project Setup
```typescript
// Request Flow
1. User navigates to /project-creation
2. Frontend validates user permissions (has_role check)
3. Form submission triggers project creation
4. Success → Redirect to project dashboard
5. Error → Display validation messages

// Required Permissions
- Role: 'project_creator' | 'super_admin' | 'product_manager'
- Scope: 'global' or specific project scope

// Data Flow
Input → Validation → Database Insert → AI Context Creation → Response
```

#### Step 2: Project Configuration
```typescript
// Configuration Wizard Flow
1. Select deployment type and vendor preferences
2. AI generates initial recommendations
3. User reviews and customizes configurations
4. System validates technical requirements
5. Generate configuration templates
6. Create implementation timeline

// Dependencies
- Vendor library data
- Configuration templates
- AI recommendation engine
- User preferences and context
```

### 2.2 Site Creation and Management Workflow

#### Bulk Site Import Process
```typescript
// CSV Import Workflow
1. User uploads CSV file via drag-drop interface
2. System validates CSV headers against template
3. Data mapping and validation occurs
4. Preview shows processed data
5. User confirms import
6. Batch creation with progress tracking
7. Success/error reporting per site

// Error Handling
- Invalid CSV format → User guidance
- Missing required fields → Highlight errors
- Duplicate sites → Merge options
- Permission errors → Role upgrade suggestions
```

### 2.3 Customer Portal Workflow

#### Customer Onboarding
```typescript
// Portal Access Setup
1. Project owner enables customer portal
2. System generates unique portal ID
3. Customer credentials created (bcrypt hashed)
4. Portal URL shared with customer
5. Customer logs in with credentials
6. Access to project-specific dashboard

// Security Considerations
- Portal access expires after set period
- Activity logging for audit trail
- Role-based feature restrictions
- Secure credential transmission
```

---

## 3. System Integration Requests

### 3.1 Portnox API Integration

#### Device Discovery
```typescript
// Portnox Device Query
POST /functions/v1/portnox-api
Headers: {
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Body: {
  endpoint: '/devices',
  method: 'GET',
  params?: {
    limit?: number;
    offset?: number;
    filter?: string;
  }
}
Response: {
  devices: PortnoxDevice[];
  total: number;
  hasMore: boolean;
}
```

#### Bulk API Operations
```typescript
// Bulk Device Configuration
POST /functions/v1/portnox-api
Body: {
  endpoint: '/bulk-operations',
  method: 'POST',
  data: {
    operation: 'configure',
    devices: string[];
    configuration: any;
  }
}
Response: {
  success: boolean;
  results: BulkOperationResult[];
  errors?: ApiError[];
}
```

### 3.2 Documentation Crawler Integration

#### Vendor Documentation Scraping
```typescript
// Documentation Crawl Request
POST /functions/v1/documentation-crawler
Body: {
  vendor: string;
  urls: string[];
  crawlDepth: number;
  extractionRules?: ExtractionRule[];
}
Response: {
  documents: DocumentData[];
  metadata: CrawlMetadata;
  errors?: CrawlError[];
}
```

### 3.3 AI Provider Integrations

#### OpenAI Integration
```typescript
// OpenAI Chat Completion
POST /functions/v1/ai-completion
Body: {
  provider: 'openai',
  model: 'gpt-4' | 'gpt-3.5-turbo',
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  functions?: FunctionDefinition[];
}
Response: {
  completion: string;
  usage: TokenUsage;
  functionCall?: FunctionCall;
}
```

#### Claude Integration
```typescript
// Anthropic Claude Request
POST /functions/v1/ai-completion
Body: {
  provider: 'anthropic',
  model: 'claude-3-opus' | 'claude-3-sonnet',
  prompt: string;
  maxTokens: number;
  temperature?: number;
}
Response: {
  completion: string;
  usage: TokenUsage;
  stopReason: string;
}
```

---

## 4. Frontend Component Requests

### 4.1 Form Submission Patterns

#### Standard Form Pattern
```typescript
// Form Component Structure
interface FormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  validationSchema: ZodSchema<T>;
  isLoading?: boolean;
}

// Submission Flow
1. Form validation (client-side)
2. Loading state activation
3. API request with error handling
4. Success/error toast notification
5. Form reset or navigation
6. Loading state deactivation
```

#### Project Creation Form
```typescript
// ProjectForm Component Request Flow
1. User fills project details form
2. React Hook Form validates inputs
3. onSubmit calls createProject mutation
4. useProjects hook invalidates cache
5. Success toast + navigation to project
6. Error handling with field-specific messages

// Validation Rules
- Required: name, customer_organization
- Optional: description, dates, budget
- Custom: date range validation
- Async: duplicate name checking
```

### 4.2 Data Fetching Patterns

#### React Query Integration
```typescript
// Standard Query Pattern
const useEntityData = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['entity', params],
    queryFn: () => fetchEntityData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Mutation Pattern
const useCreateEntity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEntity,
    onSuccess: () => {
      queryClient.invalidateQueries(['entity']);
      toast.success('Entity created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};
```

### 4.3 Real-time Updates

#### Supabase Subscriptions
```typescript
// Real-time Project Updates
const useRealtimeProjects = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const subscription = supabase
      .channel('projects')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `created_by=eq.${userId}`
      }, (payload) => {
        handleRealtimeUpdate(payload, setProjects);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  return projects;
};
```

---

## 5. Business Process Requests

### 5.1 Implementation Tracking Workflow

#### Phase Management Process
```typescript
// Implementation Phase Flow
1. Project initialization
   → Create phase milestones
   → Assign team members
   → Set target dates

2. Progress tracking
   → Regular status updates
   → Milestone completion marking
   → Risk assessment logging

3. Reporting
   → Automated progress reports
   → Stakeholder notifications
   → Timeline adjustments

// Data Structure
interface ImplementationPhase {
  id: uuid;
  project_id: uuid;
  phase_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  start_date: Date;
  target_date: Date;
  completion_date?: Date;
  deliverables: Deliverable[];
  dependencies: uuid[];
  assigned_team: TeamMember[];
}
```

### 5.2 Deployment Planning Process

#### Configuration Generation Workflow
```typescript
// Deployment Planning Steps
1. Requirements gathering
   → Site inventory collection
   → Device type identification
   → Network topology mapping

2. AI-powered planning
   → Vendor recommendation
   → Configuration template selection
   → Timeline estimation

3. Validation and approval
   → Technical review
   → Customer approval
   → Implementation scheduling

// Process Data Flow
Requirements → AI Analysis → Template Generation → Validation → Deployment
```

### 5.3 Reporting and Analytics

#### Report Generation Process
```typescript
// Report Types and Generation
1. Project Status Reports
   → Progress summaries
   → Milestone tracking
   → Resource utilization

2. Technical Implementation Reports
   → Configuration details
   → Deployment status
   → Performance metrics

3. Customer-facing Reports
   → Executive summaries
   → Timeline updates
   → Success metrics

// Generation Workflow
Data Collection → Processing → Template Application → Review → Distribution
```

### 5.4 Team Management Process

#### Role-based Access Control
```typescript
// RBAC Implementation
1. Role Definition
   - super_admin: Full system access
   - project_creator: Project management
   - product_manager: Product oversight
   - sales_engineer: Customer interaction
   - technical_account_manager: Technical delivery
   - viewer: Read-only access

2. Permission Matrix
   - Create: Projects, Sites, Configurations
   - Read: Based on scope and role
   - Update: Own resources + role permissions
   - Delete: Restricted to admins

3. Scope Management
   - Global: System-wide permissions
   - Project: Project-specific access
   - Site: Site-level restrictions
```

---

## 6. Error Handling and Validation

### 6.1 Common Error Patterns

#### Authentication Errors
```typescript
// Error Types and Handling
1. Invalid credentials
   → Clear error message
   → Login attempt limiting
   → Password reset option

2. Session expiration
   → Automatic refresh attempt
   → Graceful logout
   → State preservation

3. Insufficient permissions
   → Clear permission requirements
   → Role upgrade suggestions
   → Contact admin option
```

### 6.2 Validation Rules

#### Data Validation Patterns
```typescript
// Form Validation
1. Client-side validation (immediate feedback)
2. Server-side validation (security)
3. Database constraints (data integrity)
4. Business rule validation (logic compliance)

// Common Validation Rules
- Email format validation
- Password strength requirements
- Date range validations
- Uniqueness constraints
- Required field validations
```

---

## 7. Security Considerations

### 7.1 Row Level Security (RLS)

#### Policy Patterns
```typescript
// Standard RLS Policies
1. User-owned resources
   → WHERE created_by = auth.uid()

2. Role-based access
   → WHERE has_role(auth.uid(), 'required_role')

3. Project-scoped access
   → WHERE project_id IN (user_accessible_projects)

4. Time-based access
   → WHERE expires_at > now()
```

### 7.2 Data Protection

#### Sensitive Data Handling
```typescript
// Protection Mechanisms
1. Password hashing (bcrypt)
2. API key encryption
3. PII data masking
4. Audit trail logging
5. Secure token storage
6. XSS prevention (DOMPurify)
```

---

## 8. Performance Optimization

### 8.1 Database Optimization

#### Query Optimization
```typescript
// Performance Patterns
1. Proper indexing strategy
2. Query result limiting
3. Eager loading relationships
4. Connection pooling
5. Prepared statements
6. Cache invalidation strategies
```

### 8.2 Frontend Optimization

#### React Optimization
```typescript
// Performance Techniques
1. Component memoization (React.memo)
2. Callback memoization (useCallback)
3. Value memoization (useMemo)
4. Lazy loading (React.lazy)
5. Virtual scrolling
6. Bundle splitting
```

---

This comprehensive documentation covers all request types, workflows, and integrations in the Track and NAC Master platform. Each section provides detailed information about request structures, data flows, security considerations, and implementation patterns.