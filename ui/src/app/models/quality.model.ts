
export type QualityStatus = 'Active' | 'Inactive';

export interface QualityAudit {
  id: number;
  action: string; // e.g., 'Status Updated', 'Created Record'
  actor: string;
  timestamp: Date;
  description?: string;
  icon?: string; // Material symbol icon name
}

export interface Quality {
  id: string; // e.g. Q-1001
  name: string; // e.g. Premium Support, Standard Logistics
  description: string;
  
  // Classification Details (from Detail View)
  level: string; // e.g., 'Corporate Management Level 4'
  department: string; // e.g., 'Operational Compliance'
  
  status: QualityStatus;
  
  // System Metadata
  revision: string; // e.g., v2.1.0
  integrityCheck: boolean;
  referenceUuid: string;

  // Audit
  auditTrail: QualityAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
