
export type CategoryStatus = 'Active' | 'Inactive';
export type SecurityLevel = 'Public' | 'Restricted' | 'Confidential';

export interface CategoryAuditEvents {
  id: number;
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface CategoryRevision {
  id: number;
  changeDescription: string;
  modifiedBy: string;
  date: Date;
}

export interface DocumentCategory {
  id: string; // e.g. CAT-001
  categoryName: string;
  shortName: string;
  description: string;
  status: CategoryStatus;
  securityLevel: SecurityLevel; // Added based on detail view screenshot

  // Audit
  auditTrail?: CategoryAuditEvents[];
  revisionHistory?: CategoryRevision[];
  
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
