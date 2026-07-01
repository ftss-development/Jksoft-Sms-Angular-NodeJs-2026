import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Area } from '../models/area.model';


import { DistrictService } from './district.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/areas';
  private readonly districtService = inject(DistrictService);
  private readonly _areas = signal<Area[]>([]);
  private readonly collectionName = 'areas';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._areas.set(this._generateMockAreas());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const areas: Area[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        areas.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      this._areas.set(areas);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._areas().length === 0) {
            this._areas.set(this._generateMockAreas());
        }
    }
    });
  }

  get areas() {
    return this._areas.asReadonly();
  }

  getAreaById(id: string): Area | undefined {
    return this._areas().find(a => a.id === id);
  }

  async addArea(area: Omit<Area, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newArea = {
      ...area,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newArea));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._areas.update(current => [...current, { ...newArea, id: mockId } as Area]);
    }
  }

  async updateArea(area: Area): Promise<void> {
    const dataToUpdate = {
        ...area,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${area.id}`, firestoreData));
    } else {
        this._areas.update(current => 
            current.map(a => a.id === area.id ? { ...area, ...firestoreData } as Area : a)
        );
    }
  }

  async deleteArea(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._areas.update(current => current.filter(a => a.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const districts = this.districtService.districts();
    if (districts.length === 0) {
        alert('No districts found. Please add districts first.');
        return;
    }

    const dummyData = [];
    const areaNames = ['Downtown', 'Uptown', 'Westside', 'Eastside', 'Harbor', 'Central', 'Heights', 'Valley', 'Park', 'Square'];
    
    for (let i = 0; i < 50; i++) {
        const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
        const nameBase = areaNames[Math.floor(Math.random() * areaNames.length)];
        const suffix = Math.floor(Math.random() * 100);
        
        dummyData.push({
            name: `${nameBase} ${suffix}`,
            shortName: `${nameBase.substring(0, 2).toUpperCase()}${suffix}`,
            pinCode: `${10000 + Math.floor(Math.random() * 90000)}`,
            districtId: randomDistrict.id,
            cityId: randomDistrict.cityId,
            stateId: randomDistrict.stateId,
            countryId: randomDistrict.countryId,
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
        const current = this._areas();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Area));
        this._areas.set([...current, ...newItems]);
    }
  }

  private async _seedData() {
    
    const mockData = this._generateMockAreas();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockAreas(): Area[] {
    return [
      {
        id: '1',
        name: 'Downtown Core',
        shortName: 'DTC',
        pinCode: '10001',
        districtId: '1', // Downtown District
        cityId: '1', // NYC
        stateId: '2', // NY
        countryId: '1', // USA
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-12'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-12')
      },
      {
        id: '2',
        name: 'Silicon Valley',
        shortName: 'SV',
        pinCode: '94025',
        districtId: '3', // Industrial Zone
        cityId: '2', // LA (Using LA for mock simplicity even if Geo is slightly off)
        stateId: '1', // CA
        countryId: '1', // USA
        isActive: true,
        createdBy: 'Admin',
        createdDate: new Date('2023-03-05'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-05')
      },
      {
        id: '3',
        name: 'River North',
        shortName: 'RN',
        pinCode: '60654',
        districtId: '2', // North End
        cityId: '1', // NYC (mock map)
        stateId: '2', 
        countryId: '1',
        isActive: true,
        createdBy: 'Manager',
        createdDate: new Date('2023-02-18'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-02-18')
      },
      {
        id: '4',
        name: 'Hollywood Hills',
        shortName: 'HH',
        pinCode: '90068',
        districtId: '3', // Industrial Zone (mock mapping)
        cityId: '2', // LA
        stateId: '1', // CA
        countryId: '1',
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-20'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-20')
      },
      {
        id: '5',
        name: 'Back Bay',
        shortName: 'BB',
        pinCode: '02116',
        districtId: '1', // Downtown District (mock mapping)
        cityId: '1', // NYC (mock mapping)
        stateId: '2', // NY (mock mapping)
        countryId: '1',
        isActive: false,
        createdBy: 'System',
        createdDate: new Date('2022-12-01'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-01-05')
      }
    ];
  }
}
