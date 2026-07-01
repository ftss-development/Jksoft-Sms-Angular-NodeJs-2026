
export type AccountType = 'Checking' | 'Savings' | 'Investment' | 'Escrow' | 'Overdraft' | 'Current';

export interface BankAccountAudit {
  action: string;
  actor: string;
  timestamp: Date;
  description?: string;
}

export interface BankAccount {
  id: string;
  // Basic Details
  accountName: string;
  accountNumber: string; // Stored as string to preserve leading zeros if any
  bankId: string; // Reference to Bank ID
  branchName: string;
  
  // Configuration
  accountType: AccountType;
  companyId: string; // Reference to Company ID
  isDefault: boolean;
  isActive: boolean;
  
  // Identifiers
  ifscCode: string;
  swiftCode: string;
  micrCode: string;
  merchantName?: string;
  
  // Meta
  currency: string;
  balance?: number; // New field
  
  // Audit
  status: 'Active & Verified' | 'Pending' | 'Inactive' | 'Active';
  auditTimeline: BankAccountAudit[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
