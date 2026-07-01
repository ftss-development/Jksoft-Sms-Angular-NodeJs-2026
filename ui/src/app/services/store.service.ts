
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Store, StoreStatus } from '../models/store.model';



@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/stores';
  private readonly _stores = signal<Store[]>([]);
  private readonly collectionName = 'stores';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._stores.set(this._generateMockStores());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const stores: Store[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        stores.push({
          ...data,
          id: doc.id.startsWith('ST-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      // Sort by ID
      stores.sort((a, b) => a.id.localeCompare(b.id));
      this._stores.set(stores);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._stores().length === 0) {
            this._stores.set(this._generateMockStores());
        }
    }
    });
  }

  get stores() {
    return this._stores.asReadonly();
  }

  getStoreById(id: string): Store | undefined {
    return this._stores().find(s => s.id === id);
  }

  async addStore(store: Omit<Store, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail'>): Promise<void> {
    const currentCount = this._stores().length;
    const newId = `ST-${String(currentCount + 1).padStart(3, '0')}`;

    const newStore: Store = {
      ...store,
      id: newId,
      auditTrail: [
        { id: 1, action: 'Store Created', actor: 'System Admin', timestamp: new Date() }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newStore));
    } else {
       this._stores.update(current => [...current, newStore]);
    }
  }

  async updateStore(store: Store): Promise<void> {
    const updatedData = {
        ...store,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
       // Mock implementation for demo if IDs aren't Firestore document keys
       console.log('Update logic triggered for DB');
    }
    
    this._stores.update(current => 
        current.map(s => s.id === store.id ? updatedData : s)
    );
  }

  async deleteStore(id: string): Promise<void> {
     this._stores.update(current => current.filter(s => s.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyStores(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._stores();
        this._stores.set([...current, ...dummyData]);
    }
  }

  private _generateDummyStores(count: number): Store[] {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
    const types = ['Hub', 'Depot', 'Warehouse', 'Center', 'Annex', 'Facility', 'Outlet', 'Store', 'Branch', 'Node'];
    const directions = ['North', 'South', 'East', 'West', 'Central', 'Upper', 'Lower'];

    const generated: Store[] = [];
    const startId = this._stores().length + 10;

    for (let i = 0; i < count; i++) {
        const cityIndex = Math.floor(Math.random() * cities.length);
        const city = cities[cityIndex];
        const state = states[cityIndex];
        const type = types[Math.floor(Math.random() * types.length)];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        const storeName = `${direction} ${city} ${type}`;
        const isActive = Math.random() > 0.1;
        const status: StoreStatus = isActive ? 'Active' : (Math.random() > 0.5 ? 'Inactive' : 'Maintenance');

        generated.push({
            id: `ST-${String(startId + i).padStart(3, '0')}`,
            storeName: storeName,
            location: `${city}, ${state}`,
            status: status,
            description: `Automated inventory node for ${city} region.`,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockStores(): Store[] {
    return [
      {
        id: 'ST-001',
        storeName: 'North Logistics Hub',
        location: 'Chicago, IL',
        status: 'Active',
        description: 'Main Distribution Node',
        createdBy: 'Admin',
        createdDate: new Date('2023-01-10'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-11-20')
      },
      {
        id: 'ST-002',
        storeName: 'Central Warehouse',
        location: 'Denver, CO',
        status: 'Active',
        description: 'National fulfillment center',
        createdBy: 'Admin',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-12-05')
      },
      {
        id: 'ST-003',
        storeName: 'East Distribution Center',
        location: 'New York, NY',
        status: 'Inactive',
        description: 'Legacy regional hub',
        createdBy: 'Manager',
        createdDate: new Date('2023-03-20'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2024-01-10')
      },
      {
        id: 'ST-004',
        storeName: 'Southern Depot',
        location: 'Atlanta, GA',
        status: 'Active',
        description: 'Retail supply point',
        createdBy: 'System',
        createdDate: new Date('2023-04-10'),
        updatedBy: 'System',
        lastUpdated: new Date('2024-02-28')
      },
      {
        id: 'ST-005',
        storeName: 'Western Annex',
        location: 'Seattle, WA',
        status: 'Active',
        description: 'E-commerce overflow facility',
        createdBy: 'Ops Lead',
        createdDate: new Date('2023-05-05'),
        updatedBy: 'Ops Lead',
        lastUpdated: new Date('2024-03-01')
      }
    ];
  }
}
