import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { State } from '../models/state.model';
import { CountryService } from './country.service';
import { Country } from '../models/country.model';



@Injectable({
  providedIn: 'root'
})
export class StateService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/states';
  private readonly countryService = inject(CountryService);
  private readonly _states = signal<State[]>([]);
  private readonly collectionName = 'states';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._states.set(this._generateMockStates());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const states: State[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        states.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      
      this._states.set(states);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._states().length === 0) {
            this._states.set(this._generateMockStates());
        }
    }
    });
  }

  get states() {
    return this._states.asReadonly();
  }

  getStateById(id: string): State | undefined {
    return this._states().find(s => s.id === id);
  }

  async addState(state: Omit<State, 'id' | 'country' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newStateData = {
      ...state,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newStateData));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._states.update(current => [...current, { ...newStateData, id: mockId } as State]);
    }
  }

  async updateState(state: State): Promise<void> {
    const dataToUpdate = {
        ...state,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, country, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${state.id}`, firestoreData));
    } else {
        this._states.update(current => 
            current.map(s => s.id === state.id ? { ...state, ...firestoreData } as State : s)
        );
    }
  }

  async deleteState(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._states.update(current => current.filter(s => s.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const countries = this.countryService.countries();
    if (countries.length === 0) {
        alert('No countries found. Please add countries in the Country Management page first so states can be linked.');
        return;
    }

    const dummyData = this._generateDummyStates(100, countries);
    
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._states();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as State));
        this._states.set([...current, ...newItems]);
    }
  }

  private _generateDummyStates(count: number, countries: Country[]): any[] {
      const states = [];
      const prefixes = ['North', 'South', 'East', 'West', 'Upper', 'Lower', 'New', 'Old', 'Great'];
      const roots = ['Dakota', 'Carolina', 'Virginia', 'York', 'Hampshire', 'Jersey', 'Mexico', 'Island', 'Lands', 'Territory', 'Province', 'Region'];
      
      for (let i = 0; i < count; i++) {
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          const root = roots[Math.floor(Math.random() * roots.length)];
          const suffix = Math.floor(Math.random() * 1000);
          
          const stateName = `${prefix} ${root} ${suffix}`;
          const stateCode = `${prefix.charAt(0)}${root.charAt(0)}${suffix}`.toUpperCase();
          
          const randomCountry = countries[Math.floor(Math.random() * countries.length)];

          states.push({
              stateName,
              stateCode,
              countryId: randomCountry.id,
              isActive: Math.random() > 0.2, // 80% active
              createdBy: 'System Seed',
              createdDate: new Date(),
              updatedBy: 'System Seed',
              lastUpdated: new Date()
          });
      }
      return states;
  }

  private async _seedData() {
    
    const mockData = this._generateMockStates();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockStates(): State[] {
    return [
      {
        id: '1',
        stateName: 'California',
        stateCode: 'CA',
        countryId: '1', // USA
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: '2',
        stateName: 'New York',
        stateCode: 'NY',
        countryId: '1', // USA
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-02'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-02')
      },
      {
        id: '3',
        stateName: 'Maharashtra',
        stateCode: 'MH',
        countryId: '3', // Assuming mock ID for UK or India logic, mapped loosely
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: '4',
        stateName: 'Ontario',
        stateCode: 'ON',
        countryId: '2', // Canada
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-03-10'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-10')
      }
    ];
  }
}
