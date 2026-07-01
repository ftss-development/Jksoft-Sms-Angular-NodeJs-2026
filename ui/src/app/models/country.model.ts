
export enum CountryStatusType {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface Status {
  statusId: number;
  type: CountryStatusType;
}

export interface Country {
  id: string; // Changed to string for Firestore
  fullName: string;
  shortName: string;
  code: string;
  statusId: number;
  status?: Status; // Optional, for display purposes
  // New audit fields
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
