
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TicketReason, AssociatedHead } from '../models/ticket-reason.model';



@Injectable({
  providedIn: 'root'
})
export class TicketReasonService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/ticket_reasons';
  private readonly _reasons = signal<TicketReason[]>([]);
  private readonly collectionName = 'ticket_reasons';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._reasons.set(this._generateMockReasons());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const reasons: TicketReason[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        reasons.push({
          ...data,
          id: doc.id.startsWith('RSN-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      reasons.sort((a, b) => a.id.localeCompare(b.id));
      this._reasons.set(reasons);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._reasons().length === 0) {
            this._reasons.set(this._generateMockReasons());
        }
    }
    });
  }

  get reasons() {
    return this._reasons.asReadonly();
  }

  getReasonById(id: string): TicketReason | undefined {
    return this._reasons().find(r => r.id === id);
  }

  async addReason(reason: Omit<TicketReason, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'associatedHeads'>): Promise<void> {
    const currentCount = this._reasons().length;
    const newId = `RSN-${String(currentCount + 1).padStart(3, '0')}`;

    const newReason: TicketReason = {
      ...reason,
      id: newId,
      associatedHeads: [],
      auditTrail: [
          { action: 'Reason Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial creation of ticket reason.', icon: 'add_circle' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newReason));
    } else {
       this._reasons.update(current => [...current, newReason]);
    }
  }

  async updateReason(reason: TicketReason): Promise<void> {
    const updatedAudit = [
        { action: 'Metadata Updated', actor: 'System Admin', timestamp: new Date(), description: 'Configuration modified.', icon: 'edit' },
        ...(reason.auditTrail || [])
    ];

    const dataToUpdate = {
        ...reason,
        auditTrail: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    if (true) {
        // Simplified update for demo
        console.log('DB Update triggered');
    } 
    
    this._reasons.update(current => 
        current.map(r => r.id === reason.id ? dataToUpdate : r)
    );
  }

  async deleteReason(id: string): Promise<void> {
     this._reasons.update(current => current.filter(r => r.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        // Parallel add for speed
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._reasons();
        this._reasons.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): TicketReason[] {
    const subjects = ['Software', 'Hardware', 'Network', 'Database', 'Security', 'Access', 'Email', 'Printer', 'Mobile', 'Cloud'];
    const issues = ['Malfunction', 'Error', 'Failure', 'Latency', 'Access Denied', 'Crash', 'Bug', 'Update', 'Request', 'Outage'];
    const types = ['Incident', 'Request', 'Problem', 'Change'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];

    const generated: TicketReason[] = [];
    const startId = this._reasons().length + 10;

    for (let i = 0; i < count; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const issue = issues[Math.floor(Math.random() * issues.length)];
        const name = `${subject} ${issue}`;
        const shortName = `${subject.substring(0,3).toUpperCase()}_${issue.substring(0,4).toUpperCase()}`;
        
        generated.push({
            id: `RSN-${String(startId + i).padStart(3, '0')}`,
            reasonName: name,
            shortName: shortName,
            description: `Standard classification for ${name.toLowerCase()} related tickets.`,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            classificationType: types[Math.floor(Math.random() * types.length)] as any,
            severityLevel: severities[Math.floor(Math.random() * severities.length)] as any,
            associatedHeads: [],
            auditTrail: [
                { action: 'Auto-Generated', actor: 'System Seed', timestamp: new Date(), description: 'Batch generation', icon: 'smart_toy' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockReasons(): TicketReason[] {
    return [
      {
        id: 'RSN-001',
        reasonName: 'Software Malfunction',
        shortName: 'SOFT_ERR',
        description: 'Errors or unexpected behavior in installed software applications.',
        status: 'Active',
        classificationType: 'Incident',
        severityLevel: 'High',
        associatedHeads: [
            { headId: 'HD-012', headName: 'Workstation Repairs', department: 'IT Services', status: 'Enabled' },
            { headId: 'HD-045', headName: 'Server Maintenance', department: 'Infrastructure', status: 'Enabled' }
        ],
        auditTrail: [
            { action: 'Metadata Updated', actor: 'Jane Doe', timestamp: new Date('2024-05-22T10:45:00'), description: 'Updated reason description to include wear-and-tear criteria.', icon: 'edit' },
            { action: 'Status Changed', actor: 'Robert King', timestamp: new Date('2024-05-14T16:20:00'), description: 'Reason enabled for all Service Desk agents.', icon: 'toggle_on' },
            { action: 'Reason Created', actor: 'System', timestamp: new Date('2024-05-10T09:00:00'), description: 'Initial creation of classification.', icon: 'add_circle' }
        ],
        createdBy: 'System',
        createdDate: new Date('2024-05-10'),
        updatedBy: 'Jane Doe',
        lastUpdated: new Date('2024-05-22')
      },
      {
        id: 'RSN-002',
        reasonName: 'Hardware Replacement',
        shortName: 'HW_REPLACE',
        description: 'Requests for replacing faulty physical equipment.',
        status: 'Active',
        classificationType: 'Request',
        severityLevel: 'Medium',
        associatedHeads: [],
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2024-01-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2024-01-15')
      },
      {
        id: 'RSN-003',
        reasonName: 'Account Access Issue',
        shortName: 'ACC_ACCESS',
        description: 'Login failures, password resets, or permission errors.',
        status: 'Inactive',
        classificationType: 'Incident',
        severityLevel: 'Critical',
        associatedHeads: [],
        auditTrail: [],
        createdBy: 'SecOps',
        createdDate: new Date('2023-11-20'),
        updatedBy: 'SecOps',
        lastUpdated: new Date('2024-02-01')
      },
      {
        id: 'RSN-004',
        reasonName: 'Network Latency',
        shortName: 'NET_SLOW',
        description: 'Reports of slow internet or intranet connectivity.',
        status: 'Active',
        classificationType: 'Problem',
        severityLevel: 'High',
        associatedHeads: [],
        auditTrail: [],
        createdBy: 'NetAdmin',
        createdDate: new Date('2023-12-10'),
        updatedBy: 'NetAdmin',
        lastUpdated: new Date('2023-12-10')
      },
      {
        id: 'RSN-005',
        reasonName: 'System Training Request',
        shortName: 'SYS_TRAIN',
        description: 'Requests for training on new software rollouts.',
        status: 'Active',
        classificationType: 'Request',
        severityLevel: 'Low',
        associatedHeads: [],
        auditTrail: [],
        createdBy: 'HR',
        createdDate: new Date('2024-03-05'),
        updatedBy: 'HR',
        lastUpdated: new Date('2024-03-05')
      }
    ];
  }
}
