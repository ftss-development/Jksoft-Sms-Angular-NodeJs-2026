
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Tax, TaxStatus, TaxAuditTrail } from '../models/tax.model';



@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/taxes';
  private readonly _taxes = signal<Tax[]>([]);
  private readonly collectionName = 'taxes';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._taxes.set(this._generateMockTaxes());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const taxes: Tax[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        taxes.push({
          ...data,
          id: data.id || doc.id, // Prefer custom ID if it exists
          effectiveDate: data.effectiveDate?.toDate ? data.effectiveDate.toDate() : new Date(data.effectiveDate),
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      // Sort by readable ID
      taxes.sort((a, b) => a.id.localeCompare(b.id));
      
      if (taxes.length > 0) {
        this._taxes.set(taxes);
      } else {
        this._seedMockData();
      }
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._taxes().length === 0) {
            this._taxes.set(this._generateMockTaxes());
        }
    }
    });
  }

  private async _seedMockData() {
    
    const mockData = this._generateMockTaxes();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(tax => {
        // Use the mock readable ID as the document ID for consistency in the demo.
        const docRef = `${this.apiUrl}/tax.id`;
        batch.set(docRef, tax);
    });
    await batch.commit();
  }

  get taxes() {
    return this._taxes.asReadonly();
  }

  getTaxById(id: string): Tax | undefined {
    return this._taxes().find(t => t.id === id);
  }

  async addTax(tax: Omit<Tax, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail'>): Promise<void> {
    const currentCount = this._taxes().length;
    const newId = `TAX-${String(currentCount + 5).padStart(3, '0')}`;

    const newTax: Tax = {
      ...tax,
      id: newId,
      auditTrail: [
        { id: 1, title: 'Tax Rule Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial creation of the tax rule.', icon: 'add_circle' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      lastUpdated: new Date(),
      updatedBy: 'System Admin'
    };
    
    if (true) {
       const docRef = `${this.apiUrl}/newId`;
       await lastValueFrom(this.http.post(this.apiUrl, newTax));
    } else {
        this._taxes.update(current => [newTax, ...current]);
    }
  }

  async updateTax(tax: Tax): Promise<void> {
    const updatedAudit: TaxAuditTrail[] = [
        { id: Date.now(), title: 'Configuration Updated', actor: 'System Admin', timestamp: new Date(), description: 'Details were modified.', icon: 'edit' },
        ...(tax.auditTrail || [])
    ];
    
    const dataToUpdate = { ...tax, auditTrail: updatedAudit, lastUpdated: new Date(), updatedBy: 'Michael Scott' };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
       await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._taxes.update(current => 
          current.map(t => t.id === tax.id ? dataToUpdate : t)
        );
    }
  }

  async deleteTax(id: string): Promise<void> {
     if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
        this._taxes.update(current => current.filter(t => t.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyTaxes(100);
    if (true) {
        const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
        dummyData.forEach(taxData => {
            const docRef = `${this.apiUrl}/taxData.id`; // Use custom ID for doc ID
            batch.set(docRef, taxData);
        });
        await batch.commit();
    } else {
        this._taxes.update(current => [...current, ...dummyData]);
    }
  }

  private _generateDummyTaxes(count: number): Tax[] {
    const names = ['Sales Tax', 'Excise Duty', 'Service Tax', 'Customs Duty', 'Securities Transaction Tax', 'Dividend Tax', 'Capital Gains Tax', 'Property Tax'];
    const shortNames = ['SST', 'EXD', 'SRV', 'CST', 'STT', 'DDT', 'CGT', 'PTX'];
    const statuses: TaxStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];
    const startId = this._taxes().length + 5;

    const generated: Tax[] = [];
    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        generated.push({
            id: `TAX-${String(startId + i).padStart(3, '0')}`,
            taxName: `${name} ${i + 1}`,
            shortName: shortNames[Math.floor(Math.random() * shortNames.length)],
            value: parseFloat((Math.random() * 20).toFixed(2)),
            effectiveDate: new Date(new Date().getTime() - Math.random() * 1000 * 3600 * 24 * 365),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            createdBy: 'System Seed',
            createdDate: new Date(),
            auditTrail: []
        });
    }
    return generated;
  }

  private _generateMockTaxes(): Tax[] {
    return [
      {
        id: 'TAX-001',
        taxName: 'Value Added Tax',
        shortName: 'VAT',
        value: 20.00,
        effectiveDate: new Date('2024-01-01'),
        status: 'Active',
        legalName: 'Standard Value Added Tax - Corporate Division',
        taxAuthority: 'HMRC',
        jurisdiction: 'United Kingdom',
        currency: 'GBP (£)',
        roundingRule: 'Mathematical (2 Dec.)',
        glSettlementAccount: '2100-001 - VAT Liability Acc.',
        createdBy: 'System (Initial Setup)',
        createdDate: new Date('2023-01-01T00:00:00'),
        updatedBy: 'Jane Doe (Admin)',
        lastUpdated: new Date('2023-10-12T14:20:00'),
        auditTrail: [
            { id: 1, title: 'Tax Rate Updated', actor: 'Jane Doe (Admin)', timestamp: new Date('2023-10-12T14:20:00'), description: 'Field \'Tax Rate\' changed from 18.00% to 20.00%', icon: 'percent' },
            { id: 2, title: 'Mapping Added', actor: 'Mike Smith (Finance Analyst)', timestamp: new Date('2023-05-05T09:12:00'), description: 'New group mapping \'Zero Rated Exports\' linked to entity.', icon: 'link' },
            { id: 3, title: 'Entity Created', actor: 'System (Initial Setup)', timestamp: new Date('2023-01-01T00:00:00'), description: 'Initial creation of Tax Code VAT-01.', icon: 'add_circle' }
        ]
      },
      {
        id: 'TAX-002',
        taxName: 'Corporate Income Tax',
        shortName: 'CIT',
        value: 15.50,
        effectiveDate: new Date('2024-03-15'),
        status: 'Active',
        createdBy: 'Admin',
        createdDate: new Date('2024-01-01'),
        auditTrail: []
      },
      {
        id: 'TAX-003',
        taxName: 'State Goods Tax',
        shortName: 'SGT',
        value: 5.00,
        effectiveDate: new Date('2023-01-01'),
        status: 'Inactive',
        createdBy: 'Admin',
        createdDate: new Date('2022-12-01'),
        auditTrail: []
      },
      {
        id: 'TAX-004',
        taxName: 'Environmental Levy',
        shortName: 'ENVL',
        value: 2.25,
        effectiveDate: new Date('2024-06-30'),
        status: 'Pending',
        createdBy: 'Finance Dept',
        createdDate: new Date('2024-02-15'),
        auditTrail: []
      },
    ];
  }
}