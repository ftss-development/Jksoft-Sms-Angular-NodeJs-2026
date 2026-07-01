
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SubDepartment } from '../models/sub-department.model';
import { DepartmentService } from './department.service';



@Injectable({
  providedIn: 'root'
})
export class SubDepartmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/sub_departments';
  private readonly departmentService = inject(DepartmentService);
  private readonly _subDepartments = signal<SubDepartment[]>([]);
  private readonly collectionName = 'sub_departments';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._subDepartments.set(this._generateMockData());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const subs: SubDepartment[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        subs.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTimeline: (data.auditTimeline || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      this._subDepartments.set(subs);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._subDepartments().length === 0) {
            this._subDepartments.set(this._generateMockData());
        }
    }
    });
  }

  get subDepartments() {
    return this._subDepartments.asReadonly();
  }

  getSubDepartmentById(id: string): SubDepartment | undefined {
    return this._subDepartments().find(s => s.id === id);
  }

  async addSubDepartment(sub: Omit<SubDepartment, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTimeline'>): Promise<void> {
    const newSub: Partial<SubDepartment> = {
      ...sub,
      auditTimeline: [
        { id: 1, action: 'Department Created', actor: 'System Admin', timestamp: new Date(), icon: 'add_circle', description: 'Initial setup' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newSub));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._subDepartments.update(current => [...current, { ...newSub, id: mockId } as SubDepartment]);
    }
  }

  async updateSubDepartment(sub: SubDepartment): Promise<void> {
    const updatedAudit = [
        { id: Date.now(), action: 'Details Updated', actor: 'System Admin', timestamp: new Date(), icon: 'edit', description: 'Manual update via portal' },
        ...(sub.auditTimeline || [])
    ];
    
    const dataToUpdate = {
        ...sub,
        auditTimeline: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._subDepartments.update(current => 
            current.map(s => s.id === id ? { ...sub, ...firestoreData } as SubDepartment : s)
        );
    }
  }

  async deleteSubDepartment(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._subDepartments.update(current => current.filter(s => s.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const parents = this.departmentService.departments();
    if (parents.length === 0) {
        alert('No parent departments found. Please create Departments first.');
        return;
    }

    const dummyData = this._generateDummySubDepartments(100, parents);
    
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._subDepartments();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as SubDepartment));
        this._subDepartments.set([...current, ...newItems]);
    }
  }

  private _generateDummySubDepartments(count: number, parents: any[]): any[] {
      const subs = [];
      const prefixes = ['Global', 'Regional', 'Local', 'Corporate', 'Strategic', 'Advanced', 'Core', 'Field', 'Internal'];
      const functions = ['Operations', 'Support', 'Development', 'Analysis', 'Research', 'Logistics', 'Compliance', 'Security', 'Training', 'Recruitment'];
      const suffixes = ['Unit', 'Team', 'Squad', 'Division', 'Branch', 'Center', 'Hub'];
      
      for (let i = 0; i < count; i++) {
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          const func = functions[Math.floor(Math.random() * functions.length)];
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
          const num = Math.floor(Math.random() * 100);
          
          const name = `${prefix} ${func} ${suffix} ${num}`;
          const shortName = `${prefix.substring(0,1)}${func.substring(0,3)}${num}`.toUpperCase();
          const parent = parents[Math.floor(Math.random() * parents.length)];
          
          subs.push({
              name,
              shortName,
              parentDepartmentId: parent.id,
              parentDepartmentName: parent.departmentName,
              status: Math.random() > 0.15 ? 'Active' : 'Inactive',
              region: ['NA', 'EMEA', 'APAC', 'LATAM'][Math.floor(Math.random() * 4)],
              companyMappings: [],
              auditTimeline: [
                  { id: Date.now(), action: 'Auto-Generated', actor: 'System Seed', timestamp: new Date(), icon: 'smart_toy', description: 'Batch created via dummy data generator' }
              ],
              createdBy: 'System Seed',
              createdDate: new Date(),
              updatedBy: 'System Seed',
              lastUpdated: new Date()
          });
      }
      return subs;
  }

  // Generate Mock Data matching screenshots
  private _generateMockData(): SubDepartment[] {
    return [
      {
        id: 'SD-1024',
        name: 'Global Logistics - West',
        shortName: 'GL-W',
        parentDepartmentId: 'DEP-MKT-01', // Global Marketing from previous mock
        parentDepartmentName: 'Operations', // Hardcoded for demo match
        status: 'Active',
        region: 'North America - West',
        companyMappings: [
            { id: 1, entityName: 'Logistics Hub West LLC', costCenter: 'CC-4010', allocation: 40 },
            { id: 2, entityName: 'Global Supply Corp', costCenter: 'CC-4055', allocation: 25 },
            { id: 3, entityName: 'Freight Partners Inc.', costCenter: 'CC-9901', allocation: 20 },
            { id: 4, entityName: 'West Coast Storage', costCenter: 'CC-1120', allocation: 15 }
        ],
        auditTimeline: [
            { id: 1, action: 'Status Updated', actor: 'Sarah Chen', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), icon: 'sync', description: 'Status changed to Active' },
            { id: 2, action: 'Mapping Modified', actor: 'Admin', timestamp: new Date('2023-08-12'), icon: 'edit_note', description: 'Added "West Coast Storage" to company mappings' },
            { id: 3, action: 'Department Created', actor: 'System', timestamp: new Date('2023-06-05'), icon: 'add', description: 'Initial setup of GL-W sub-department' }
        ],
        createdBy: 'System',
        createdDate: new Date('2023-06-05'),
        updatedBy: 'Sarah Chen',
        lastUpdated: new Date()
      },
      {
        id: 'SD-202',
        name: 'Frontend Engineering',
        shortName: 'ENG-FE',
        parentDepartmentId: 'DEP-002', // IT
        parentDepartmentName: 'Engineering',
        status: 'Active',
        region: 'Global',
        companyMappings: [],
        auditTimeline: [],
        createdBy: 'CTO',
        createdDate: new Date('2023-01-10'),
        lastUpdated: new Date('2023-01-10')
      },
      {
        id: 'SD-305',
        name: 'Digital Marketing',
        shortName: 'MKT-DIG',
        parentDepartmentId: 'DEP-MKT-01',
        parentDepartmentName: 'Marketing',
        status: 'Active',
        region: 'EMEA',
        companyMappings: [],
        auditTimeline: [],
        createdBy: 'CMO',
        createdDate: new Date('2023-02-14'),
        lastUpdated: new Date('2023-02-14')
      },
      {
        id: 'SD-401',
        name: 'Talent Acquisition',
        shortName: 'HR-REC',
        parentDepartmentId: 'DEP-003', // Finance (Mock parent)
        parentDepartmentName: 'Human Resources',
        status: 'Inactive',
        region: 'APAC',
        companyMappings: [],
        auditTimeline: [],
        createdBy: 'HR VP',
        createdDate: new Date('2023-03-20'),
        lastUpdated: new Date('2023-11-01')
      },
      {
        id: 'SD-500',
        name: 'Accounts Payable',
        shortName: 'FIN-AP',
        parentDepartmentId: 'DEP-003',
        parentDepartmentName: 'Finance',
        status: 'Active',
        region: 'Global',
        companyMappings: [],
        auditTimeline: [],
        createdBy: 'CFO',
        createdDate: new Date('2023-01-05'),
        lastUpdated: new Date('2023-01-05')
      }
    ];
  }
}
