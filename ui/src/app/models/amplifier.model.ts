
export type AmplifierStatus = 'Active' | 'Inactive' | 'Maintenance';

export interface Amplifier {
  id: number;
  name: string;
  description: string; // e.g., "Main Distribution Hub"
  serialNumber: string;
  model: string;
  status: AmplifierStatus;
  zone: string;
  location: string;
  installDate: Date;
  
  // Technical specs (optional for display)
  ipAddress?: string;
  firmwareVersion?: string;

  // Audit
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
