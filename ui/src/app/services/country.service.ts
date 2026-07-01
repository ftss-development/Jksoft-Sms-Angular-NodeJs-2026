import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Country, CountryStatusType, Status } from '../models/country.model';



@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/countries';
  private readonly _countries = signal<Country[]>([]);
  private readonly collectionName = 'countries';

  // Mock data for dropdowns and initial state
  readonly mockStatuses: Status[] = [
    { statusId: 1, type: CountryStatusType.Active },
    { statusId: 2, type: CountryStatusType.Inactive },
  ];

  constructor() {
    if (true) {
        this._initializeRealtimeSync();
    } else {
        this._countries.set(this._generateFallbackMockData());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const countries: Country[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        countries.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      
      this._countries.set(countries);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._countries().length === 0) {
            this._countries.set(this._generateFallbackMockData());
        }
    }
    });
  }

  get countries() {
    return this._countries.asReadonly();
  }

  getCountryById(id: string): Country | undefined {
    return this._countries().find(c => c.id === id);
  }

  async addCountry(newCountry: Omit<Country, 'id' | 'status' | 'createdBy' | 'createdDate' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const status = this.mockStatuses.find(s => s.statusId === newCountry.statusId) || null;
    
    const countryData = {
      fullName: newCountry.fullName || '',
      shortName: newCountry.shortName || '',
      code: newCountry.code || '',
      statusId: newCountry.statusId,
      status: status ? { statusId: status.statusId, type: status.type } : null,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date(),
    };

    if (true) {
        try {
            await lastValueFrom(this.http.post(this.apiUrl, countryData));
        } catch (e) {
            console.error("Error adding country to Firestore:", e);
            throw e;
        }
    } else {
        console.warn('Firestore is not initialized. Saving to local state only.');
        const mockId = (Math.random() * 10000).toString();
        this._countries.update(current => [...current, { ...countryData, id: mockId } as Country]);
    }
  }

  async updateCountry(updatedCountry: Country): Promise<void> {
    const updatedStatus = this.mockStatuses.find(s => s.statusId === updatedCountry.statusId) || null;
    
    const dataToUpdate = {
        fullName: updatedCountry.fullName || '',
        shortName: updatedCountry.shortName || '',
        code: updatedCountry.code || '',
        statusId: updatedCountry.statusId,
        status: updatedStatus ? { statusId: updatedStatus.statusId, type: updatedStatus.type } : null,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    if (true) {
        try {
            await lastValueFrom(this.http.put(`${this.apiUrl}/${updatedCountry.id}`, dataToUpdate));
        } catch (e) {
            console.error("Error updating country in Firestore:", e);
            throw e;
        }
    } else {
        this._countries.update(current => 
            current.map(c => c.id === updatedCountry.id ? { ...c, ...dataToUpdate } : c)
        );
    }
  }

  async deleteCountry(id: string): Promise<void> {
    if (true) {
        try {
            await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
        } catch (e) {
            console.error("Error deleting country from Firestore:", e);
            throw e;
        }
    } else {
        this._countries.update(current => current.filter(c => c.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._countries();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Country));
        this._countries.set([...current, ...newItems]);
    }
  }

  private _generateDummyData(count: number): any[] {
    const countries = [];
    const prefixes = ['New', 'Republic of', 'United', 'South', 'North', 'Kingdom of', 'Federal', 'Democratic', 'Great', 'East'];
    const names = ['Albion', 'Borgia', 'Caledonia', 'Draconia', 'Euphoria', 'Fiji', 'Gallia', 'Hesperia', 'Iberia', 'Jericho', 'Krypton', 'Lemuria', 'Midgard', 'Narnia', 'Oasis', 'Panem', 'Quixote', 'Rohan', 'Sparta', 'Tatooine'];
    
    for (let i = 0; i < count; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = Math.floor(Math.random() * 1000);
        
        const fullName = `${prefix} ${name} ${suffix}`;
        const shortName = `${name.substring(0, 3).toUpperCase()}${suffix}`;
        const code = `+${Math.floor(Math.random() * 899) + 100}`;
        const statusId = Math.random() > 0.2 ? 1 : 2; // 80% chance of Active
        const status = this.mockStatuses.find(s => s.statusId === statusId);

        countries.push({
            fullName,
            shortName,
            code,
            statusId,
            status: status ? { statusId: status.statusId, type: status.type } : null,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return countries;
  }

  getStatusType(statusId: number): CountryStatusType | undefined {
    return this.mockStatuses.find(s => s.statusId === statusId)?.type;
  }

  private async _seedData() {
    
    const mockCountries = this._generateFallbackMockData();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockCountries.forEach(country => {
      // Use the numeric string ID from mock data as the document ID
      const docRef = `${this.apiUrl}/country.id`;
      batch.set(docRef, country);
    });
    await batch.commit();
  }

  private _generateFallbackMockData(): Country[] {
      return [
        {
          id: '1',
          fullName: 'United States',
          shortName: 'USA',
          code: '+1',
          statusId: 1,
          status: this.mockStatuses[0],
          createdBy: 'System Admin',
          createdDate: new Date('2022-10-12T10:45:00'),
          updatedBy: 'John Doe',
          lastUpdated: new Date('2024-02-14T15:20:00'),
        },
        {
          id: '2',
          fullName: 'Canada',
          shortName: 'CAN',
          code: '+1',
          statusId: 1,
          status: this.mockStatuses[0],
          createdBy: 'System Admin',
          createdDate: new Date('2022-11-01T09:00:00'),
          updatedBy: 'John Doe',
          lastUpdated: new Date('2024-01-20T11:00:00'),
        },
        {
          id: '3',
          fullName: 'United Kingdom',
          shortName: 'GBR',
          code: '+44',
          statusId: 1,
          status: this.mockStatuses[0],
          createdBy: 'System Admin',
          createdDate: new Date('2022-09-20T14:30:00'),
          updatedBy: 'Jane Smith',
          lastUpdated: new Date('2023-12-05T10:00:00'),
        },
      ];
  }
}
