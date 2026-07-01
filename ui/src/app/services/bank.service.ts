import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Bank } from '../models/bank.model';



@Injectable({
  providedIn: 'root'
})
export class BankService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/banks';
  private readonly _banks = signal<Bank[]>([]);
  private readonly collectionName = 'banks';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._banks.set(this._generateMockBanks());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const banks: Bank[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        banks.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      this._banks.set(banks);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._banks().length === 0) {
            this._banks.set(this._generateMockBanks());
        }
    }
    });
  }

  get banks() {
    return this._banks.asReadonly();
  }

  getBankById(id: string): Bank | undefined {
    return this._banks().find(b => b.id === id);
  }

  async addBank(bank: Omit<Bank, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newBank = {
      ...bank,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newBank));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._banks.update(current => [...current, { ...newBank, id: mockId } as Bank]);
    }
  }

  async updateBank(bank: Bank): Promise<void> {
    const dataToUpdate = {
        ...bank,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${bank.id}`, firestoreData));
    } else {
        this._banks.update(current => 
            current.map(b => b.id === bank.id ? { ...bank, ...firestoreData } as Bank : b)
        );
    }
  }

  async deleteBank(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._banks.update(current => current.filter(b => b.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyBanks(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._banks();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Bank));
        this._banks.set([...current, ...newItems]);
    }
  }

  private _generateDummyBanks(count: number): any[] {
    const banks = [];
    const prefixes = ['National', 'First', 'United', 'Global', 'Royal', 'City', 'State', 'Federal', 'Community', 'Alliance'];
    const types = ['Bank', 'Credit Union', 'Financial', 'Trust', 'Savings', 'Capital', 'Group', 'Holdings'];
    const locations = ['of America', 'International', 'Partners', 'Systems', 'Worldwide', 'Corp', 'Ltd', 'Inc'];

    for (let i = 0; i < count; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const suffix = Math.floor(Math.random() * 1000);

        const bankName = `${prefix} ${type} ${location} ${suffix}`;
        const shortName = `${prefix.charAt(0)}${type.charAt(0)}${location.charAt(0)}${suffix}`.toUpperCase();
        const code = `${shortName.substring(0,4)}-${Math.floor(Math.random() * 999)}-MOB`;

        banks.push({
            bankName,
            shortName,
            code,
            category: 'Commercial Bank',
            swiftCode: `${shortName}US33`,
            isActive: Math.random() > 0.1, // 90% active
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return banks;
  }
  
  private async _seedData() {
    
    const mockData = this._generateMockBanks();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockBanks(): Bank[] {
    return [
      {
        id: '1',
        bankName: 'Bank of Nova Scotia',
        shortName: 'BNS GLOBAL',
        code: 'BNS-77420',
        category: 'Commercial Bank',
        swiftCode: 'NOSCUS44XXX',
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-10'),
        updatedBy: 'Sarah Jenkins',
        lastUpdated: new Date('2023-12-14T14:30:00')
      },
      {
        id: '2',
        bankName: 'HSBC Holdings plc',
        shortName: 'HSBC',
        code: 'HSBC - GLOBAL',
        category: 'Investment Bank',
        swiftCode: 'HSBCGB2L',
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-03-05'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-05')
      },
      {
        id: '3',
        bankName: 'Wells Fargo & Co.',
        shortName: 'Wells',
        code: 'WF - US - MAIN',
        category: 'Retail Bank',
        swiftCode: 'WFBUS6S',
        isActive: false,
        createdBy: 'Manager',
        createdDate: new Date('2023-04-12'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-05-20')
      },
      {
        id: '4',
        bankName: 'State Bank of India',
        shortName: 'SBI',
        code: 'SBI - IN - 01',
        category: 'Public Sector',
        swiftCode: 'SBIN0001',
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-06-01'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-06-01')
      }
    ];
  }
}
