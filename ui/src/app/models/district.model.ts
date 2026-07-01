
export type DistrictStatus = 'Active' | 'Pending' | 'Archived';

export interface District {
  id: string;
  name: string;
  districtCode: string; // e.g. DIST-001
  shortName: string;
  cityId: string;
  // We store stateId/countryId optionally to help with cascading dropdowns/display, 
  // though they are technically derived from cityId.
  stateId: string;
  countryId: string; 
  status: DistrictStatus;
  
  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
