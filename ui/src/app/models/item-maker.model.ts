
export type MakerStatus = 'Active' | 'Inactive';

export interface ItemMakerAudit {
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface ItemMaker {
  id: string; // e.g., MKR-001
  makerName: string;
  shortName: string;
  status: MakerStatus;
  description: string;
  
  // Contact Info (optional)
  headquarters?: string;
  website?: string;
  
  // Audit
  auditTrail: ItemMakerAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
