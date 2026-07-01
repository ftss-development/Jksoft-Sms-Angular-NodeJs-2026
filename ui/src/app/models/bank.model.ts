
export interface Bank {
  id: string;
  bankName: string; // Full Name
  shortName: string;
  code: string; // Code (Mob App) / Bank Code
  isActive: boolean;
  
  // New fields for detail view
  category?: string;
  swiftCode?: string;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
