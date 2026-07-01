
export type StbStatus = 'Active' | 'Inactive' | 'Legacy' | 'Pending';

export interface StbHistoryEvent {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  type: 'success' | 'info' | 'warning' | 'default';
}

export interface HardwareSpecs {
  supports4k: boolean;
  wifiConnectivity: boolean;
  voiceRemote: boolean;
  bluetooth: boolean;
}

export interface StbType {
  id: string; // e.g. STB-4K-PRO-01
  typeName: string; // e.g. 4K Professional Receiver
  manufacturer: string; // e.g. Global Electronics Corp
  category: string; // e.g. Consumer Electronics / STB
  manufacturerCode: string; // e.g. HYB-4K-G2-800
  description: string;
  status: StbStatus;
  
  // Hardware Specs
  specs: HardwareSpecs;

  // System Metadata
  schemaVersion?: string;
  
  // Audit
  historyLog: StbHistoryEvent[];
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
