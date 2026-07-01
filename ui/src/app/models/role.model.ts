
export type RoleStatus = 'Active' | 'Inactive';

export interface SystemRight {
  id: string; // e.g. RIGHT-001
  name: string; // e.g. "Create User"
  code: string; // e.g. "USR_CREATE"
  module: string; // e.g. "User Management"
  description: string;
  status: 'Active' | 'Inactive';
  
  // Audit
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}

export interface RoleAudit {
  id: number;
  action: string;
  actor: string;
  timestamp: Date;
}

export interface Role {
  id: string; // e.g. ROL-001
  roleName: string;
  description: string;
  status: RoleStatus;
  
  // Array of SystemRight IDs
  rightIds: string[];

  // Audit
  auditTrail: RoleAudit[];
  userCount?: number; // Mock field for UI
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
