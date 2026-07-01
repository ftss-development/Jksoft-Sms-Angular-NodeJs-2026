
export type CompanyStatus = 'Active' | 'Inactive' | 'Pending';

export interface Company {
  id: string;
  companyName: string;
  shortName: string;
  cin: string; // Corporate Identity Number
  status: CompanyStatus;
  companyLevel: string; // e.g., 'Holding Company', 'Subsidiary'
  parentCompanyName?: string; // Optional parent company name for display

  // Contact Info
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  email: string;
  phone: string;

  // Legal & Financial
  gstNo: string;
  panNo: string;
  financialYearCycle: string;
  businessLicenseNo: string;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
