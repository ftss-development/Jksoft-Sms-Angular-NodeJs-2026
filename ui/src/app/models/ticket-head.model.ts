
export type TicketHeadStatus = 'Active' | 'Inactive' | 'Published' | 'Draft';
export type ServiceCategory = 'Infrastructure' | 'Software' | 'Hardware' | 'Access Control' | 'Network' | 'Database';

export interface TicketHeadAudit {
  id: number;
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface TicketHead {
  id: string; // e.g. TH-849200-XJ
  name: string; // e.g., Network Connectivity Loss
  shortName: string; // e.g., NET-CONN-01
  
  // Categorization
  serviceCategory: ServiceCategory;
  reason: string; // e.g., "Hardware Failure"
  
  // SLA & Metrics
  resolutionTime: number; // in minutes
  faultCount: number; // Mock metric
  slaTargetHours: number;
  
  // Status
  status: TicketHeadStatus;
  isActive: boolean;
  
  // Visuals
  colorCode: string; // hex
  icon: string; // Material symbol
  
  // Advanced Config (Edit/Detail View)
  businessHours?: string;
  autoClose?: boolean;
  maxFaultsBeforeEscalation?: number;
  escalationTeam?: string;
  domain?: string;
  description?: string; // HTML/Rich text content
  
  // Audit
  auditTrail: TicketHeadAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
