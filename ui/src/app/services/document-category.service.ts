
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DocumentCategory } from '../models/document-category.model';



@Injectable({
  providedIn: 'root'
})
export class DocumentCategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/document_categories';
  private readonly _categories = signal<DocumentCategory[]>([]);
  private readonly collectionName = 'document_categories';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._categories.set(this._generateMockCategories());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const categories: DocumentCategory[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        categories.push({
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
      // Sort by ID naturally
      categories.sort((a, b) => a.id.localeCompare(b.id));
      this._categories.set(categories);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._categories().length === 0) {
            this._categories.set(this._generateMockCategories());
        }
    }
    });
  }

  get categories() {
    return this._categories.asReadonly();
  }

  getCategoryById(id: string): DocumentCategory | undefined {
    return this._categories().find(c => c.id === id);
  }

  async addCategory(category: Omit<DocumentCategory, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'revisionHistory'>): Promise<void> {
    const currentCount = this._categories().length;
    const newId = `CAT-${String(currentCount + 1).padStart(3, '0')}`;

    const newCategory = {
      ...category,
      id: true ? undefined : newId, // Firestore auto-ID or mock
      auditTrail: [
          { id: 1, action: 'Category Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial setup' }
      ],
      revisionHistory: [
          { id: 1, changeDescription: 'Category Initial Setup', modifiedBy: 'System Admin', date: new Date() }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       const { id, ...data } = newCategory;
       await lastValueFrom(this.http.post(this.apiUrl, data));
    } else {
       this._categories.update(current => [...current, newCategory as DocumentCategory]);
    }
  }

  async updateCategory(category: DocumentCategory, changeDesc: string = 'General Update'): Promise<void> {
    const newRevision = {
        id: Date.now(),
        changeDescription: changeDesc,
        modifiedBy: 'System Admin',
        date: new Date()
    };

    const dataToUpdate = {
        ...category,
        revisionHistory: [newRevision, ...(category.revisionHistory || [])],
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        if (id.startsWith('CAT-')) {
             // Mock update if using mock IDs in a real DB context (hybrid scenario)
             this._categories.update(current => current.map(c => c.id === id ? dataToUpdate : c));
             return;
        }
        await lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, firestoreData));
    } else {
        this._categories.update(current => 
            current.map(c => c.id === id ? dataToUpdate : c)
        );
    }
  }

  async deleteCategory(id: string): Promise<void> {
    if (true && !id.startsWith('CAT-')) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._categories.update(current => current.filter(c => c.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyCategories(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._categories();
        const newItems = dummyData.map((d, index) => ({ 
            ...d, 
            id: `CAT-${Math.floor(1000 + Math.random() * 9000)}-${index}` 
        } as DocumentCategory));
        this._categories.set([...current, ...newItems]);
    }
  }

  private _generateDummyCategories(count: number): any[] {
    const categories = [];
    const types = ['Legal', 'Finance', 'HR', 'Marketing', 'Operations', 'IT', 'Sales', 'Compliance', 'R&D', 'Logistics'];
    const docTypes = ['Reports', 'Contracts', 'Policies', 'Invoices', 'Memos', 'Agreements', 'Plans', 'Audits', 'Records', 'Manuals'];
    const statuses = ['Active', 'Inactive'];
    const securityLevels = ['Public', 'Restricted', 'Confidential'];

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const docType = docTypes[Math.floor(Math.random() * docTypes.length)];
        const suffix = Math.floor(Math.random() * 10000);
        
        const categoryName = `${type} ${docType} ${suffix}`;
        const shortName = `${type.substring(0,3).toUpperCase()}-${docType.substring(0,3).toUpperCase()}${suffix}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const securityLevel = securityLevels[Math.floor(Math.random() * securityLevels.length)];

        categories.push({
            categoryName,
            shortName,
            description: `Auto-generated category for ${type} ${docType} documents.`,
            status,
            securityLevel,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date(),
            auditTrail: [
                { id: 1, action: 'Category Created', actor: 'System Seed', timestamp: new Date(), description: 'Bulk generation' }
            ],
            revisionHistory: []
        });
    }
    return categories;
  }

  private _generateMockCategories(): DocumentCategory[] {
    return [
      {
        id: 'CAT-001',
        categoryName: 'Legal Documents',
        shortName: 'LEGAL',
        status: 'Active',
        securityLevel: 'Confidential',
        description: 'Contracts, NDAs, and other legally binding agreements.',
        createdBy: 'Sarah Jenkins',
        createdDate: new Date('2023-01-12T09:45:00'),
        updatedBy: 'Michael Ross',
        lastUpdated: new Date('2023-10-24T14:30:00'),
        revisionHistory: [
            { id: 1, changeDescription: 'Security Level changed to Confidential', modifiedBy: 'Michael Ross', date: new Date('2023-10-24') },
            { id: 2, changeDescription: 'Initial Setup', modifiedBy: 'Sarah Jenkins', date: new Date('2023-01-12') }
        ]
      },
      {
        id: 'CAT-002',
        categoryName: 'Financial Statements',
        shortName: 'FIN',
        status: 'Active',
        securityLevel: 'Restricted',
        description: 'Quarterly reports, audits, and budget sheets.',
        createdBy: 'Finance Admin',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-02-15'),
        revisionHistory: []
      },
      {
        id: 'CAT-003',
        categoryName: 'Human Resources',
        shortName: 'HR',
        status: 'Active',
        securityLevel: 'Restricted',
        description: 'Employee records, policy handbooks, and onboarding materials.',
        createdBy: 'HR VP',
        createdDate: new Date('2023-03-01'),
        updatedBy: 'HR VP',
        lastUpdated: new Date('2023-03-01'),
        revisionHistory: []
      },
      {
        id: 'CAT-004',
        categoryName: 'Internal Policies',
        shortName: 'POL',
        status: 'Inactive',
        securityLevel: 'Public',
        description: 'Company-wide rules and standard operating procedures.',
        createdBy: 'Ops Manager',
        createdDate: new Date('2022-11-20'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-12-01'),
        revisionHistory: []
      },
      {
        id: 'CAT-005',
        categoryName: 'Marketing Assets',
        shortName: 'MKT',
        status: 'Active',
        securityLevel: 'Public',
        description: 'Logos, brand guidelines, and campaign materials.',
        createdBy: 'CMO',
        createdDate: new Date('2023-05-10'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-05-10'),
        revisionHistory: []
      },
      {
        id: 'CAT-006',
        categoryName: 'Compliance & Regulatory',
        shortName: 'COMP-REG',
        status: 'Active',
        securityLevel: 'Restricted',
        description: 'This category encompasses all documentation required for external audits, industry compliance standards, and internal regulatory protocols.',
        createdBy: 'Elena Vance',
        createdDate: new Date('2023-03-05T10:15:00'),
        updatedBy: 'James Wilson',
        lastUpdated: new Date('2023-11-18T16:20:00'),
        revisionHistory: [
            { id: 1, changeDescription: 'Security Level changed to Restricted', modifiedBy: 'James Wilson', date: new Date('2023-11-18') },
            { id: 2, changeDescription: 'Short Name updated from CR to COMP-REG', modifiedBy: 'Elena Vance', date: new Date('2023-08-12') },
            { id: 3, changeDescription: 'Category Initial Setup', modifiedBy: 'Elena Vance', date: new Date('2023-03-05') }
        ]
      }
    ];
  }
}
