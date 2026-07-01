
export type SignalTypeStatus = 'Active' | 'Inactive' | 'Maintenance' | 'Deprecated';

export interface SignalHistoryEvent {
  id: number;
  title: string;
  description?: string;
  timestamp: Date;
  icon: string;
  type: 'success' | 'info' | 'warning' | 'default';
  user?: string;
}

export interface SignalType {
  id: string; // e.g. SIG-001
  typeName: string; // e.g. Fiber-Optic DWDM
  
  // Status
  status: SignalTypeStatus;
  
  // Technical Specifications (from screenshot)
  signalProtocol?: string; // e.g. TCP/UDP (Encapsulated)
  encodingMethod?: string; // e.g. Manchester Phase
  nominalPower?: string; // e.g. 15 dBm
  frequencyBand?: string; // e.g. 2.4 GHz (Optimized)
  modulationMethod?: string; // e.g. QAM-64
  channelBandwidth?: string; // e.g. 20 MHz / 40 MHz Toggle
  
  // System Metadata
  description: string;
  signalCode?: string; // e.g. SIG-2400-HFD (UUID)
  version?: string; // e.g. v2.1.0-Release
  registrySync?: boolean; // Legacy Compatibility

  // History & Audit
  historyLog: SignalHistoryEvent[];
  ownerDepartment?: string;
  lastValidatedBy?: string;

  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
