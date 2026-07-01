import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Language } from '../models/language.model';



@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/languages';
  private readonly _languages = signal<Language[]>([]);
  private readonly collectionName = 'languages';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._languages.set(this._generateMockLanguages());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const languages: Language[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        languages.push({
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
      this._languages.set(languages);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._languages().length === 0) {
            this._languages.set(this._generateMockLanguages());
        }
    }
    });
  }

  get languages() {
    return this._languages.asReadonly();
  }

  getLanguageById(id: string): Language | undefined {
    return this._languages().find(l => l.id === id);
  }

  async addLanguage(language: Omit<Language, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail'>): Promise<void> {
    const newLanguage = {
      ...language,
      auditTrail: [],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newLanguage));
    } else {
      const mockId = `L-${(Math.random() * 1000).toFixed(0)}`;
      this._languages.update(current => [...current, { ...newLanguage, id: mockId } as Language]);
    }
  }

  async updateLanguage(language: Language): Promise<void> {
    const dataToUpdate = {
        ...language,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
       const { id, ...firestoreData } = dataToUpdate;
       await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._languages.update(current => 
            current.map(l => l.id === language.id ? dataToUpdate : l)
        );
    }
  }

  async deleteLanguage(id: string): Promise<void> {
     if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
        this._languages.update(current => current.filter(l => l.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyLanguages(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._languages();
        const newItems = dummyData.map((d, i) => ({ ...d, id: `L-${100+i}` } as Language));
        this._languages.set([...current, ...newItems]);
    }
  }

  private _generateDummyLanguages(count: number): any[] {
    const langs = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali'];
    const regions = ['United States', 'United Kingdom', 'Spain', 'Mexico', 'France', 'Canada', 'Germany', 'Austria', 'Italy', 'Brazil', 'Portugal', 'Russia', 'China', 'Singapore', 'Japan', 'South Korea', 'UAE', 'India'];
    
    const generated = [];

    for (let i = 0; i < count; i++) {
        const lang = langs[Math.floor(Math.random() * langs.length)];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const name = `${lang} (${region})`;
        const shortName = `${lang.substring(0,2).toUpperCase()}-${region.substring(0,2).toUpperCase()}`;
        
        generated.push({
            name,
            shortName,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            description: `Localization settings for standard ${lang} in ${region}.`,
            auditTrail: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }
  
  private async _seedData() {
    
    const mockData = this._generateMockLanguages();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockLanguages(): Language[] {
    return [
      {
        id: 'L-001',
        name: 'English (United States)',
        shortName: 'EN-US',
        status: 'Active',
        description: 'Primary system language. Uses MDY date format.',
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: 'L-002',
        name: 'Spanish (Spain)',
        shortName: 'ES-ES',
        status: 'Active',
        description: 'Standard Castilian Spanish.',
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-02-15'),
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: 'L-003',
        name: 'French (France)',
        shortName: 'FR-FR',
        status: 'Active',
        description: 'Standard French localization.',
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-03-10'),
        lastUpdated: new Date('2023-03-10')
      },
      {
        id: 'L-004',
        name: 'German (Germany)',
        shortName: 'DE-DE',
        status: 'Inactive',
        description: 'Configured for standard business German. Includes support for specific regional date formats (DD.MM.YYYY) and Euro currency symbols.',
        auditTrail: [
            { action: 'Status Change', actor: 'Elena Rodriguez', timestamp: new Date('2024-03-02'), description: 'Deactivated temporarily' }
        ],
        createdBy: 'Elena Rodriguez',
        createdDate: new Date('2024-01-15'),
        updatedBy: 'James Wilson',
        lastUpdated: new Date('2024-05-10')
      },
      {
        id: 'L-005',
        name: 'Japanese (Japan)',
        shortName: 'JA-JP',
        status: 'Active',
        description: 'Japanese localization with specialized character set support.',
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-06-20'),
        lastUpdated: new Date('2023-06-20')
      }
    ];
  }
}
