
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StbType, StbStatus, StbHistoryEvent } from '../models/stb-type.model';



@Injectable({
  providedIn: 'root'
})
export class StbTypeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/stb_types';
  private readonly _stbTypes = signal<StbType[]>([]);
  private readonly collectionName = 'stb_types';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._stbTypes.set(this._generateMockData());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const types: StbType[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        types.push({
          ...data,
          id: doc.id.startsWith('STB-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          historyLog: (data.historyLog || []).map((h: any) => ({
             ...h,
             timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp)
          }))
        });
      });
      // Sort by ID
      types.sort((a, b) => a.id.localeCompare(b.id));
      this._stbTypes.set(types);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._stbTypes().length === 0) {
            this._stbTypes.set(this._generateMockData());
        }
    }
    });
  }

  get stbTypes() {
    return this._stbTypes.asReadonly();
  }

  getStbTypeById(id: string): StbType | undefined {
    return this._stbTypes().find(t => t.id === id);
  }

  // FIX: Omitted `manufacturer` from the parameter type as it's hardcoded in the method body.
  async addStbType(stb: Omit<StbType, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'historyLog' | 'manufacturerCode' | 'schemaVersion' | 'category' | 'specs' | 'manufacturer'>): Promise<void> {
    const currentCount = this._stbTypes().length;
    const newId = `STB-GEN-${String(currentCount + 100).padStart(3, '0')}`;

    const newType: StbType = {
      ...stb,
      id: newId,
      manufacturer: 'Generic Systems',
      category: 'Standard STB',
      manufacturerCode: `GEN-${Math.floor(Math.random()*10000)}`,
      schemaVersion: 'v1.0.0',
      specs: {
          supports4k: false,
          wifiConnectivity: true,
          voiceRemote: false,
          bluetooth: false
      },
      historyLog: [
          { 
            id: 1, 
            title: 'Equipment Type Defined', 
            description: 'Initial registration of the STB classification.', 
            timestamp: new Date(), 
            icon: 'add_circle',
            type: 'default'
          }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newType));
    } else {
       this._stbTypes.update(current => [...current, newType]);
    }
  }

  async updateStbType(stb: StbType): Promise<void> {
    const updatedHistory: StbHistoryEvent[] = [
        { 
            id: Date.now(), 
            title: 'Specifications Modified', 
            description: 'Updated hardware capabilities and metadata.', 
            timestamp: new Date(), 
            icon: 'tune',
            type: 'default'
        },
        ...stb.historyLog
    ];

    const dataToUpdate = {
        ...stb,
        historyLog: updatedHistory,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    if (true) {
       // Ideally use doc ID. Assuming mock or consistent ID.
       console.log('Update logic for DB');
    }
    
    this._stbTypes.update(current => 
        current.map(t => t.id === stb.id ? dataToUpdate : t)
    );
  }

  async deleteStbType(id: string): Promise<void> {
     this._stbTypes.update(current => current.filter(t => t.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._stbTypes();
        this._stbTypes.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): StbType[] {
    const names = ['Ultra HD', 'Standard Base', 'Mini Lite', 'Hybrid', 'Pro Receiver', 'Gateway', 'Streamer', 'DVB-C', 'IPTV Box', 'Android TV'];
    const suffixes = ['Edition', 'Plus', 'Max', 'S', 'X', 'Pro', 'V2', 'Prime'];
    const manufacturers = ['Global Electronics', 'TechnoStream', 'VisionSystems', 'NetCommand', 'SkyBox Inc.', 'PrimeMedia'];
    const statuses: StbStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Legacy', 'Pending'];
    
    const generated: StbType[] = [];
    const startId = this._stbTypes().length + 50;

    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const fullName = `${name} ${suffix}`;
        
        generated.push({
            id: `STB-${name.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
            typeName: fullName,
            manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
            category: 'Consumer Electronics / STB',
            manufacturerCode: `MFR-${Math.floor(Math.random() * 90000)}`,
            description: `Auto-generated configuration for ${fullName}. Supports standard broadcast decoding.`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            specs: {
                supports4k: Math.random() > 0.5,
                wifiConnectivity: Math.random() > 0.3,
                voiceRemote: Math.random() > 0.7,
                bluetooth: Math.random() > 0.4
            },
            schemaVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 9)}`,
            historyLog: [
                { id: 1, title: 'Auto-Generated', description: 'Batch import process.', timestamp: new Date(), icon: 'smart_toy', type: 'default' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockData(): StbType[] {
    return [
      {
        id: 'STB-4K-PRO-01',
        typeName: '4K Professional Receiver',
        manufacturer: 'Global Electronics Corp',
        category: 'Consumer Electronics / STB',
        manufacturerCode: 'HYB-4K-G2-800',
        description: 'High-end enterprise model suitable for hospitality and commercial installations. Supports Dolby Atmos and HDR10.',
        status: 'Active',
        specs: {
            supports4k: true,
            wifiConnectivity: true,
            voiceRemote: true,
            bluetooth: true
        },
        schemaVersion: 'v1.2.4',
        historyLog: [
             { id: 1, title: 'Compatibility Certification Updated', description: 'Added validation for Firmware v2.5.0 with updated HDR metadata handling.', timestamp: new Date('2024-03-22T11:45:00'), icon: 'verified', type: 'success' },
             { id: 2, title: 'Specifications Modified', description: 'Updated HDMI port version from 2.0 to 2.1 for the G2 revision.', timestamp: new Date('2024-02-15T15:10:00'), icon: 'edit_note', type: 'default' },
             { id: 3, title: 'Equipment Type Defined', description: 'Initial registration of the 4K Ultra-HD Hybrid STB classification.', timestamp: new Date('2024-01-12T10:00:00'), icon: 'add_circle', type: 'default' }
        ],
        createdBy: 'Inventory Manager',
        createdDate: new Date('2024-01-12T10:00:00'),
        updatedBy: 'Certification Team',
        lastUpdated: new Date('2024-03-22T11:45:00')
      },
      {
        id: 'STB-HD-BASE-05',
        typeName: 'Standard HD Base',
        manufacturer: 'TechnoStream',
        category: 'Residential STB',
        manufacturerCode: 'TS-HD-100',
        description: 'Standard residential deployment unit. Cost-effective and reliable.',
        status: 'Active',
        specs: {
            supports4k: false,
            wifiConnectivity: false,
            voiceRemote: false,
            bluetooth: false
        },
        schemaVersion: 'v1.0.0',
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-11-05'),
        lastUpdated: new Date('2023-11-05')
      },
      {
        id: 'STB-LITE-MN-03',
        typeName: 'Mini Lite Edition',
        manufacturer: 'VisionSystems',
        category: 'Budget STB',
        manufacturerCode: 'VS-MINI-03',
        description: 'Compact form factor for secondary rooms.',
        status: 'Inactive',
        specs: {
            supports4k: false,
            wifiConnectivity: true,
            voiceRemote: false,
            bluetooth: false
        },
        schemaVersion: 'v2.0.1',
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-10-10'),
        lastUpdated: new Date('2024-01-20')
      },
      {
        id: 'STB-HYB-SAT-09',
        typeName: 'Hybrid Satellite/IP',
        manufacturer: 'SkyBox Inc.',
        category: 'Hybrid Receiver',
        manufacturerCode: 'SBX-HYB-900',
        description: 'Dual-mode network support (DVB-S2 + IPTV).',
        status: 'Active',
        specs: {
            supports4k: true,
            wifiConnectivity: true,
            voiceRemote: false,
            bluetooth: true
        },
        schemaVersion: 'v3.1.0',
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-12-01'),
        lastUpdated: new Date('2024-02-28')
      }
    ];
  }
}