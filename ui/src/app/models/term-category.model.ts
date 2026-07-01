
export type TermStatus = 'Active' | 'Inactive';

export interface LinkedTerm {
  termCode: string;
  termName: string;
  version: string;
  lastReview: string;
}

export interface TermCategoryAudit {
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
  icon?: string;
}

export interface TermCategory {
  id: string; // e.g., TCF-001
  categoryName: string;
  categoryCode: string;
  description: string;
  isActive: boolean;
  
  // Configuration
  enableAutoRenewal: boolean;
  requireLegalApproval: boolean;
  
  // Detail View Metadata
  department: string;
  globalEnforcement: string; // e.g. "Required Globally"
  
  // Mock Data
  linkedTerms?: LinkedTerm[];
  
  // Audit
  auditTrail: TermCategoryAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
