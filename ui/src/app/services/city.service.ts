import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { City } from '../models/city.model';


import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/cities';
  private readonly stateService = inject(StateService);
  private readonly _cities = signal<City[]>([]);
  private readonly collectionName = 'cities';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._cities.set(this._generateMockCities());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const cities: City[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        cities.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      
      this._cities.set(cities);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._cities().length === 0) {
            this._cities.set(this._generateMockCities());
        }
    }
    });
  }

  get cities() {
    return this._cities.asReadonly();
  }

  getCityById(id: string): City | undefined {
    return this._cities().find(c => c.id === id);
  }

  async addCity(city: Omit<City, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newCityData = {
      ...city,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newCityData));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._cities.update(current => [...current, { ...newCityData, id: mockId } as City]);
    }
  }

  async updateCity(city: City): Promise<void> {
    const dataToUpdate = {
        ...city,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${city.id}`, firestoreData));
    } else {
        this._cities.update(current => 
            current.map(c => c.id === city.id ? { ...city, ...firestoreData } as City : c)
        );
    }
  }

  async deleteCity(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._cities.update(current => current.filter(c => c.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const states = this.stateService.states();
    if (states.length === 0) {
        alert('No states found. Please add states first.');
        return;
    }

    const dummyData = [];
    const cityNames = ['Springfield', 'Rivertown', 'Hill Valley', 'Metropolis', 'Gotham', 'Star City', 'Central City', 'Coast City', 'Smallville', 'Blüdhaven'];
    
    for (let i = 0; i < 50; i++) {
        const randomState = states[Math.floor(Math.random() * states.length)];
        const nameBase = cityNames[Math.floor(Math.random() * cityNames.length)];
        const suffix = Math.floor(Math.random() * 1000);
        
        dummyData.push({
            cityName: `${nameBase} ${suffix}`,
            cityCode: `${nameBase.substring(0, 3).toUpperCase()}${suffix}`,
            shortName: `${nameBase.substring(0, 2).toUpperCase()}`,
            stateId: randomState.id,
            countryId: randomState.countryId,
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
        const current = this._cities();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as City));
        this._cities.set([...current, ...newItems]);
    }
  }

  private async _seedData() {
    
    const mockData = this._generateMockCities();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockCities(): City[] {
    return [
      {
        id: '1',
        cityName: 'New York City',
        cityCode: 'NYC',
        shortName: 'NY',
        stateId: '2', // NY
        countryId: '1', // USA
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: '2',
        cityName: 'Los Angeles',
        cityCode: 'LAX',
        shortName: 'LA',
        stateId: '1', // CA
        countryId: '1', // USA
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-02'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-02')
      },
      {
        id: '3',
        cityName: 'Toronto',
        cityCode: 'TOR',
        shortName: 'TO',
        stateId: '4', // ON
        countryId: '2', // Canada
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-03-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-15')
      }
    ];
  }
}
