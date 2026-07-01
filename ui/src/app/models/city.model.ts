
export interface City {
  id: string; // Firestore ID
  cityName: string;
  cityCode: string;
  shortName: string;
  stateId: string;
  countryId: string; // Useful for filtering states during creation/edit
  isActive: boolean;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
