import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Colony } from '../models/colony.model';


import { AreaService } from './area.service';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/colonies';
  private readonly areaService = inject(AreaService);
  private readonly _colonies = signal<Colony[]>([]);
  private readonly collectionName = 'colonies';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._colonies.set(this._generateMockColonies());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const colonies: Colony[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        colonies.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      this._colonies.set(colonies);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._colonies().length === 0) {
            this._colonies.set(this._generateMockColonies());
        }
    }
    });
  }

  get colonies() {
    return this._colonies.asReadonly();
  }

  getColonyById(id: string): Colony | undefined {
    return this._colonies().find(c => c.id === id);
  }

  async addColony(colony: Omit<Colony, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newColony = {
      ...colony,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newColony));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._colonies.update(current => [...current, { ...newColony, id: mockId } as Colony]);
    }
  }

  async updateColony(colony: Colony): Promise<void> {
    const dataToUpdate = {
        ...colony,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${colony.id}`, firestoreData));
    } else {
        this._colonies.update(current => 
            current.map(c => c.id === colony.id ? { ...colony, ...firestoreData } as Colony : c)
        );
    }
  }

  async deleteColony(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._colonies.update(current => current.filter(c => c.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const areas = this.areaService.areas();
    if (areas.length === 0) {
        alert('No areas found. Please add areas first.');
        return;
    }

    const dummyData = [];
    const colonyNames = ['Gardens', 'Enclave', 'Residency', 'Towers', 'Meadows', 'Greens', 'Villas', 'Estate', 'Society', 'Plaza'];
    
    for (let i = 0; i < 50; i++) {
        const randomArea = areas[Math.floor(Math.random() * areas.length)];
        const nameBase = colonyNames[Math.floor(Math.random() * colonyNames.length)];
        const suffix = Math.floor(Math.random() * 100);
        
        dummyData.push({
            name: `${randomArea.shortName} ${nameBase} ${suffix}`,
            shortName: `${nameBase.substring(0, 3).toUpperCase()}${suffix}`,
            areaId: randomArea.id,
            districtId: randomArea.districtId,
            cityId: randomArea.cityId,
            stateId: randomArea.stateId,
            countryId: randomArea.countryId,
            isActive: Math.random() > 0.1,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._colonies();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Colony));
        this._colonies.set([...current, ...newItems]);
    }
  }

  private async _seedData() {
    
    const mockData = this._generateMockColonies();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockColonies(): Colony[] {
    // Matching screenshot data
    return [
      {
        id: '1',
        name: 'Greenwood Heights',
        shortName: 'GWH',
        areaId: '1', // Downtown Core
        districtId: '1', // Downtown District
        cityId: '1', // NYC
        stateId: '2', // NY
        countryId: '1', // USA
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-15'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-15')
      },
      {
        id: '2',
        name: 'Sunrise Valley',
        shortName: 'SRV',
        areaId: '2', // Silicon Valley
        districtId: '3', // Industrial Zone
        cityId: '2', // LA
        stateId: '1', // CA
        countryId: '1',
        isActive: true,
        createdBy: 'Admin',
        createdDate: new Date('2023-03-10'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-10')
      },
      {
        id: '3',
        name: 'Maple Leaf',
        shortName: 'MLF',
        areaId: '3', // River North
        districtId: '2', // North End
        cityId: '1', // NYC (mock map)
        stateId: '2', 
        countryId: '1',
        isActive: true,
        createdBy: 'Manager',
        createdDate: new Date('2023-02-25'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-02-25')
      },
      {
        id: '4',
        name: 'Ocean View',
        shortName: 'OCV',
        areaId: '2', // Silicon Valley (mock)
        districtId: '3', 
        cityId: '2', // LA
        stateId: '1',
        countryId: '1',
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-04-05'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-04-05')
      },
      {
        id: '5',
        name: 'Highland Park',
        shortName: 'HLP',
        areaId: '1', // Downtown Core
        districtId: '1',
        cityId: '1',
        stateId: '2',
        countryId: '1',
        isActive: false,
        createdBy: 'Admin',
        createdDate: new Date('2023-01-20'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-01-20')
      }
    ];
  }
}
