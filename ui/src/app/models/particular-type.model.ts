
export type ParticularTypeStatus = 'Active' | 'Inactive' | 'Production Active';

export interface AssociatedBusinessUnit {
  id: number;
  region: string;
  unitName: string;
  usageStatus: 'Primary' | 'Secondary' | 'Enabled' | 'Disabled';
}

export interface ParticularTypeAudit {
  id: number;
  title: string;
  actor: string;
  timestamp: Date;
  description?: string;
  icon: string;
  colorClass?: string;
}

export interface ParticularType {
  id: string; // e.g. PT-001
  typeName: string; // e.g. Standard Revenue
  typeCode: string; // e.g. PT-402
  description: string;
  
  // Classification
  category: string; // e.g. Operating Expenses
  status: ParticularTypeStatus;
  
  // Financial Config
  defaultGlGroup: string; // e.g. 5000 - SERVIC - 01
  taxEligibility: string; // e.g. Subject to Standard VAT
  
  // Associations
  businessUnits: AssociatedBusinessUnit[];

  // Audit
  auditTrail: ParticularTypeAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
