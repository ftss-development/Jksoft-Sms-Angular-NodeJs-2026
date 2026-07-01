
export type SchemeStatus = 'Active' | 'Inactive' | 'Draft' | 'Deprecated';

export interface SchemeHistory {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  type: 'success' | 'info' | 'warning' | 'default';
}

export interface StbScheme {
  id: string; // e.g. SCH-RENT-001
  schemeName: string; // e.g. Standard Monthly Rental
  description: string;
  isActive: boolean;
  status: SchemeStatus;
  
  // Financials
  rentalRate: number;
  securityDeposit: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Annually' | 'One-Time';
  contractPeriod: string; // e.g. "12 Months"

  // Metadata
  internalReference: string; // e.g. PRM-FEST-2024-V2
  totalEnrolled?: number;
  revenueStream?: string; // e.g. B2C Subscription

  // Audit
  auditTrail: SchemeHistory[];
  historyLog: SchemeHistory[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
