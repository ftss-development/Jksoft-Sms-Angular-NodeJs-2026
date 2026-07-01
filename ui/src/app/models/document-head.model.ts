
import { DocumentCategory } from './document-category.model';

export type HeadStatus = 'Active' | 'Inactive';

export interface HeadRevision {
  id: number;
  changeDescription: string;
  modifiedBy: string;
  date: Date;
}

export interface DocumentHead {
  id: string; // e.g., DH-001
  headName: string;
  shortName: string;
  description?: string;
  
  parentCategoryId: string;
  parentCategoryName?: string; // For display convenience
  
  status: HeadStatus;

  // Audit
  revisionHistory?: HeadRevision[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
