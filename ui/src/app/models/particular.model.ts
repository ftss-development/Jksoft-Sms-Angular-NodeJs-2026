
export interface Particular {
  id: string; // Changed to string for Firestore consistency
  name: string;
  shortName: string;
  value: string;
  particularType: string; // Stores the Name of the type for display
  noteType: string;       // Stores the Name of the note type for display
  startDate: Date;
  status: boolean; // Corresponds to "Status: Enable this particular"
  isActive: boolean; // Corresponds to "Is Active: Mark record as active"

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
