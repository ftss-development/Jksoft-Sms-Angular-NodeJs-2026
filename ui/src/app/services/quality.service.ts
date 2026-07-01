
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Quality, QualityAudit } from '../models/quality.model';



@Injectable({
  providedIn: 'root'
})
export class QualityService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/quality_classifications';
  private readonly _qualities = signal<Quality[]>([]);
  private readonly collectionName = 'quality_classifications';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._qualities.set(this._generateMockQualities());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const qualities: Quality[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        qualities.push({
          ...data,
          id: doc.id.startsWith('Q-') ? doc.id : data.id, // Prefer stored display ID if available
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      // Sort by ID
      qualities.sort((a, b) => a.id.localeCompare(b.id));
      this._qualities.set(qualities);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._qualities().length === 0) {
            this._qualities.set(this._generateMockQualities());
        }
    }
    });
  }

  get qualities() {
    return this._qualities.asReadonly();
  }

  getQualityById(id: string): Quality | undefined {
    return this._qualities().find(q => q.id === id);
  }

  async addQuality(quality: Omit<Quality, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'revision' | 'integrityCheck' | 'referenceUuid'>): Promise<void> {
    const currentCount = this._qualities().length;
    const newId = `Q-${String(currentCount + 1001)}`;

    const newQuality: Quality = {
      ...quality,
      id: newId,
      auditTrail: [
          { id: 1, action: 'Created Record', actor: 'System Admin', timestamp: new Date(), description: 'Initial setup', icon: 'add' }
      ],
      revision: 'v1.0.0',
      integrityCheck: true,
      referenceUuid: crypto.randomUUID().split('-')[0].toUpperCase(),
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       // We use the custom ID as part of the data, Firestore doc ID will be auto-generated
       await lastValueFrom(this.http.post(this.apiUrl, newQuality));
    } else {
       this._qualities.update(current => [...current, newQuality]);
    }
  }

  async updateQuality(quality: Quality): Promise<void> {
    const updatedAudit = [
        { 
            id: Date.now(), 
            action: 'Entity Metadata Modified', 
            actor: 'System Admin', 
            timestamp: new Date(), 
            description: 'Updated description and alignment.',
            icon: 'edit'
        },
        ...(quality.auditTrail || [])
    ];

    const dataToUpdate = {
        ...quality,
        auditTrail: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    // Logic to handle DB update (simplified for demo)
    if (true) {
       // In a real app we'd need the Firestore Document Key. 
       // For this demo, we are assuming local update mainly or finding doc by ID query.
       console.log('DB Update triggered');
    } 
    
    this._qualities.update(current => 
        current.map(q => q.id === quality.id ? dataToUpdate : q)
    );
  }

  async deleteQuality(id: string): Promise<void> {
     this._qualities.update(current => current.filter(q => q.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyQualities(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._qualities();
        this._qualities.set([...current, ...dummyData]);
    }
  }

  private _generateDummyQualities(count: number): Quality[] {
    const types = ['Support', 'Logistics', 'Audit', 'Response', 'Compliance', 'Management', 'Service', 'Protocol', 'Standard', 'tier'];
    const adjs = ['Premium', 'Standard', 'Basic', 'Elite', 'Internal', 'External', 'Rapid', 'Global', 'Regional', 'Corporate'];
    const depts = ['Operational Compliance', 'Customer Success', 'Logistics', 'Quality Assurance', 'Legal', 'HR'];
    const levels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Executive Tier', 'Basic Tier'];

    const generated: Quality[] = [];
    const startId = this._qualities().length + 1006;

    for (let i = 0; i < count; i++) {
        const adj = adjs[Math.floor(Math.random() * adjs.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        
        generated.push({
            id: `Q-${startId + i}`,
            name: `${adj} ${type}`,
            description: `Auto-generated quality classification for ${adj.toLowerCase()} ${type.toLowerCase()} scenarios.`,
            status: Math.random() > 0.2 ? 'Active' : 'Inactive',
            level: levels[Math.floor(Math.random() * levels.length)],
            department: depts[Math.floor(Math.random() * depts.length)],
            revision: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}`,
            integrityCheck: true,
            referenceUuid: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            auditTrail: [
                { id: 1, action: 'Created Record', actor: 'System Bot', timestamp: new Date(), icon: 'smart_toy' }
            ],
            createdBy: 'System Bot',
            createdDate: new Date(),
            updatedBy: 'System Bot',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockQualities(): Quality[] {
    return [
      {
        id: 'Q-1001',
        name: 'Premium Support',
        description: 'High-priority classification for Tier-1 enterprise clients requiring 24/7 uptime monitoring.',
        status: 'Active',
        level: 'Tier 1 - Platinum',
        department: 'Customer Success',
        revision: 'v2.1.0',
        integrityCheck: true,
        referenceUuid: '823-AF01-Q2',
        auditTrail: [
            { id: 1, action: 'Created Record', actor: 'System Automator', timestamp: new Date('2023-10-15T11:00:00'), icon: 'add' }
        ],
        createdBy: 'System Automator',
        createdDate: new Date('2023-10-15T11:00:00'),
        updatedBy: 'Michael Chen',
        lastUpdated: new Date('2023-10-24T14:20:00')
      },
      {
        id: 'Q-1002',
        name: 'Standard Logistics',
        description: 'Default routing protocols for non-perishable goods.',
        status: 'Active',
        level: 'Level 2',
        department: 'Logistics',
        revision: 'v1.0.5',
        integrityCheck: true,
        referenceUuid: 'LOG-STD-02',
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-11-01'),
        lastUpdated: new Date('2023-11-01')
      },
      {
        id: 'Q-1003',
        name: 'Basic Tier',
        description: 'Entry level service agreement.',
        status: 'Inactive',
        level: 'Level 1',
        department: 'Sales',
        revision: 'v1.0.0',
        integrityCheck: true,
        referenceUuid: 'BSC-001',
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-01-10'),
        lastUpdated: new Date('2023-06-15')
      },
      {
        id: 'Q-1004',
        name: 'VIP Response',
        description: 'Immediate action required (< 1 hour SLA).',
        status: 'Active',
        level: 'Executive',
        department: 'Operations',
        revision: 'v3.0.1',
        integrityCheck: true,
        referenceUuid: 'VIP-999',
        auditTrail: [],
        createdBy: 'Director Ops',
        createdDate: new Date('2023-08-20'),
        lastUpdated: new Date('2023-09-01')
      },
      {
        id: 'Q-1005',
        name: 'Internal Audit',
        description: 'For internal compliance checks and quarterly reviews.',
        status: 'Active',
        level: 'Corporate',
        department: 'Compliance',
        revision: 'v1.2',
        integrityCheck: true,
        referenceUuid: 'INT-AUD-55',
        auditTrail: [],
        createdBy: 'Compliance Officer',
        createdDate: new Date('2023-02-14'),
        lastUpdated: new Date('2023-02-14')
      }
    ];
  }
}
