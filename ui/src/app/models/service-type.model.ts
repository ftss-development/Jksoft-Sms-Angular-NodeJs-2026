
export type ServiceTypeStatus = 'Active' | 'Inactive' | 'Deprecated' | 'Draft';

export interface ServiceHistoryEvent {
  id: number;
  title: string;
  description?: string;
  timestamp: Date;
  icon: string; // Material symbol name
  type: 'success' | 'info' | 'warning' | 'default';
}

export interface ServiceType {
  id: string; // e.g. SVC-001
  serviceName: string; // e.g. Residential, Commercial
  category: string; // e.g. Professional Services, Installation
  slaTier: string; // e.g. Tier 1 - Premium Response
  description: string;
  status: ServiceTypeStatus;
  
  // System Metadata
  serviceCode?: string; // e.g. SVC-9021-ESG
  version?: string; // e.g. v1.4.0
  isMasterCatalog?: boolean;

  // Audit
  historyLog: ServiceHistoryEvent[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
