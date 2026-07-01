
export type TicketReasonStatus = 'Active' | 'Inactive';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ClassificationType = 'Incident' | 'Request' | 'Problem' | 'Change';

export interface TicketReasonAudit {
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
  icon?: string;
}

export interface AssociatedHead {
  headId: string;
  headName: string;
  department: string;
  status: 'Enabled' | 'Disabled';
}

export interface TicketReason {
  id: string; // e.g. RSN-001
  reasonName: string;
  shortName: string;
  description: string;
  status: TicketReasonStatus;
  
  // Classification
  classificationType: ClassificationType;
  severityLevel: SeverityLevel;
  
  // Mock Associations for Detail View
  associatedHeads?: AssociatedHead[];

  // Audit
  auditTrail: TicketReasonAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
