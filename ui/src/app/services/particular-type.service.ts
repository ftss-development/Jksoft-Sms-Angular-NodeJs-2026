
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ParticularType, ParticularTypeStatus } from '../models/particular-type.model';



@Injectable({
  providedIn: 'root'
})
export class ParticularTypeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/particular_types';
  private readonly _particularTypes = signal<ParticularType[]>([]);
  private readonly collectionName = 'particular_types';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._particularTypes.set(this._generateMockData());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const types: ParticularType[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        types.push({
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
      types.sort((a, b) => a.id.localeCompare(b.id));
      this._particularTypes.set(types);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._particularTypes().length === 0) {
            this._particularTypes.set(this._generateMockData());
        }
    }
    });
  }

  get particularTypes() {
    return this._particularTypes.asReadonly();
  }

  getParticularTypeById(id: string): ParticularType | undefined {
    return this._particularTypes().find(p => p.id === id);
  }

  async addParticularType(pt: Omit<ParticularType, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'businessUnits' | 'typeCode'>): Promise<void> {
    const currentCount = this._particularTypes().length;
    const nextNum = currentCount + 101;
    const typeCode = `PT-${nextNum}`;

    const newType: ParticularType = {
      ...pt,
      id: true ? undefined : typeCode, // Firestore uses auto-id, local uses code
      typeCode: typeCode,
      businessUnits: [],
      auditTrail: [
        { id: 1, title: 'Particular Type Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial classification setup.', icon: 'add_circle', colorClass: 'bg-emerald-100 text-emerald-600' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       // We use typeCode as document ID for cleaner URLs if desired, or let Firestore generate.
       // Let's use Firestore auto-gen but store the data.
       const { id, ...data } = newType; 
       // Optionally store with custom ID:
       const docRef = `${this.apiUrl}/typeCode`;
       await lastValueFrom(this.http.put(docRef, data)); 
    } else {
       this._particularTypes.update(current => [...current, newType as ParticularType]);
    }
  }
  
  // Helper for setDoc since I didn't import it above initially (fixed in logic below)
  
  async updateParticularType(pt: ParticularType): Promise<void> {
    const updatedAudit = [
        { id: Date.now(), title: 'Configuration Updated', actor: 'System Admin', timestamp: new Date(), description: 'Metadata modified.', icon: 'edit', colorClass: 'bg-blue-100 text-blue-600' },
        ...(pt.auditTrail || [])
    ];
    
    const dataToUpdate = {
        ...pt,
        auditTrail: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
        const { id, ...firestoreData } = dataToUpdate;
        // Assuming ID matches document ID for simplicity in this generated code
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._particularTypes.update(current => 
            current.map(p => p.id === pt.id ? dataToUpdate : p)
        );
    }
  }

  async deleteParticularType(id: string): Promise<void> {
     if (true) {
         await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
         this._particularTypes.update(current => current.filter(p => p.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
        dummyData.forEach(data => {
            const docRef = `${this.apiUrl}/data.id`;
            batch.set(docRef, data);
        });
        await batch.commit();
    } else {
        this._particularTypes.update(current => [...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): ParticularType[] {
    const categories = ['Operating Expenses', 'Revenue', 'Assets', 'Liabilities', 'Equity', 'Cost of Goods Sold'];
    const names = ['Service Fee', 'Consulting Charge', 'Hardware Rental', 'Software License', 'Maintenance', 'Support', 'Audit Fee', 'Legal Retainer', 'Marketing Spend', 'Travel Expense'];
    const statuses: ParticularTypeStatus[] = ['Active', 'Inactive', 'Production Active'];
    
    const generated: ParticularType[] = [];
    const startNum = this._particularTypes().length + 100;

    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = Math.floor(Math.random() * 1000);
        const code = `PT-${startNum + i}`;
        
        generated.push({
            id: code,
            typeCode: code,
            typeName: `${name} ${suffix}`,
            description: `Standard classification for ${name.toLowerCase()} accounting entries.`,
            category: categories[Math.floor(Math.random() * categories.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            defaultGlGroup: `${Math.floor(Math.random() * 8999) + 1000} - GEN - ${Math.floor(Math.random() * 99)}`,
            taxEligibility: Math.random() > 0.5 ? 'Subject to Standard VAT' : 'Tax Exempt',
            businessUnits: [
                { id: 1, region: 'EMEA', unitName: 'UK Operations', usageStatus: 'Primary' }
            ],
            auditTrail: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockData(): ParticularType[] {
    return [
      {
        id: 'PT-402',
        typeCode: 'PT-402',
        typeName: 'Professional Service Fees',
        description: 'Standard classification for all professional services including consulting, legal advisory, and technical implementation fees across international subsidiaries.',
        category: 'Operating Expenses',
        status: 'Production Active',
        defaultGlGroup: '5000-SERVIC-01',
        taxEligibility: 'Subject to Standard VAT',
        businessUnits: [
            { id: 1, region: 'EMEA', unitName: 'UK Operations HQ', usageStatus: 'Primary' },
            { id: 2, region: 'AMER', unitName: 'US Sales Division', usageStatus: 'Enabled' }
        ],
        auditTrail: [
            { id: 1, title: 'Configuration Updated', actor: 'Sarah Chen', timestamp: new Date('2023-11-22T10:45:00'), description: 'Updated \'Default GL Group\' and modified description for better clarity.', icon: 'edit', colorClass: 'bg-blue-100 text-blue-600' },
            { id: 2, title: 'Status Changed', actor: 'Robert King', timestamp: new Date('2023-06-14T15:20:00'), description: 'Moved from \'Review\' to \'Production Active\'.', icon: 'sync', colorClass: 'bg-slate-100 text-slate-600' },
            { id: 3, title: 'Particular Type Created', actor: 'System Admin', timestamp: new Date('2023-01-15T09:00:00'), description: 'Initial setup of Professional Service Fees classification.', icon: 'add_circle', colorClass: 'bg-slate-100 text-slate-600' }
        ],
        createdBy: 'System Admin',
        createdDate: new Date('2023-01-15'),
        updatedBy: 'Sarah Chen',
        lastUpdated: new Date('2023-11-22T10:45:00')
      },
      {
        id: 'PT-001',
        typeCode: 'PT-001',
        typeName: 'Standard Revenue',
        description: 'Core revenue stream from primary business operations.',
        category: 'Revenue',
        status: 'Active',
        defaultGlGroup: '4000-REV-MAIN',
        taxEligibility: 'Subject to Standard VAT',
        businessUnits: [],
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: 'PT-002',
        typeCode: 'PT-002',
        typeName: 'Administrative Expense',
        description: 'Office supplies, utilities, and general upkeep.',
        category: 'Operating Expenses',
        status: 'Active',
        defaultGlGroup: '6000-ADMIN-GEN',
        taxEligibility: 'Tax Exempt',
        businessUnits: [],
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: 'PT-003',
        typeCode: 'PT-003',
        typeName: 'Taxable Benefit',
        description: 'Employee benefits subject to fringe benefit tax.',
        category: 'Personnel Costs',
        status: 'Inactive',
        defaultGlGroup: '5500-BEN-TAX',
        taxEligibility: 'Mixed',
        businessUnits: [],
        auditTrail: [],
        createdBy: 'HR Dept',
        createdDate: new Date('2023-02-20'),
        lastUpdated: new Date('2023-05-15')
      }
    ];
  }
}
