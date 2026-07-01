
export interface ParticularGroup {
  id: number;
  groupName: string;
  shortName: string;
  isActive: boolean;
  assignedParticularIds: string[]; 

  // Extended fields for Detail View
  assignedManager?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  nextReviewDate?: Date;

  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
