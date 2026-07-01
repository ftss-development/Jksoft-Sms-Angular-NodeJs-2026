import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { District, DistrictStatus } from '../models/district.model';


import { CityService } from './city.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/districts';
  private readonly cityService = inject(CityService);
  private readonly _districts = signal<District[]>([]);
  private readonly collectionName = 'districts';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._districts.set(this._generateMockDistricts());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const districts: District[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        districts.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      
      this._districts.set(districts);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._districts().length === 0) {
            this._districts.set(this._generateMockDistricts());
        }
    }
    });
  }

  get districts() {
    return this._districts.asReadonly();
  }

  getDistrictById(id: string): District | undefined {
    return this._districts().find(d => d.id === id);
  }

  async addDistrict(district: Omit<District, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newDoc = {
      ...district,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newDoc));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._districts.update(current => [...current, { ...newDoc, id: mockId } as District]);
    }
  }

  async updateDistrict(district: District): Promise<void> {
    const dataToUpdate = {
        ...district,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${district.id}`, firestoreData));
    } else {
        this._districts.update(current => 
            current.map(d => d.id === district.id ? { ...district, ...firestoreData } as District : d)
        );
    }
  }

  async deleteDistrict(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._districts.update(current => current.filter(d => d.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const cities = this.cityService.cities();
    if (cities.length === 0) {
        alert('No cities found. Please add cities in City Management first so districts can be linked.');
        return;
    }

    const dummyData = this._generateDummyDistricts(100, cities);
    
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._districts();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as District));
        this._districts.set([...current, ...newItems]);
    }
  }

  private _generateDummyDistricts(count: number, cities: any[]): any[] {
      const districts = [];
      const prefixes = ['North', 'South', 'East', 'West', 'Central', 'Upper', 'Lower', 'New', 'Old', 'Port', 'Fort', 'Mount', 'Lake'];
      const roots = ['Park', 'Hill', 'View', 'Side', 'Wood', 'Ridge', 'Valley', 'Grove', 'Heights', 'Springs', 'Falls', 'Point', 'Bay'];
      const statuses: DistrictStatus[] = ['Active', 'Active', 'Active', 'Pending', 'Archived']; // Weighted towards Active

      for (let i = 0; i < count; i++) {
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          const root = roots[Math.floor(Math.random() * roots.length)];
          const suffix = Math.floor(Math.random() * 100);
          
          const name = `${prefix} ${root} ${suffix}`;
          const districtCode = `DIST-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
          const shortName = `${prefix.substring(0,1)}${root.substring(0,3).toUpperCase()}`;
          
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          districts.push({
              name,
              districtCode,
              shortName,
              cityId: randomCity.id,
              stateId: randomCity.stateId,
              countryId: randomCity.countryId,
              status: status,
              createdBy: 'System Seed',
              createdDate: new Date(),
              updatedBy: 'System Seed',
              lastUpdated: new Date()
          });
      }
      return districts;
  }
  
  private async _seedData() {
    
    const mockData = this._generateMockDistricts();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockDistricts(): District[] {
    // Matching the screenshot data where possible
    return [
      {
        id: '1',
        name: 'Downtown District',
        districtCode: 'DIST-001',
        shortName: 'DNTN',
        cityId: '1', // Matches NYC in CityService mock
        stateId: '2', // NY
        countryId: '1', // USA
        status: 'Active',
        createdBy: 'System',
        createdDate: new Date('2023-01-10'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-01-12')
      },
      {
        id: '2',
        name: 'North End',
        districtCode: 'DIST-042',
        shortName: 'NEND',
        cityId: '1', // Assumed Gotham map to NYC for demo
        stateId: '2',
        countryId: '1',
        status: 'Active',
        createdBy: 'System',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-02-20')
      },
      {
        id: '3',
        name: 'Industrial Zone',
        districtCode: 'DIST-019',
        shortName: 'IZON',
        cityId: '2', // LA
        stateId: '1', // CA
        countryId: '1',
        status: 'Pending',
        createdBy: 'Manager',
        createdDate: new Date('2023-03-01'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-03-01')
      },
      {
        id: '4',
        name: 'Waterfront',
        districtCode: 'DIST-088',
        shortName: 'WFRT',
        cityId: '2',
        stateId: '1',
        countryId: '1',
        status: 'Archived',
        createdBy: 'System',
        createdDate: new Date('2022-11-05'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-01')
      }
    ];
  }
}
