
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Designation, DesignationHistory } from '../models/designation.model';



@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/designations';
  private readonly _designations = signal<Designation[]>([]);
  private readonly collectionName = 'designations';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._designations.set(this._generateMockDesignations());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const designations: Designation[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        designations.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          revisionHistory: (data.revisionHistory || []).map((h: any) => ({
             ...h,
             date: h.date?.toDate ? h.date.toDate() : new Date(h.date)
          }))
        });
      });
      this._designations.set(designations);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._designations().length === 0) {
            this._designations.set(this._generateMockDesignations());
        }
    }
    });
  }

  get designations() {
    return this._designations.asReadonly();
  }

  getDesignationById(id: string): Designation | undefined {
    return this._designations().find(d => d.id === id);
  }

  async addDesignation(designation: Omit<Designation, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'revisionHistory'>): Promise<void> {
    const newDesignation = {
      ...designation,
      revisionHistory: [
          // FIX: Renamed 'changeDescription' to 'change' to match the DesignationHistory interface.
          { id: 1, changeDescription: 'Initial Creation', modifiedBy: 'System Admin', date: new Date() }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newDesignation));
    } else {
      const mockId = `DES-${Math.floor(Math.random() * 1000)}`;
      this._designations.update(current => [...current, { ...newDesignation, id: mockId } as Designation]);
    }
  }

  async updateDesignation(designation: Designation, changeDescription: string = 'Updated details'): Promise<void> {
    const newHistoryItem: DesignationHistory = {
        id: Date.now(),
        // FIX: Renamed 'changeDescription' to 'change' to match the DesignationHistory interface.
        changeDescription: changeDescription,
        modifiedBy: 'System Admin',
        date: new Date()
    };
    
    const updatedHistory = [newHistoryItem, ...(designation.revisionHistory || [])];

    const dataToUpdate: Designation = {
        ...designation,
        revisionHistory: updatedHistory,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._designations.update(current => 
            current.map(d => d.id === id ? dataToUpdate : d)
        );
    }
  }

  async deleteDesignation(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._designations.update(current => current.filter(d => d.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyDesignations(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._designations();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Designation));
        this._designations.set([...current, ...newItems]);
    }
  }
  
  private async _seedData() {
    
    const mockData = this._generateMockDesignations();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateDummyDesignations(count: number): any[] {
      const roles = ['Engineer', 'Manager', 'Analyst', 'Specialist', 'Director', 'VP', 'Associate', 'Consultant', 'Lead', 'Coordinator'];
      const depts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Product', 'Support'];
      const prefixes = ['Senior', 'Junior', 'Lead', 'Chief', 'Assistant', 'Executive', 'Principal', 'Global', 'Regional'];

      const designations = [];
      for(let i=0; i<count; i++) {
          const dept = depts[Math.floor(Math.random() * depts.length)];
          const role = roles[Math.floor(Math.random() * roles.length)];
          const prefix = Math.random() > 0.4 ? prefixes[Math.floor(Math.random() * prefixes.length)] : '';
          
          const fullName = `${prefix ? prefix + ' ' : ''}${dept} ${role}`.trim();
          
          const shortCode = (fullName.match(/\b(\w)/g) || []).join('').toUpperCase().substring(0, 4) + Math.floor(Math.random()*100);

          designations.push({
              id: `DES-${100 + i}`,
              name: fullName,
              shortCode: shortCode,
              level: `Level ${Math.floor(Math.random() * 10) + 1}`,
              status: Math.random() > 0.15 ? 'Active' : 'Inactive',
              departmentName: dept,
              reportingTo: 'Department Head',
              description: `Responsible for various ${dept.toLowerCase()} tasks and ${role.toLowerCase()} duties.`,
              responsibilities: `Manage ${dept} workflows.`,
              createdBy: 'System Seed',
              createdDate: new Date(),
              updatedBy: 'System Seed',
              lastUpdated: new Date(),
              revisionHistory: []
          });
      }
      return designations;
  }

  private _generateMockDesignations(): Designation[] {
    return [
      {
        id: 'DES-101',
        name: 'Software Engineer',
        shortCode: 'SE',
        level: 'Level 1',
        levelNumber: 1,
        status: 'Active',
        departmentName: 'Engineering',
        reportingTo: 'Engineering Manager',
        description: 'Entry level developer role focused on feature implementation and bug fixing.',
        responsibilities: 'Write clean code, participate in code reviews, debug issues.',
        createdBy: 'Admin',
        createdDate: new Date('2023-01-10'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-10'),
        revisionHistory: []
      },
      {
        id: 'DES-102',
        name: 'Senior Software Engineer',
        shortCode: 'SSE',
        level: 'L4 - Technical Leadership',
        levelNumber: 4,
        status: 'Active',
        departmentName: 'Engineering',
        reportingTo: 'Engineering Manager',
        description: 'Responsible for developing high-quality software solutions, mentoring junior developers, and leading technical architecture discussions within the product team.',
        responsibilities: 'Lead development teams in technical execution of software projects and architectural decisions.',
        createdBy: 'Admin.User',
        createdDate: new Date('2023-10-12T10:45:00'),
        updatedBy: 'Michael Ross',
        lastUpdated: new Date('2024-10-24T14:30:00'),
        revisionHistory: [
            // FIX: Renamed 'changeDescription' to 'change'.
            { id: 1, changeDescription: 'Security Level changed to Confidential', modifiedBy: 'Michael Ross', date: new Date('2023-10-24') },
            // FIX: Renamed 'changeDescription' to 'change'.
            { id: 2, changeDescription: 'Initial Setup', modifiedBy: 'Sarah Jenkins', date: new Date('2023-01-12') }
        ]
      },
      {
        id: 'DES-205',
        name: 'Senior Manager',
        shortCode: 'SRM',
        level: 'Level 5',
        levelNumber: 5,
        status: 'Active',
        departmentName: 'Sales',
        reportingTo: 'Director of Sales',
        description: 'Oversees regional sales teams and strategy.',
        createdBy: 'HR Director',
        createdDate: new Date('2022-11-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-05-20'),
        revisionHistory: []
      },
      {
        id: 'DES-301',
        name: 'Director',
        shortCode: 'DIR',
        level: 'Level 10',
        levelNumber: 10,
        status: 'Active',
        departmentName: 'Operations',
        reportingTo: 'VP of Operations',
        description: 'Strategic leadership for operational efficiency.',
        createdBy: 'System',
        createdDate: new Date('2022-08-01'),
        updatedBy: 'System',
        lastUpdated: new Date('2022-08-01'),
        revisionHistory: []
      },
      {
        id: 'DES-055',
        name: 'Junior Analyst',
        shortCode: 'JA',
        level: 'Level 2',
        levelNumber: 2,
        status: 'Inactive',
        departmentName: 'Data Science',
        reportingTo: 'Senior Analyst',
        description: 'Data cleaning and basic reporting.',
        createdBy: 'Manager',
        createdDate: new Date('2023-06-15'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-12-01'),
        revisionHistory: []
      }
    ];
  }
}