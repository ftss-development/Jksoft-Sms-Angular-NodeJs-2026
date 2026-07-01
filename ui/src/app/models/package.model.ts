
export interface PackageChannel {
  id: number;
  name: string;
  category: string;
  language: string;
}

export interface Package {
  id: number;
  packageName: string;
  packageShortName: string;
  packageGrade: string;
  description: string;
  serviceCategoryType: string;
  msoOrBroadcaster: string;
  packageCreationDate: Date;
  packageInactiveFrom?: Date;
  isActive: boolean;
  
  // Pricing
  isTaxInclusive: boolean;
  baseRate: number;
  taxPercentage: number;
  totalAmount: number;
  drp: number; // Distributor Retail Price
  mrp: number; // Maximum Retail Price

  // Channels
  mappedChannels: PackageChannel[];

  // Statistics (Mock)
  activeCustomers?: number;
  pendingEnquiries?: number;

  // Audit
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
