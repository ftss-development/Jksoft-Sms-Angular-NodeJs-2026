
export interface Area {
  id: string;
  name: string;
  shortName: string;
  pinCode: string;
  districtId: string;
  // Parent IDs for easier cascading/filtering, though strictly normalized DBs might only store immediate parent
  cityId: string;
  stateId: string;
  countryId: string;
  isActive: boolean;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
