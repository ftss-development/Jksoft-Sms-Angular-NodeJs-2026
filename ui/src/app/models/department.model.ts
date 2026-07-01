
export type DepartmentStatus = 'Active' | 'Inactive';

export interface DepartmentAudit {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  colorClass: string; // e.g., 'text-blue-600 bg-blue-100'
}

export interface SubDepartment {
  id: string;
  name: string;
  lead: string;
  employeeCount: number;
}

export interface Department {
  id: string; // e.g. DEP-001
  departmentName: string;
  shortName: string;
  status: DepartmentStatus;
  
  // Extended Details for Detail View
  headOfDepartment?: string;
  location?: string;
  budgetCode?: string;
  description?: string;
  
  subDepartments?: SubDepartment[];
  auditTrail?: DepartmentAudit[];

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
