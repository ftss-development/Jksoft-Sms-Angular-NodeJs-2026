
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SignalType, SignalTypeStatus, SignalHistoryEvent } from '../models/signal-type.model';



@Injectable({
  providedIn: 'root'
})
export class SignalTypeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/signal_types';
  private readonly _signalTypes = signal<SignalType[]>([]);
  private readonly collectionName = 'signal_types';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._signalTypes.set(this._generateMockSignalTypes());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const types: SignalType[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        types.push({
          ...data,
          id: data.id || doc.id, // Prefer stored custom ID
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          historyLog: (data.historyLog || []).map((h: any) => ({
             ...h,
             timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp)
          }))
        });
      });
      
      // Sort numerically if ID is SIG-XXX, else string sort
      types.sort((a, b) => {
          const numA = parseInt(a.id.replace('SIG-', '')) || 0;
          const numB = parseInt(b.id.replace('SIG-', '')) || 0;
          return numA - numB;
      });
      
      this._signalTypes.set(types);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._signalTypes().length === 0) {
            this._signalTypes.set(this._generateMockSignalTypes());
        }
    }
    });
  }

  get signalTypes() {
    return this._signalTypes.asReadonly();
  }

  getSignalTypeById(id: string): SignalType | undefined {
    return this._signalTypes().find(s => s.id === id);
  }

  async addSignalType(type: Omit<SignalType, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'historyLog' | 'signalCode' | 'version' | 'registrySync'>): Promise<void> {
    const currentCount = this._signalTypes().length;
    const newId = `SIG-${String(currentCount + 1).padStart(3, '0')}`;

    const newType: SignalType = {
      ...type,
      id: newId,
      signalCode: `${type.typeName.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}-STD`,
      version: 'v1.0.0',
      registrySync: true,
      historyLog: [
        {
          id: 1,
          title: 'Initial Signal Definition Created',
          description: 'New signal type profile generated for network expansion.',
          timestamp: new Date(),
          icon: 'add_circle',
          type: 'default',
          user: 'System Administrator'
        }
      ],
      createdBy: 'System Administrator',
      createdDate: new Date(),
      updatedBy: 'System Administrator',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newType));
    } else {
      this._signalTypes.update(current => [...current, newType]);
    }
  }

  async updateSignalType(type: SignalType): Promise<void> {
    const updatedHistory: SignalHistoryEvent[] = [
      {
        id: Date.now(),
        title: 'Configuration Updated',
        description: 'Metadata and operational parameters modified.',
        timestamp: new Date(),
        icon: 'edit',
        type: 'info',
        user: 'System Administrator'
      },
      ...type.historyLog
    ];

    const dataToUpdate = {
      ...type,
      historyLog: updatedHistory,
      updatedBy: 'System Administrator',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.put(`${this.apiUrl}/${type.id}`, dataToUpdate as any));
    } else {
      this._signalTypes.update(current =>
        current.map(t => t.id === type.id ? dataToUpdate : t)
      );
    }
  }

  async deleteSignalType(id: string): Promise<void> {
    if (true) {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
      this._signalTypes.update(current => current.filter(t => t.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
      const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
      await Promise.all(promises);
      console.log('Successfully added 100 signal types.');
    } else {
      const current = this._signalTypes();
      this._signalTypes.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): SignalType[] {
    const names = ['Fiber-Optic', 'Microwave', 'Satellite', '5G NR', 'Coaxial', 'Digital', 'Analog', 'Quantum', 'Laser', 'Radio', 'Copper', 'Infrared'];
    const variants = ['Single Mode', 'Multi-Mode', 'Ka-Band', 'Ku-Band', 'Point-to-Point', 'Mesh', 'Twisted Pair', 'Broadcast', 'Encrypted', 'High-Freq'];
    const protocols = ['TCP/UDP (Encapsulated)', 'IPv6/Direct', 'Analog Wave', 'Digital Pulse', 'Hybrid-VLAN'];
    const encodings = ['Manchester Phase', 'NRZ', 'Biphase Mark', '4B/5B', '8B/10B'];
    const powers = ['10 dBm', '15 dBm', '20 dBm', '25 dBm', '30 dBm'];
    const frequencies = ['2.4 GHz (Optimized)', '5.0 GHz', '60 GHz', '28 GHz', '850 MHz'];
    const modulations = ['QAM-64', 'QAM-256', 'QPSK', 'OFDM', 'DSSS'];
    const bandwidths = ['20 MHz / 40 MHz Toggle', '80 MHz Fixed', '160 MHz Wide', '10 MHz Narrow'];
    
    const statuses: SignalTypeStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Maintenance', 'Deprecated'];
    
    // Start ID from existing count + 10 to avoid collision with mocks
    const startId = this._signalTypes().length + 10;
    const generated: SignalType[] = [];

    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const variant = variants[Math.floor(Math.random() * variants.length)];
        const fullName = `${name} ${variant}`;
        
        generated.push({
            id: `SIG-${String(startId + i).padStart(3, '0')}`,
            typeName: fullName,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            
            // Tech specs
            signalProtocol: protocols[Math.floor(Math.random() * protocols.length)],
            encodingMethod: encodings[Math.floor(Math.random() * encodings.length)],
            nominalPower: powers[Math.floor(Math.random() * powers.length)],
            frequencyBand: frequencies[Math.floor(Math.random() * frequencies.length)],
            modulationMethod: modulations[Math.floor(Math.random() * modulations.length)],
            channelBandwidth: bandwidths[Math.floor(Math.random() * bandwidths.length)],
            
            description: `Auto-generated specification for ${fullName} covering standard deployment scenarios in the corporate network.`,
            signalCode: `SIG-${name.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 9000)}-X${i}`,
            version: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 9)}.0-Release`,
            registrySync: Math.random() > 0.1,
            
            ownerDepartment: 'Infrastructure Engineering',
            lastValidatedBy: 'Sarah Jenkins (Senior Admin)',
            
            historyLog: [
                { id: 1, title: 'Auto-Generated', description: 'Batch process creation.', timestamp: new Date(), icon: 'smart_toy', type: 'default', user: 'System Bot' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockSignalTypes(): SignalType[] {
    return [
      {
        id: 'SIG-001',
        typeName: 'Fiber Optic (Single Mode)',
        status: 'Active',
        signalProtocol: 'TCP/UDP (Encapsulated)',
        encodingMethod: 'Manchester Phase',
        nominalPower: '15 dBm',
        frequencyBand: '1310 nm (Optical)',
        modulationMethod: 'NRZ',
        channelBandwidth: '100 GHz Grid',
        description: 'High-speed long-range optical transmission standard.',
        signalCode: 'SIG-FIB-8829-X1',
        version: 'v2.1.0-Release',
        registrySync: true,
        ownerDepartment: 'Infrastructure Engineering',
        lastValidatedBy: 'Sarah Jenkins',
        historyLog: [],
        createdBy: 'System Administrator',
        createdDate: new Date('2023-10-24T14:22:10'),
        updatedBy: 'Sarah Jenkins',
        lastUpdated: new Date('2024-01-15T09:45:00')
      },
      {
        id: 'SIG-002',
        typeName: 'Satellite Ka-Band',
        status: 'Inactive',
        signalProtocol: 'DVB-S2',
        encodingMethod: 'BPSK/QPSK',
        nominalPower: '30 dBm',
        frequencyBand: '26.5 - 40.0 GHz',
        modulationMethod: 'APSK',
        channelBandwidth: '36 MHz',
        description: 'High throughput satellite uplink protocol.',
        signalCode: 'SAT-KA-002',
        version: 'v1.0.5',
        registrySync: true,
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-11-05'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-12-20')
      },
      {
        id: 'SIG-003',
        typeName: 'Microwave Point-to-Point',
        status: 'Active',
        signalProtocol: 'IP/MPLS',
        encodingMethod: 'QAM',
        nominalPower: '20 dBm',
        frequencyBand: '18 GHz',
        modulationMethod: '2048-QAM',
        channelBandwidth: '56 MHz',
        description: 'Wireless backhaul for remote sites.',
        signalCode: 'MW-PTP-18G',
        version: 'v3.0.0',
        registrySync: true,
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-08-15'),
        lastUpdated: new Date('2023-08-15')
      },
      {
        id: 'SIG-004',
        typeName: 'Copper Twisted Pair',
        status: 'Active',
        signalProtocol: 'DSL',
        encodingMethod: 'DMT',
        nominalPower: '10 dBm',
        frequencyBand: '100 kHz - 30 MHz',
        modulationMethod: 'QAM',
        channelBandwidth: 'Dynamic',
        description: 'Legacy last-mile connectivity.',
        signalCode: 'COP-TP-04',
        version: 'v1.1',
        registrySync: true,
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-05-20'),
        lastUpdated: new Date('2023-05-20')
      },
      {
        id: 'SIG-005',
        typeName: 'Infrared Transmission',
        status: 'Inactive',
        signalProtocol: 'IrDA',
        encodingMethod: 'Pulse',
        nominalPower: '5 dBm',
        frequencyBand: '300 GHz',
        modulationMethod: 'PPM',
        channelBandwidth: 'Narrow',
        description: 'Short-range line-of-sight communication.',
        signalCode: 'IR-TR-05',
        version: 'v0.9.beta',
        registrySync: false,
        historyLog: [],
        createdBy: 'R&D',
        createdDate: new Date('2023-09-10'),
        lastUpdated: new Date('2024-01-05')
      }
    ];
  }
}
