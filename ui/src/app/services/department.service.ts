import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Department } from '../models/department.model';



@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/departments';
  private readonly _departments = signal<Department[]>([]);
  private readonly collectionName = 'departments';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._departments.set(this._generateMockDepartments());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const departments: Department[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        departments.push({
          ...data,
          id: doc.id,
          // Handle Firestore timestamps
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          // Handle timestamps in nested array if they exist
          auditTrail: data.auditTrail?.map((audit: any) => ({
             ...audit,
             timestamp: audit.timestamp?.toDate ? audit.timestamp.toDate() : new Date(audit.timestamp)
          }))
        });
      });
      // Sort by ID to match screenshot style usually
      departments.sort((a, b) => a.id.localeCompare(b.id));
      this._departments.set(departments);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._departments().length === 0) {
            this._departments.set(this._generateMockDepartments());
        }
    }
    });
  }

  get departments() {
    return this._departments.asReadonly();
  }

  getDepartmentById(id: string): Department | undefined {
    return this._departments().find(d => d.id === id);
  }

  async addDepartment(department: Omit<Department, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newDepartment = {
      ...department,
      id: undefined,
      headOfDepartment: department.headOfDepartment || 'Unassigned',
      location: department.location || 'Main Office',
      budgetCode: department.budgetCode || `BGT-2024-NEW`,
      subDepartments: [],
      auditTrail: [
        { 
            id: 1, 
            title: 'Department Created', 
            description: 'Initial setup by System Administrator', 
            timestamp: new Date(), 
            icon: 'add', 
            colorClass: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
        }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };
    
    const { id, ...data } = newDepartment;
    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, data));
    } else {
      const mockId = `DEP-${Math.floor(Math.random() * 1000)}`;
      this._departments.update(current => [...current, { ...newDepartment, id: mockId } as Department]);
    }
  }

  async updateDepartment(department: Department): Promise<void> {
    const dataToUpdate = {
        ...department,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
        const { id, ...firestoreData } = dataToUpdate;
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._departments.update(current => 
            current.map(d => d.id === department.id ? dataToUpdate : d)
        );
    }
  }

  async deleteDepartment(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._departments.update(current => current.filter(d => d.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyDepartments(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._departments();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Department));
        this._departments.set([...current, ...newItems]);
    }
  }

  private _generateDummyDepartments(count: number): any[] {
    const depts = [];
    const names = ['Human Resources', 'Information Technology', 'Finance', 'Marketing', 'Sales', 'Operations', 'Legal', 'Research & Development', 'Customer Support', 'Product Management', 'Design', 'Logistics', 'Procurement', 'Administration', 'Security', 'Compliance', 'Corporate Strategy', 'Innovation'];
    const modifiers = ['Global', 'North America', 'EMEA', 'APAC', 'Regional', 'Corporate', 'Field', 'Internal', 'External', 'Strategic', 'Advanced', 'Core'];

    for (let i = 0; i < count; i++) {
        const nameBase = names[Math.floor(Math.random() * names.length)];
        const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
        const suffix = Math.floor(Math.random() * 100);

        const departmentName = `${mod} ${nameBase} ${suffix}`;
        const shortName = `${nameBase.substring(0, 3).toUpperCase()}-${mod.substring(0, 3).toUpperCase()}${suffix}`;
        
        depts.push({
            departmentName,
            shortName,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            headOfDepartment: `Manager ${i}`,
            location: 'Main Campus',
            budgetCode: `BGT-2024-${i}`,
            subDepartments: [],
            auditTrail: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return depts;
  }

  private async _seedData() {
    
    const mockData = this._generateMockDepartments();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockDepartments(): Department[] {
    return [
      {
        id: 'DEP-MKT-01',
        departmentName: 'Global Marketing',
        shortName: 'MKT',
        status: 'Active',
        headOfDepartment: 'Sarah Jenkins',
        location: 'New York, NY',
        budgetCode: 'BGT-2024-001',
        description: 'Main Office Branch',
        subDepartments: [
            { id: '1', name: 'Digital Advertising', lead: 'Michael Chen', employeeCount: 24 },
            { id: '2', name: 'Content Strategy', lead: 'Alicia Rodriguez', employeeCount: 12 },
            { id: '3', name: 'Brand & Creative', lead: 'David Gahan', employeeCount: 18 },
            { id: '4', name: 'Public Relations', lead: 'Emma Watson', employeeCount: 8 }
        ],
        auditTrail: [
            { 
                id: 1, 
                title: 'Head of Dept Changed', 
                description: 'Sarah Jenkins assigned by Alex Rivera', 
                timestamp: new Date(new Date().setHours(14, 45)), 
                icon: 'edit', 
                colorClass: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' 
            },
            { 
                id: 2, 
                title: 'Budget Code Updated', 
                description: 'BGT-2023-09 to BGT-2024-001', 
                timestamp: new Date('2023-10-24'), 
                icon: 'payments', 
                colorClass: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300' 
            },
            { 
                id: 3, 
                title: 'Department Created', 
                description: 'Initial setup by System Administrator', 
                timestamp: new Date('2022-01-12'), 
                icon: 'add', 
                colorClass: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
            }
        ],
        createdBy: 'Admin',
        createdDate: new Date('2022-01-12'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-10-24')
      },
      {
        id: 'DEP-002',
        departmentName: 'Information Technology',
        shortName: 'IT',
        status: 'Active',
        headOfDepartment: 'Robert Anderson',
        location: 'San Francisco, CA',
        budgetCode: 'BGT-2024-042',
        subDepartments: [],
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-01-12'),
        updatedBy: 'CTO',
        lastUpdated: new Date('2023-08-20')
      },
      {
        id: 'DEP-003',
        departmentName: 'Finance & Accounting',
        shortName: 'FIN',
        status: 'Active',
        headOfDepartment: 'Jessica Lee',
        location: 'Chicago, IL',
        budgetCode: 'BGT-2024-010',
        subDepartments: [],
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-15'),
        updatedBy: 'CFO',
        lastUpdated: new Date('2023-09-10')
      },
      {
        id: 'DEP-004',
        departmentName: 'Legal Affairs',
        shortName: 'LEG',
        status: 'Inactive',
        headOfDepartment: 'Vacant',
        location: 'Washington D.C.',
        budgetCode: 'BGT-2023-099',
        subDepartments: [],
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2022-11-20'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-05')
      },
      {
        id: 'DEP-006',
        departmentName: 'Global Research',
        shortName: 'R&D',
        status: 'Active',
        headOfDepartment: 'Dr. Alan Grant',
        location: 'Boston, MA',
        budgetCode: 'BGT-2024-RD',
        subDepartments: [],
        auditTrail: [],
        createdBy: 'Admin User',
        createdDate: new Date('2023-10-12T10:45:00'),
        updatedBy: 'Jane Smith',
        lastUpdated: new Date('2023-11-28T16:22:00')
      }
    ];
  }
}
