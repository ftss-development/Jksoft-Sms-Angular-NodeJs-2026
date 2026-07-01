
export type LanguageStatus = 'Active' | 'Inactive';

export interface LanguageAudit {
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface Language {
  id: string; // e.g. L-001
  name: string; // e.g. English (United States)
  shortName: string; // e.g. EN-US
  status: LanguageStatus;
  description: string;
  
  // Audit
  auditTrail: LanguageAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
