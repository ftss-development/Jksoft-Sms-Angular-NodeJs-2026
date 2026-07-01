
export interface Channel {
  id: number;
  name: string;
  code: string;
  category: string;
  language: string;
  basePrice: number;
  isHD: boolean;
  isActive: boolean;
  
  // Audit fields
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
