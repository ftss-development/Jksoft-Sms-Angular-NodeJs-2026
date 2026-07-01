
export interface NoteTypeParticular {
  id: string;
  name: string;
  description: string;
  accountingCode: string;
}

export interface NoteType {
  id: string; // e.g. NT-001
  typeName: string; // e.g. Credit Note
  description: string;
  isActive: boolean;
  
  // UI Config
  icon: string; // Material symbol name

  // Mock data for detail view
  associatedParticulars?: NoteTypeParticular[];

  // Audit
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
