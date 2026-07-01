import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NoteType, NoteTypeParticular } from '../models/note-type.model';



@Injectable({
  providedIn: 'root'
})
export class NoteTypeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/note_types';
  private readonly _noteTypes = signal<NoteType[]>([]);
  private readonly collectionName = 'note_types';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._noteTypes.set(this._generateMockNoteTypes());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const types: NoteType[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        types.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      types.sort((a, b) => a.id.localeCompare(b.id));
      this._noteTypes.set(types);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._noteTypes().length === 0) {
            this._noteTypes.set(this._generateMockNoteTypes());
        }
    }
    });
  }

  get noteTypes() {
    return this._noteTypes.asReadonly();
  }

  getNoteTypeById(id: string): NoteType | undefined {
    return this._noteTypes().find(n => n.id === id);
  }

  async addNoteType(noteType: Omit<NoteType, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'associatedParticulars'>): Promise<void> {
    const currentCount = this._noteTypes().length;
    const newId = `NT-${String(currentCount + 1).padStart(3, '0')}`;
    
    const newType: NoteType = {
      ...noteType,
      id: newId,
      associatedParticulars: [], // Default empty
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       const docRef = `${this.apiUrl}/newId`;
       await lastValueFrom(this.http.put(docRef, newType));
    } else {
       this._noteTypes.update(current => [...current, newType]);
    }
  }

  async updateNoteType(noteType: NoteType): Promise<void> {
    const dataToUpdate = {
        ...noteType,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
       const { id, ...firestoreData } = dataToUpdate;
       await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._noteTypes.update(current => 
            current.map(n => n.id === noteType.id ? dataToUpdate : n)
        );
    }
  }

  async deleteNoteType(id: string): Promise<void> {
     if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
        this._noteTypes.update(current => current.filter(n => n.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._noteTypes();
        this._noteTypes.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): NoteType[] {
    const names = ['Credit', 'Debit', 'Refund', 'Adjustment', 'Transfer', 'Payment', 'Rebate', 'Interest', 'Fee', 'Tax', 'Voucher', 'Write-off'];
    const suffixes = ['Entry', 'Note', 'Slip', 'Advice', 'Record', 'Memo', 'Transaction'];
    const icons = ['payments', 'account_balance_wallet', 'receipt_long', 'request_quote', 'currency_exchange', 'credit_card', 'savings'];

    const generated: NoteType[] = [];
    const startId = this._noteTypes().length + 10;

    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const fullName = `${name} ${suffix}`;
        
        generated.push({
            id: `NT-${String(startId + i).padStart(3, '0')}`,
            typeName: fullName,
            description: `Standard system classification for ${fullName.toLowerCase()} operations.`,
            isActive: Math.random() > 0.1,
            icon: icons[Math.floor(Math.random() * icons.length)],
            associatedParticulars: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }
  
  private async _seedData() {
    
    const mockData = this._generateMockNoteTypes();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockNoteTypes(): NoteType[] {
    return [
      {
        id: 'NT-001',
        typeName: 'Credit Note',
        description: 'Issued to a customer for returned goods or services.',
        isActive: true,
        icon: 'payments',
        associatedParticulars: [
            { id: '1', name: 'Sales Return Adjustment', description: 'Adjustment for products returned by customer within 30 days.', accountingCode: '40010-001' },
            { id: '2', name: 'Tax Correction', description: 'Reversal of overcharged VAT from previous billing cycle.', accountingCode: '22000-405' },
            { id: '3', name: 'Promotional Discount', description: 'Retroactive application of seasonal campaign discounts.', accountingCode: '50500-112' },
            { id: '4', name: 'Inventory Damage Credit', description: 'Credit issued for items damaged during transit to client.', accountingCode: '60210-990' }
        ],
        createdBy: 'Admin User',
        createdDate: new Date('2023-10-24T10:45:00'),
        updatedBy: 'System Process',
        lastUpdated: new Date('2023-11-12T15:20:00')
      },
      {
        id: 'NT-002',
        typeName: 'Debit Note',
        description: 'Issued by a vendor to correct undercharged invoices.',
        isActive: true,
        icon: 'account_balance_wallet',
        associatedParticulars: [],
        createdBy: 'Finance Lead',
        createdDate: new Date('2023-09-15'),
        lastUpdated: new Date('2023-09-15')
      },
      {
        id: 'NT-003',
        typeName: 'Rebate Note',
        description: 'Periodic volume-based rebates for distributors.',
        isActive: false,
        icon: 'history',
        associatedParticulars: [],
        createdBy: 'Sales Director',
        createdDate: new Date('2023-08-01'),
        lastUpdated: new Date('2024-01-10')
      },
      {
        id: 'NT-004',
        typeName: 'Return Voucher',
        description: 'Internal voucher for stock return processing.',
        isActive: true,
        icon: 'assignment_return',
        associatedParticulars: [],
        createdBy: 'Warehouse Ops',
        createdDate: new Date('2023-12-05'),
        lastUpdated: new Date('2023-12-05')
      }
    ];
  }
}
