
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StbScheme, SchemeStatus, SchemeHistory } from '../models/stb-scheme.model';



@Injectable({
  providedIn: 'root'
})
export class StbSchemeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/stb_schemes';
  private readonly _schemes = signal<StbScheme[]>([]);
  private readonly collectionName = 'stb_schemes';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._schemes.set(this._generateMockSchemes());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const schemes: StbScheme[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        schemes.push({
          ...data,
          id: doc.id.startsWith('SCH-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((h: any) => ({
             ...h,
             timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp)
          })),
          historyLog: (data.historyLog || []).map((h: any) => ({
             ...h,
             timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp)
          }))
        });
      });
      // Sort by ID
      schemes.sort((a, b) => a.id.localeCompare(b.id));
      this._schemes.set(schemes);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._schemes().length === 0) {
            this._schemes.set(this._generateMockSchemes());
        }
    }
    });
  }

  get schemes() {
    return this._schemes.asReadonly();
  }

  getSchemeById(id: string): StbScheme | undefined {
    return this._schemes().find(s => s.id === id);
  }

  async addScheme(scheme: Omit<StbScheme, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'historyLog' | 'internalReference' | 'totalEnrolled' | 'revenueStream'>): Promise<void> {
    const currentCount = this._schemes().length;
    const newId = `SCH-GEN-${String(currentCount + 100).padStart(3, '0')}`;

    const newScheme: StbScheme = {
      ...scheme,
      id: newId,
      internalReference: `REF-${Math.floor(Math.random() * 10000)}`,
      totalEnrolled: 0,
      revenueStream: 'New Subscription',
      auditTrail: [
        { id: 1, title: 'Scheme Created', description: 'Initial draft.', timestamp: new Date(), icon: 'add_circle', type: 'default' }
      ],
      historyLog: [
          { id: 1, title: 'Strategy Defined', description: 'Initial concept.', timestamp: new Date(), icon: 'lightbulb', type: 'info' }
      ],
      createdBy: 'Product Manager',
      createdDate: new Date(),
      updatedBy: 'Product Manager',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newScheme));
    } else {
       this._schemes.update(current => [...current, newScheme]);
    }
  }

  async updateScheme(scheme: StbScheme): Promise<void> {
    const updatedHistory: SchemeHistory[] = [
        { 
            id: Date.now(), 
            title: 'Pricing Updated', 
            description: 'Scheme parameters modified by admin.', 
            timestamp: new Date(), 
            icon: 'edit',
            type: 'default'
        },
        ...scheme.historyLog
    ];

    const dataToUpdate = {
        ...scheme,
        historyLog: updatedHistory,
        updatedBy: 'Finance Dept',
        lastUpdated: new Date()
    };

    if (true) {
       console.log('DB Update triggered');
    }
    
    this._schemes.update(current => 
        current.map(s => s.id === scheme.id ? dataToUpdate : s)
    );
  }

  async deleteScheme(id: string): Promise<void> {
     this._schemes.update(current => current.filter(s => s.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._schemes();
        this._schemes.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): StbScheme[] {
    const types = ['Rental', 'Purchase', 'EMI', 'Lease', 'Hybrid', 'Corporate', 'Bulk'];
    const periods = ['Monthly', 'Quarterly', 'Annually', 'One-Time'];
    const statuses: SchemeStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Draft', 'Deprecated'];
    
    const generated: StbScheme[] = [];
    const startId = this._schemes().length + 50;

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const period = periods[Math.floor(Math.random() * periods.length)];
        const name = `${type} Plan ${Math.floor(Math.random() * 100)}`;
        
        generated.push({
            id: `SCH-${type.substring(0,3).toUpperCase()}-${String(startId + i).padStart(3, '0')}`,
            schemeName: name,
            description: `Standard ${type.toLowerCase()} scheme with ${period.toLowerCase()} billing cycle.`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            isActive: Math.random() > 0.2,
            rentalRate: parseFloat((Math.random() * 50 + 10).toFixed(2)),
            securityDeposit: parseFloat((Math.random() * 100).toFixed(2)),
            billingCycle: period as any,
            contractPeriod: `${Math.floor(Math.random() * 24) + 1} Months`,
            internalReference: `INT-${Math.floor(Math.random() * 9000)}-${type.substring(0,2).toUpperCase()}`,
            totalEnrolled: Math.floor(Math.random() * 5000),
            revenueStream: 'B2C Subscription',
            auditTrail: [],
            historyLog: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockSchemes(): StbScheme[] {
    return [
      {
        id: 'SCH-RENT-001',
        schemeName: 'Standard Monthly Rental',
        description: 'Regular subscription-based rental plan for residential customers.',
        status: 'Active',
        isActive: true,
        rentalRate: 12.50,
        securityDeposit: 50.00,
        billingCycle: 'Monthly',
        contractPeriod: '12 Months',
        internalReference: 'REF-RENT-STD',
        totalEnrolled: 1248,
        revenueStream: 'B2C Subscription',
        auditTrail: [],
        historyLog: [],
        createdBy: 'Robert Chen',
        createdDate: new Date('2024-01-12T10:00:00'),
        updatedBy: 'Sarah Jenkins',
        lastUpdated: new Date('2024-03-22T11:45:00')
      },
      {
        id: 'SCH-BUY-002',
        schemeName: 'Outright Purchase Plan',
        description: 'One-time payment for lifetime ownership of the STB hardware.',
        status: 'Active',
        isActive: true,
        rentalRate: 0,
        securityDeposit: 0,
        billingCycle: 'One-Time',
        contractPeriod: 'Lifetime',
        internalReference: 'REF-BUY-LIFETIME',
        totalEnrolled: 450,
        revenueStream: 'Hardware Sales',
        auditTrail: [],
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-11-05'),
        lastUpdated: new Date('2023-11-05')
      },
      {
        id: 'SCH-EMI-003',
        schemeName: '6-Month Installment',
        description: 'Monthly EMI for 4K STB hardware purchase.',
        status: 'Inactive',
        isActive: false,
        rentalRate: 25.00,
        securityDeposit: 20.00,
        billingCycle: 'Monthly',
        contractPeriod: '6 Months',
        internalReference: 'REF-EMI-6M',
        totalEnrolled: 0,
        revenueStream: 'Financing',
        auditTrail: [],
        historyLog: [],
        createdBy: 'Manager',
        createdDate: new Date('2023-10-20'),
        lastUpdated: new Date('2024-01-15')
      },
      {
        id: 'SCH-CORP-004',
        schemeName: 'Enterprise Bulk Scheme',
        description: 'Discounted rates for corporate clients with > 50 units.',
        status: 'Active',
        isActive: true,
        rentalRate: 8.00,
        securityDeposit: 0,
        billingCycle: 'Quarterly',
        contractPeriod: '24 Months',
        internalReference: 'REF-CORP-BLK',
        totalEnrolled: 15,
        revenueStream: 'B2B Contracts',
        auditTrail: [],
        historyLog: [],
        createdBy: 'Sales Director',
        createdDate: new Date('2023-12-01'),
        lastUpdated: new Date('2024-02-10')
      },
      {
        id: 'SCH-PREM-24',
        schemeName: 'Premium Festive Annual Pack',
        description: 'Annual subscription scheme with discounted hardware rental for high-tier HD and 4K channels.',
        status: 'Active',
        isActive: true,
        rentalRate: 120.00,
        securityDeposit: 0,
        billingCycle: 'Annually',
        contractPeriod: '12 Months',
        internalReference: 'PRM-FEST-2024-V2',
        totalEnrolled: 890,
        revenueStream: 'B2C Subscription',
        historyLog: [
            { id: 1, title: 'Scheme Pricing Validated', description: 'Final pricing approval for the 2024 festive season rollout.', timestamp: new Date('2024-10-12T14:30:00'), icon: 'verified', type: 'success' },
            { id: 2, title: 'Incentive Structure Modified', description: 'Extended OTT bundle validity from 6 months to 12 months.', timestamp: new Date('2024-09-28T10:15:00'), icon: 'edit_note', type: 'default' },
            { id: 3, title: 'Scheme Strategy Defined', description: 'Initial draft of the Premium Festive Annual scheme concept.', timestamp: new Date('2024-09-15T09:00:00'), icon: 'add_circle', type: 'default' }
        ],
        auditTrail: [],
        createdBy: 'Product Manager',
        createdDate: new Date('2024-09-15T09:00:00'),
        updatedBy: 'Finance Dept',
        lastUpdated: new Date('2024-10-12T14:30:00')
      }
    ];
  }
}
