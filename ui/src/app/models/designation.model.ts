
export type DesignationStatus = 'Active' | 'Inactive';

export interface DesignationHistory {
  id: number;
  changeDescription: string;
  modifiedBy: string;
  date: Date;
}

export interface Designation {
  id: string;
  name: string;
  shortCode: string;
  level: string; // e.g. "Level 1", "L4"
  levelNumber?: number; // For sorting/logic
  status: DesignationStatus;
  
  // Extended Details
  departmentId?: string;
  departmentName?: string; // Display name
  reportingTo?: string; // Job Title of manager
  description?: string;
  responsibilities?: string;

  // Audit
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
  
  revisionHistory?: DesignationHistory[];
}