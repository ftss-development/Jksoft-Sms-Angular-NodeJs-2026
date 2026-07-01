
export interface Colony {
  id: string;
  name: string;
  shortName: string;
  
  // Hierarchy IDs
  areaId: string;
  districtId: string;
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
