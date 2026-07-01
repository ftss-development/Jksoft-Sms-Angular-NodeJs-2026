
export type ServiceCategoryStatus = 'Active' | 'Inactive';

export interface ServiceCategoryAudit {
  id: number;
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface ServiceCategory {
  id: string; // e.g. CAT-4001
  categoryName: string; // e.g. Professional Services
  shortName: string; // e.g. PRO-SRV
  description: string;
  isActive: boolean;
  
  // System Metadata
  globalIdentifier?: string; // e.g. CAT-8822-PRO
  schemaVersion?: string;

  // Audit
  auditTrail: ServiceCategoryAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
