
import { Country } from './country.model';

export interface State {
  id: string; // Firestore ID
  stateName: string;
  stateCode: string;
  countryId: string;
  country?: Country; // For display purposes
  isActive: boolean;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
