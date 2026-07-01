
export type StoreStatus = 'Active' | 'Inactive' | 'Maintenance';

export interface StoreAudit {
  id: number;
  action: string;
  actor: string;
  timestamp: Date;
}

export interface Store {
  id: string; // e.g., ST-001
  storeName: string; // e.g., North Logistics Hub
  location: string; // e.g., Chicago, IL
  status: StoreStatus;
  description?: string;
  
  // Audit
  auditTrail?: StoreAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
