
export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Terminated';

export interface EmployeeAudit {
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode: string; // e.g. EMP-2024-0829
  
  // Job Details
  jobTitle: string;
  level: string; // e.g. Senior Manager, L9 - Executive
  department: string;
  workLocation: string;
  joiningDate: Date;
  
  // Hierarchy
  reportingManagerId?: string; // ID of the manager
  
  // Status
  status: EmployeeStatus;
  isActive: boolean; // Toggle for system access
  
  // Audit
  auditTimeline: EmployeeAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
