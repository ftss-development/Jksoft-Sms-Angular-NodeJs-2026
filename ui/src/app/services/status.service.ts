
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StatusType, StatusHistory } from '../models/status.model';



@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/status_definitions';
  private readonly _statuses = signal<StatusType[]>([]);
  private readonly collectionName = 'status_definitions';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._statuses.set(this._generateMockStatuses());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const statuses: StatusType[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        statuses.push({
          ...data,
          id: doc.id.startsWith('STAT-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          historyLog: (data.historyLog || []).map((h: any) => ({
             ...h,
             timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp)
          }))
        });
      });
      // Sort by ID
      statuses.sort((a, b) => a.id.localeCompare(b.id));
      this._statuses.set(statuses);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._statuses().length === 0) {
            this._statuses.set(this._generateMockStatuses());
        }
    }
    });
  }

  get statuses() {
    return this._statuses.asReadonly();
  }

  getStatusById(id: string): StatusType | undefined {
    return this._statuses().find(s => s.id === id);
  }

  async addStatus(status: Omit<StatusType, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'historyLog' | 'internalCode' | 'objectClass' | 'revision'>): Promise<void> {
    const currentCount = this._statuses().length;
    const newId = `STAT-${String(currentCount + 1).padStart(3, '0')}`;
    
    const newStatus: StatusType = {
      ...status,
      id: newId,
      internalCode: `STAT-${status.statusName.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
      objectClass: 'sys_status_v4',
      revision: 'R-1',
      historyLog: [
          { id: 1, action: 'Status Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial definition.', icon: 'add_circle' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newStatus));
    } else {
       this._statuses.update(current => [...current, newStatus]);
    }
  }

  async updateStatus(status: StatusType): Promise<void> {
    const updatedHistory: StatusHistory[] = [
        { 
            id: Date.now(), 
            action: 'Definition Updated', 
            actor: 'System Admin', 
            timestamp: new Date(), 
            description: 'Configuration modified.', 
            icon: 'edit'
        },
        ...(status.historyLog || [])
    ];

    const dataToUpdate = {
        ...status,
        historyLog: updatedHistory,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    if (true) {
       // Typically requires document key mapping. Assuming mock or simple ID match for demo.
       console.log('DB Update triggered');
    }
    
    this._statuses.update(current => 
        current.map(s => s.id === status.id ? dataToUpdate : s)
    );
  }

  async deleteStatus(id: string): Promise<void> {
     this._statuses.update(current => current.filter(s => s.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._statuses();
        this._statuses.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): StatusType[] {
    const names = ['Active', 'Inactive', 'Pending', 'Suspended', 'Closed', 'Draft', 'Review', 'Approved', 'Rejected', 'Archived', 'On Hold', 'Completed', 'Failed', 'Success'];
    const entities = ['Customer', 'User', 'Ticket', 'Order', 'Invoice', 'Product', 'Device', 'Connection', 'Service', 'Task'];
    const types = ['Lifecycle', 'Workflow', 'System', 'Boolean', 'State'];
    const icons = ['check_circle', 'cancel', 'pending', 'pause_circle', 'lock', 'edit', 'delete', 'verified', 'error'];
    const colors = ['#10B981', '#EF4444', '#F59E0B', '#6366F1', '#3B82F6', '#64748B'];

    const generated: StatusType[] = [];
    const startId = this._statuses().length + 10;

    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const entity = entities[Math.floor(Math.random() * entities.length)];
        
        generated.push({
            id: `STAT-${String(startId + i).padStart(3, '0')}`,
            statusName: name,
            statusFor: entity,
            statusType: types[Math.floor(Math.random() * types.length)],
            description: `Standard ${name.toLowerCase()} state for ${entity.toLowerCase()} entities.`,
            isActive: Math.random() > 0.1,
            isLocked: Math.random() > 0.8,
            displayColor: colors[Math.floor(Math.random() * colors.length)],
            displayIcon: icons[Math.floor(Math.random() * icons.length)],
            internalCode: `STAT-${name.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
            objectClass: 'sys_gen_v1',
            revision: `R-${Math.floor(Math.random() * 10) + 1}`,
            historyLog: [{ id: 1, action: 'Auto-Generated', actor: 'System Seed', timestamp: new Date(), icon: 'smart_toy' }],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockStatuses(): StatusType[] {
    return [
      {
        id: 'STAT-001',
        statusName: 'Active',
        statusFor: 'Customer',
        statusType: 'Lifecycle',
        description: 'Account is in good standing and services are available.',
        isActive: true,
        isLocked: true,
        displayColor: '#10B981', // Emerald
        displayIcon: 'check_circle',
        internalCode: 'STAT-CUST-ACT',
        objectClass: 'sys_status_v4',
        revision: 'R-12',
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: 'STAT-002',
        statusName: 'Suspended',
        statusFor: 'Connection',
        statusType: 'Operational',
        description: 'Connection temporarily disabled due to maintenance or billing.',
        isActive: true,
        isLocked: false,
        displayColor: '#F59E0B', // Amber
        displayIcon: 'pause_circle',
        internalCode: 'STAT-CONN-SUS',
        objectClass: 'sys_status_v4',
        revision: 'R-5',
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-02-15'),
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: 'STAT-003',
        statusName: 'Closed',
        statusFor: 'Customer',
        statusType: 'Lifecycle',
        description: 'Relationship terminated. Data archived for compliance.',
        isActive: true,
        isLocked: true,
        displayColor: '#EF4444', // Red
        displayIcon: 'lock',
        internalCode: 'STAT-CUST-CLO',
        objectClass: 'sys_status_v4',
        revision: 'R-3',
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-03-10'),
        lastUpdated: new Date('2023-03-10')
      },
      {
        id: 'STAT-004',
        statusName: 'Pending',
        statusFor: 'Device',
        statusType: 'Provisioning',
        description: 'Device awaiting provisioning and initial setup.',
        isActive: true,
        isLocked: false,
        displayColor: '#3B82F6', // Blue
        displayIcon: 'pending',
        internalCode: 'STAT-DEV-PEN',
        objectClass: 'sys_status_v4',
        revision: 'R-8',
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-04-20'),
        lastUpdated: new Date('2023-04-20')
      },
      {
        id: 'STS-042',
        statusName: 'Awaiting Approval',
        statusFor: 'Service Request Entities',
        statusType: 'Intermediate',
        description: 'Applied to entities that have been submitted but are waiting for a supervisor\'s digital signature. While in this state, editing of the primary entity data is restricted to read-only.',
        isActive: true,
        isLocked: true,
        displayColor: '#F59E0B', // Amber/Yellowish
        displayIcon: 'hourglass_empty',
        internalCode: 'STS-042-PENDING',
        objectClass: 'sys_status_workflow',
        revision: 'v4.0.1',
        historyLog: [
            { id: 1, action: 'Transition Rules Updated', actor: 'Workflow Architect', timestamp: new Date('2024-03-15T14:20:00'), description: "Modified allowed destination states to include 'Rejected-Revisions Required'.", icon: 'check_circle' },
            { id: 2, action: 'Description Modified', actor: 'Sarah Jenkins', timestamp: new Date('2024-02-08T10:30:00'), description: 'Clarified editing restrictions during the approval phase.', icon: 'edit_note' },
            { id: 3, action: 'Status Entity Created', actor: 'System Admin', timestamp: new Date('2024-01-10T09:00:00'), description: "Initial definition of 'Awaiting Approval' lifecycle state.", icon: 'add_circle' }
        ],
        createdBy: 'System Admin',
        createdDate: new Date('2024-01-10T09:00:00'),
        updatedBy: 'Workflow Architect',
        lastUpdated: new Date('2024-03-15T14:20:00')
      }
    ];
  }
}
