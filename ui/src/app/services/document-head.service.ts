
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DocumentHead } from '../models/document-head.model';
import { DocumentCategoryService } from './document-category.service';



@Injectable({
  providedIn: 'root'
})
export class DocumentHeadService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/document_heads';
  private readonly categoryService = inject(DocumentCategoryService);
  private readonly _heads = signal<DocumentHead[]>([]);
  private readonly collectionName = 'document_heads';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._heads.set(this._generateMockHeads());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const heads: DocumentHead[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        heads.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          revisionHistory: data.revisionHistory?.map((r: any) => ({
             ...r,
             date: r.date?.toDate ? r.date.toDate() : new Date(r.date)
          }))
        });
      });
      // Sort naturally by ID
      heads.sort((a, b) => a.id.localeCompare(b.id));
      this._heads.set(heads);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._heads().length === 0) {
            this._heads.set(this._generateMockHeads());
        }
    }
    });
  }

  get heads() {
    return this._heads.asReadonly();
  }

  getHeadById(id: string): DocumentHead | undefined {
    return this._heads().find(h => h.id === id);
  }

  async addHead(head: Omit<DocumentHead, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'revisionHistory'>): Promise<void> {
    const currentCount = this._heads().length;
    // Simple ID generation for demo
    const newId = `DH-${String(currentCount + 1).padStart(3, '0')}`;

    const newHead = {
      ...head,
      id: true ? undefined : newId,
      revisionHistory: [
          { id: 1, changeDescription: 'Document Head Created', modifiedBy: 'System Admin', date: new Date() }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       const { id, ...data } = newHead;
       await lastValueFrom(this.http.post(this.apiUrl, data));
    } else {
       this._heads.update(current => [...current, newHead as DocumentHead]);
    }
  }

  async updateHead(head: DocumentHead, changeDesc: string = 'Details Updated'): Promise<void> {
    const newRevision = {
        id: Date.now(),
        changeDescription: changeDesc,
        modifiedBy: 'System Admin',
        date: new Date()
    };

    const dataToUpdate = {
        ...head,
        revisionHistory: [newRevision, ...(head.revisionHistory || [])],
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        if (id.startsWith('DH-')) {
             this._heads.update(current => current.map(h => h.id === id ? dataToUpdate : h));
             return;
        }
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._heads.update(current => 
            current.map(h => h.id === id ? dataToUpdate : h)
        );
    }
  }

  async deleteHead(id: string): Promise<void> {
    if (true && !id.startsWith('DH-')) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._heads.update(current => current.filter(h => h.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const categories = this.categoryService.categories();
    // Use fallback categories if none exist in the service
    const categoryList = categories.length > 0 ? categories : [
        { id: 'CAT-MOCK-1', categoryName: 'General Docs' },
        { id: 'CAT-MOCK-2', categoryName: 'Legal' }
    ];

    const dummyData = this._generateDummyHeads(100, categoryList);
    
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._heads();
        const newItems = dummyData.map((d, index) => ({ 
            ...d, 
            id: `DH-${Math.floor(1000 + Math.random() * 9000)}-${index}` 
        } as DocumentHead));
        this._heads.set([...current, ...newItems]);
    }
  }

  private _generateDummyHeads(count: number, categories: any[]): any[] {
    const heads = [];
    const prefixes = ['Internal', 'External', 'Corporate', 'Employee', 'Financial', 'Legal', 'Safety', 'Quality', 'Audit', 'Client'];
    const roots = ['Report', 'Agreement', 'Policy', 'Manual', 'Protocol', 'Standard', 'Record', 'Log', 'Form', 'Certificate'];
    
    for (let i = 0; i < count; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const root = roots[Math.floor(Math.random() * roots.length)];
        const suffix = Math.floor(Math.random() * 1000);
        
        const headName = `${prefix} ${root} ${suffix}`;
        const shortName = `${prefix.substring(0,3).toUpperCase()}-${root.substring(0,3).toUpperCase()}${suffix}`;
        const parent = categories[Math.floor(Math.random() * categories.length)];
        
        heads.push({
            headName,
            shortName,
            description: `Standardized ${headName.toLowerCase()} documentation head.`,
            parentCategoryId: parent.id,
            parentCategoryName: parent.categoryName,
            status: Math.random() > 0.2 ? 'Active' : 'Inactive',
            revisionHistory: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return heads;
  }

  private _generateMockHeads(): DocumentHead[] {
    return [
      {
        id: 'DH-001',
        headName: 'Quality Assurance Protocols',
        shortName: 'QA-PROT',
        parentCategoryId: 'CAT-006',
        parentCategoryName: 'Compliance & Regulatory',
        status: 'Active',
        description: 'ISO-certified quality control measures.',
        createdBy: 'Elena Vance',
        createdDate: new Date('2023-05-12T09:30:00'),
        updatedBy: 'James Wilson',
        lastUpdated: new Date('2024-01-14T11:45:00'),
        revisionHistory: [
            { id: 1, changeDescription: 'Parent Category updated to Technical Standards', modifiedBy: 'James Wilson', date: new Date('2024-01-14') },
            { id: 2, changeDescription: 'Description expanded', modifiedBy: 'Elena Vance', date: new Date('2023-09-05') }
        ]
      },
      {
        id: 'DH-002',
        headName: 'Employee Onboarding',
        shortName: 'HR-ONB',
        parentCategoryId: 'CAT-003',
        parentCategoryName: 'Human Resources',
        status: 'Active',
        description: 'Forms and checklists for new hires.',
        createdBy: 'HR Manager',
        createdDate: new Date('2023-02-10'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-02-10'),
        revisionHistory: []
      },
      {
        id: 'DH-003',
        headName: 'Internal Audit Reports',
        shortName: 'AUDIT-INT',
        parentCategoryId: 'CAT-002',
        parentCategoryName: 'Financial Services',
        status: 'Inactive',
        description: 'Quarterly financial audits.',
        createdBy: 'Finance Lead',
        createdDate: new Date('2022-11-22'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-10-01'),
        revisionHistory: []
      },
      {
        id: 'DH-004',
        headName: 'Vendor Contracts',
        shortName: 'LGL-VNDR',
        parentCategoryId: 'CAT-001',
        parentCategoryName: 'Legal Affairs',
        status: 'Active',
        description: 'Standard supplier agreements.',
        createdBy: 'Legal Team',
        createdDate: new Date('2023-06-15'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-06-15'),
        revisionHistory: []
      },
      {
        id: 'DH-005',
        headName: 'Safety Regulations',
        shortName: 'SAFE-REG',
        parentCategoryId: 'CAT-006',
        parentCategoryName: 'Compliance & Regulatory',
        status: 'Active',
        description: 'Workplace safety guidelines and OSHA compliance.',
        createdBy: 'Safety Officer',
        createdDate: new Date('2023-01-05'),
        updatedBy: 'Safety Officer',
        lastUpdated: new Date('2023-08-20'),
        revisionHistory: []
      }
    ];
  }
}
