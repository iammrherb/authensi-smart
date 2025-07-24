export interface Site {
  id: string
  name: string
  customer: string
  region: string
  country: string
  status: "Planning" | "In Progress" | "Completed" | "At Risk"
  projectManager: string
  technicalOwners: string[]
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: "Native" | "Proxy" | "None"
  plannedStart: string
  plannedEnd: string
  completionPercent: number
  deploymentChecklist: ChecklistItem[]
  notes?: string
  workbook?: SiteWorkbook
}

export interface SiteWorkbook {
  networkDetails: {
    totalSwitches: number
    totalAPs: number
    mainSwitchModels: string
    mainAPModels: string
    vlanCount: number
    subnetDetails: string
    existingAAA: string
  }
  portnoxConfig: {
    policyGroups: string[]
    authMethods: string[]
    specialPolicies: string
    highAvailability: string
  }
  testingPlan: {
    pilotGroup: string
    pilotDate: string
    pilotDuration: string
    successCriteria: string
  }
  contacts: { name: string; role: string; email: string; phone: string }[]
}

export interface ChecklistItem {
  id: string
  task: string
  category: string
  completed: boolean
  completedBy?: string
  completedDate?: string
}

export interface Notification {
  id: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

export interface Milestone {
  id: string
  title: string
  date: string
  description: string
}

export interface LibraryItem {
  id: string
  title: string
  description: string
  category: string
  content: string
}

export interface Vendor {
  id: number
  name: string
  is_custom?: boolean
}

export interface DeviceType {
  id: number | string
  name: string
  is_custom?: boolean
}

export interface Region {
  name: string
}

export interface UseCase {
  id: string
  title: string
  category: string
  priority: string
  is_custom?: boolean
  description?: string
}

export interface TestCase {
  id: string
  name: string
  expected_outcome: string
  is_custom?: boolean
}

export interface Requirement {
  id: string
  description: string
  is_custom?: boolean
}

export interface ScopingQuestionnaire {
  id?: string
  organizationName: string
  totalUsers: number
  siteCount: number
  country: string
  region: string
  industry: string
  projectGoals: string[]
  legacySystems: string[]
  idpVendors: string[]
  mfaVendors: string[]
  wiredVendors: string[]
  wirelessVendors: string[]
  mdmVendors: string[]
  edrVendors: string[]
  siemVendors: string[]
  firewallVendors: string[]
  vpnVendors: string[]
  status: "Draft" | "Completed"
}

export interface LibraryData {
  deploymentChecklist: LibraryItem[]
  useCases: UseCase[]
  testCases: TestCase[]
  requirements: Requirement[]
  regions: Region[]
  idpVendors: Vendor[]
  mfaVendors: Vendor[]
  edrVendors: Vendor[]
  siemVendors: Vendor[]
  wiredVendors: Vendor[]
  wirelessVendors: Vendor[]
  firewallVendors: Vendor[]
  vpnVendors: Vendor[]
  mdmVendors: Vendor[]
  deviceTypes: DeviceType[]
}

export interface SiteStats {
  total_sites: number
  completed_sites: number
  in_progress_sites: number
  planned_sites: number
  delayed_sites: number
  total_users: number
  overall_completion: number
}