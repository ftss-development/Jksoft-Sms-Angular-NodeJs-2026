
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Particular } from '../models/particular.model';
import { ParticularTypeService } from './particular-type.service';
import { NoteTypeService } from './note-type.service';



@Injectable({
  providedIn: 'root'
})
export class ParticularService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/particulars';
  private readonly particularTypeService = inject(ParticularTypeService);
  private readonly noteTypeService = inject(NoteTypeService);
  
  private readonly _particulars = signal<Particular[]>([]);
  private readonly collectionName = 'particulars';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._particulars.set(this._generateMockParticulars());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const particulars: Particular[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        particulars.push({
          ...data,
          id: doc.id.startsWith('PART-') ? doc.id : data.id || doc.id,
          startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate),
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      // Sort by ID
      particulars.sort((a, b) => a.id.localeCompare(b.id));
      this._particulars.set(particulars);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._particulars().length === 0) {
            this._particulars.set(this._generateMockParticulars());
        }
    }
    });
  }

  get particulars() {
    return this._particulars.asReadonly();
  }

  getParticularById(id: string): Particular | undefined {
    return this._particulars().find(p => p.id === id);
  }

  async addParticular(particular: Omit<Particular, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const currentCount = this._particulars().length;
    const newId = `PART-${String(currentCount + 100).padStart(3, '0')}`;

    const newParticular: Particular = {
      ...particular,
      id: newId,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      // Use the readable ID as the document ID
      const docRef = `${this.apiUrl}/newId`;
      await lastValueFrom(this.http.post(this.apiUrl, newParticular));
    } else {
      this._particulars.update(current => [...current, newParticular]);
    }
  }

  async updateParticular(particular: Particular): Promise<void> {
    const dataToUpdate = {
        ...particular,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._particulars.update(current => 
            current.map(p => p.id === particular.id ? dataToUpdate : p)
        );
    }
  }

  async deleteParticular(id: string): Promise<void> {
     if (true) {
         await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
         this._particulars.update(current => current.filter(p => p.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
    // Access the current value of the signals
    const types = this.particularTypeService.particularTypes();
    const notes = this.noteTypeService.noteTypes();

    if (types.length === 0 || notes.length === 0) {
        alert('Dependencies missing! Please visit "Particular Types" and "Note Types" pages first to generate reference data.');
        return;
    }

    const dummyData = this._generateDummyParticulars(100, types, notes);
    
    if (true) {
        const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
        dummyData.forEach(data => {
            // Use the readable ID (e.g., PART-501) as the document ID for clean URLs
            const docRef = `${this.apiUrl}/data.id`;
            batch.set(docRef, data);
        });
        await batch.commit();
        console.log('Successfully added 100 particulars to Firestore.');
    } else {
        const current = this._particulars();
        this._particulars.set([...current, ...dummyData]);
    }
  }

  private _generateDummyParticulars(count: number, types: any[], notes: any[]): Particular[] {
    const names = ['Tax', 'Fee', 'Charge', 'Discount', 'Penalty', 'Interest', 'Adjustment', 'Credit', 'Debit', 'Levy', 'Surcharge', 'Rebate'];
    const adjs = ['Standard', 'Special', 'Late', 'Early', 'Annual', 'Monthly', 'One-time', 'Recurring', 'Global', 'Regional', 'Corporate', 'Retail'];
    
    const generated: Particular[] = [];
    const startId = this._particulars().length + 500;

    for (let i = 0; i < count; i++) {
        const adj = adjs[Math.floor(Math.random() * adjs.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const fullName = `${adj} ${name} ${i+1}`;
        const shortName = `${adj.substring(0,3).toUpperCase()}-${name.substring(0,3).toUpperCase()}-${i+100}`;
        
        const type = types[Math.floor(Math.random() * types.length)];
        const note = notes[Math.floor(Math.random() * notes.length)];

        generated.push({
            id: `PART-${startId + i}`,
            name: fullName,
            shortName: shortName,
            value: (Math.random() * 500).toFixed(2),
            particularType: type.typeName,
            noteType: note.typeName,
            startDate: new Date(new Date().getTime() - Math.random() * 10000000000), // Random past date
            status: Math.random() > 0.1,
            isActive: Math.random() > 0.1,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockParticulars(): Particular[] {
    return [
      {
        id: 'PART-001',
        name: 'Sales Tax Record',
        shortName: 'ST-REC',
        value: '18.00',
        particularType: 'Operating Expenses', 
        noteType: 'Credit Note',
        startDate: new Date('2023-10-25'),
        status: true,
        isActive: true,
        createdBy: 'John Doe',
        createdDate: new Date('2023-10-12T10:30:00'),
        updatedBy: 'Alice Smith',
        lastUpdated: new Date('2023-10-24T16:15:00')
      },
      {
        id: 'PART-002',
        name: 'Vendor Agreement Alpha',
        shortName: 'VEND-A',
        value: 'Active Contract',
        particularType: 'Revenue',
        noteType: 'Debit Note',
        startDate: new Date('2023-01-01'),
        status: true,
        isActive: true,
        createdBy: 'Legal Dept',
        createdDate: new Date('2022-12-15T09:00:00'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-06-01T11:20:00')
      },
      {
        id: 'PART-003',
        name: 'Employee Policy 2024',
        shortName: 'HR-POL-24',
        value: 'Doc Ref #992',
        particularType: 'Assets',
        noteType: 'Return Voucher',
        startDate: new Date('2024-01-01'),
        status: false,
        isActive: true,
        createdBy: 'HR Manager',
        createdDate: new Date('2023-11-05T14:45:00'),
        updatedBy: 'HR Manager',
        lastUpdated: new Date('2023-11-10T10:00:00')
      }
    ];
  }
}
