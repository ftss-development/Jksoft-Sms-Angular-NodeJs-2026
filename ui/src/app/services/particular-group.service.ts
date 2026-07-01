
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ParticularGroup } from '../models/particular-group.model';



@Injectable({
  providedIn: 'root'
})
export class ParticularGroupService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/particular_groups';
  private readonly _particularGroups = signal<ParticularGroup[]>([]);
  private readonly collectionName = 'particular_groups';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._particularGroups.set(this._generateMockGroups());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const groups: ParticularGroup[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        groups.push({
          ...data,
          id: data.id || parseInt(doc.id, 10) || 0,
          assignedParticularIds: data.assignedParticularIds || [],
          nextReviewDate: data.nextReviewDate?.toDate ? data.nextReviewDate.toDate() : new Date(data.nextReviewDate),
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      groups.sort((a, b) => a.id - b.id);
      this._particularGroups.set(groups);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._particularGroups().length === 0) {
            this._particularGroups.set(this._generateMockGroups());
        }
    }
    });
  }

  get particularGroups() {
    return this._particularGroups.asReadonly();
  }

  getGroupById(id: number): ParticularGroup | undefined {
    return this._particularGroups().find(g => g.id === id);
  }

  async addGroup(group: Omit<ParticularGroup, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const currentMax = this._particularGroups().reduce((max, g) => Math.max(max, g.id), 0);
    const newId = currentMax + 1;

    const newGroup: ParticularGroup = {
      ...group,
      id: newId,
      assignedParticularIds: group.assignedParticularIds || [],
      assignedManager: group.assignedManager || 'Unassigned',
      riskLevel: group.riskLevel || 'Low',
      nextReviewDate: group.nextReviewDate || new Date(new Date().setMonth(new Date().getMonth() + 6)),
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       // Use numeric ID as doc ID for this entity to match screenshot ID style if needed, 
       // but typically auto-ID is better. For this demo, we let Firestore gen ID but store 'id' field.
       await lastValueFrom(this.http.post(this.apiUrl, newGroup));
    } else {
       this._particularGroups.update(current => [...current, newGroup]);
    }
  }

  async updateGroup(group: ParticularGroup): Promise<void> {
    const dataToUpdate = {
        ...group,
        assignedParticularIds: group.assignedParticularIds || [],
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
        // In a real app, map 'id' to Document ID. 
        console.log('DB Update: Logic placeholder.');
    }
    
    this._particularGroups.update(current => 
      current.map(g => g.id === group.id ? dataToUpdate : g)
    );
  }

  async deleteGroup(id: number): Promise<void> {
    this._particularGroups.update(current => current.filter(g => g.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyGroups(100);
    if (true) {
        const batch = { commit: async () => {}, set: (r,d) => {}, update: (r,d) => {}, delete: (r) => {} };
        dummyData.forEach(data => {
            const docRef = `${this.apiUrl}/PG-${data.id}`;
            batch.set(docRef, data);
        });
        await batch.commit();
    } else {
        const current = this._particularGroups();
        this._particularGroups.set([...current, ...dummyData]);
    }
  }

  private _generateDummyGroups(count: number): ParticularGroup[] {
    const prefixes = ['Global', 'North', 'South', 'East', 'West', 'Strategic', 'Core', 'Legacy', 'Future', 'Alpha'];
    const roots = ['Operations', 'Finances', 'Logistics', 'Development', 'HR', 'Sales', 'Marketing', 'Assets', 'Compliance'];
    const suffixes = ['Group', 'Cluster', 'Unit', 'Division', 'Team', 'Squad', 'Pool'];
    
    const managers = ['Jane Doe', 'John Smith', 'Alice Johnson', 'Bob Brown', 'Sarah Lee'];
    const risks: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

    const generated: ParticularGroup[] = [];
    const startId = this._particularGroups().length + 10000;

    for (let i = 0; i < count; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const root = roots[Math.floor(Math.random() * roots.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const name = `${prefix} ${root} ${suffix}`;
        const shortName = `${prefix.substring(0,1)}${root.substring(0,3)}${suffix.substring(0,1)}`.toUpperCase();

        generated.push({
            id: startId + i,
            groupName: name,
            shortName: shortName,
            isActive: Math.random() > 0.15,
            assignedParticularIds: [], // Empty for bulk gen to avoid complexity
            assignedManager: managers[Math.floor(Math.random() * managers.length)],
            riskLevel: risks[Math.floor(Math.random() * risks.length)],
            nextReviewDate: new Date(new Date().getTime() + Math.random() * 10000000000),
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockGroups(): ParticularGroup[] {
    return [
      {
        id: 10024,
        groupName: 'Operating Expenses - Q3',
        shortName: 'OpEx_Q3',
        isActive: true,
        assignedParticularIds: ['PART-001'], 
        assignedManager: 'Jane Doe',
        riskLevel: 'Low',
        nextReviewDate: new Date('2023-10-24'),
        createdBy: 'admin_system',
        createdDate: new Date('2023-10-12T14:32:00'),
        updatedBy: 'jane.smith',
        lastUpdated: new Date('2024-01-24T09:15:00')
      },
      {
        id: 10025,
        groupName: 'Capital Expenditure 2023',
        shortName: 'CapEx_23',
        isActive: true,
        assignedParticularIds: ['PART-002', 'PART-003'], 
        assignedManager: 'Michael Scott',
        riskLevel: 'High',
        nextReviewDate: new Date('2023-12-01'),
        createdBy: 'Finance Lead',
        createdDate: new Date('2023-11-05T10:00:00'),
        updatedBy: 'Storage Admin',
        lastUpdated: new Date('2023-11-05T10:00:00')
      },
      {
        id: 10026,
        groupName: 'Marketing Q4 Promo',
        shortName: 'Mkt_Q4_Promo',
        isActive: false,
        assignedParticularIds: [],
        assignedManager: 'Sarah Connor',
        riskLevel: 'Medium',
        nextReviewDate: new Date('2023-11-15'),
        createdBy: 'Marketing VP',
        createdDate: new Date('2022-05-20T08:00:00'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-01-10T16:30:00')
      }
    ];
  }
}
