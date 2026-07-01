
export type TaxStatus = 'Active' | 'Inactive' | 'Pending';

export interface TaxAuditTrail {
  id: number;
  title: string;
  actor: string;
  timestamp: Date;
  description?: string;
  icon: string;
}

export interface Tax {
  id: string; // e.g., TAX-001
  taxName: string;
  shortName: string;
  value: number; // The percentage
  effectiveDate: Date;
  status: TaxStatus;

  // Additional details from detail screen
  legalName?: string;
  taxAuthority?: string;
  jurisdiction?: string;
  currency?: string;
  roundingRule?: string;
  glSettlementAccount?: string;
  
  auditTrail: TaxAuditTrail[];
  
  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
