
export type EnquiryStatus = 'New' | 'In Progress' | 'Closed';

export interface Enquiry {
  id: number;
  enquiryNumber: string; // e.g. ENQ-001
  customerName: string;
  mobileNo: string;
  email: string;
  date: Date;
  status: EnquiryStatus;
  description: string;
  assignedTo?: string;
  resolution?: string;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
