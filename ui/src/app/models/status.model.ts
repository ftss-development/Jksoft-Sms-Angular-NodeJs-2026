
export interface StatusHistory {
  id: number;
  action: string;
  timestamp: Date;
  actor: string;
  description?: string;
  icon?: string;
}

export interface StatusType {
  id: string; // e.g. STAT-001
  statusName: string; // e.g. Active, Pending
  internalCode: string; // e.g. STAT-INPROG-02
  statusType: string; // e.g. Lifecycle, Workflow, System
  statusFor: string; // e.g. Customer, Ticket, Device
  description: string;
  isActive: boolean;
  isLocked: boolean; // "Lock Record on Status"
  
  // UI Config
  displayColor: string; // hex code
  displayIcon: string; // Material symbol name

  // Audit
  historyLog: StatusHistory[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
  
  // System Info
  objectClass?: string;
  revision?: string;
}
