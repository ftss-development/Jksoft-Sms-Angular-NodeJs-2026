import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ItemMaker } from '../models/item-maker.model';



@Injectable({
  providedIn: 'root'
})
export class ItemMakerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/item_makers';
  private readonly _makers = signal<ItemMaker[]>([]);
  private readonly collectionName = 'item_makers';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._makers.set(this._generateMockMakers());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const makers: ItemMaker[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        makers.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      makers.sort((a, b) => a.id.localeCompare(b.id));
      this._makers.set(makers);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._makers().length === 0) {
            this._makers.set(this._generateMockMakers());
        }
    }
    });
  }

  get makers() {
    return this._makers.asReadonly();
  }

  getMakerById(id: string): ItemMaker | undefined {
    return this._makers().find(m => m.id === id);
  }

  async addMaker(maker: Omit<ItemMaker, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail'>): Promise<void> {
    const newId = `MKR-${String(this._makers().length + 1).padStart(3, '0')}`;

    const newMaker: ItemMaker = {
      ...maker,
      id: newId, 
      auditTrail: [
          { action: 'Maker Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial registration' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       const docRef = `${this.apiUrl}/newId`;
       await lastValueFrom(this.http.put(docRef, newMaker));
    } else {
       this._makers.update(current => [...current, newMaker as ItemMaker]);
    }
  }

  async updateMaker(maker: ItemMaker): Promise<void> {
    const dataToUpdate = {
        ...maker,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._makers.update(current => 
            current.map(m => m.id === maker.id ? dataToUpdate : m)
        );
    }
  }

  async deleteMaker(id: string): Promise<void> {
     if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
        this._makers.update(current => current.filter(m => m.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyMakers(100);
    if (true) {
        const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
        dummyData.forEach(item => {
            const docRef = `${this.apiUrl}/item.id`;
            batch.set(docRef, item);
        });
        await batch.commit();
    } else {
        const current = this._makers();
        this._makers.set([...current, ...dummyData]);
    }
  }

  private _generateDummyMakers(count: number): ItemMaker[] {
    const makers = [];
    const industries = ['Industrial', 'Advanced', 'Global', 'Precision', 'Future', 'Tech', 'Smart', 'Integrated', 'Dynamic', 'Prime'];
    const suffixes = ['Systems', 'Solutions', 'Dynamics', 'Works', 'Engineering', 'Tools', 'Devices', 'Components', 'Robotics', 'Logistics'];
    const locations = ['Berlin, DE', 'Tokyo, JP', 'San Francisco, US', 'Austin, US', 'London, UK', 'Singapore, SG', 'Toronto, CA', 'Seoul, KR'];

    const currentCount = this._makers().length;

    for (let i = 0; i < count; i++) {
        const ind = industries[Math.floor(Math.random() * industries.length)];
        const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
        const makerName = `${ind} ${suf} ${Math.floor(Math.random() * 99)}`;
        const shortName = `${ind.substring(0,3).toUpperCase()}${suf.substring(0,3).toUpperCase()}`;
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        makers.push({
            id: `MKR-${String(currentCount + i + 10).padStart(3, '0')}`,
            makerName,
            shortName,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            description: `Leading manufacturer of ${suf.toLowerCase()} based in ${location}.`,
            headquarters: location,
            website: `www.${shortName.toLowerCase()}-global.com`,
            auditTrail: [
                { action: 'Imported', actor: 'System Seed', timestamp: new Date(), description: 'Bulk data import' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return makers;
  }
  
  private async _seedData() {
      
      const mockData = this._generateMockMakers();
      const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
      mockData.forEach(item => {
          const docRef = `${this.apiUrl}/item.id`;
          batch.set(docRef, item);
      });
      await batch.commit();
  }

  private _generateMockMakers(): ItemMaker[] {
    return [
      {
        id: 'MKR-001',
        makerName: 'Industrial Precision Dynamics',
        shortName: 'IPD',
        status: 'Active',
        description: 'Specializes in high-precision milling tools.',
        headquarters: 'Berlin, DE',
        website: 'www.ipd-tools.com',
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-10'),
        lastUpdated: new Date('2023-01-10')
      },
      {
        id: 'MKR-002',
        makerName: 'TechCore Systems Corp',
        shortName: 'TECHCORE',
        status: 'Active',
        description: 'Computing & IT hardware solutions provider.',
        headquarters: 'San Jose, US',
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-02-15'),
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: 'MKR-003',
        makerName: 'Advanced Safety Solutions Inc',
        shortName: 'ASSI',
        status: 'Inactive',
        description: 'Specialized PPE and safety equipment.',
        headquarters: 'London, UK',
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-03-20'),
        lastUpdated: new Date('2023-11-05')
      }
    ];
  }
}
