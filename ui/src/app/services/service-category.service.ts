
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ServiceCategory, ServiceCategoryAudit } from '../models/service-category.model';



@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/service_categories';
  private readonly _categories = signal<ServiceCategory[]>([]);
  private readonly collectionName = 'service_categories';

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
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const categories: ServiceCategory[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        categories.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
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

  getCategoryById(id: string): ServiceCategory | undefined {
    return this._categories().find(c => c.id === id);
  }

  async addCategory(category: Omit<ServiceCategory, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'globalIdentifier' | 'schemaVersion'>): Promise<void> {
    const newId = `CAT-${Date.now()}`;

    const newCategory: ServiceCategory = {
      ...category,
      id: newId,
      globalIdentifier: `CAT-${Math.floor(Math.random() * 9000) + 1000}-${category.shortName}`,
      schemaVersion: 'v1.0.0',
      auditTrail: [
          { id: 1, action: 'Category Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial setup' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       const docRef = `${this.apiUrl}/newId`;
       await lastValueFrom(this.http.put(docRef, newCategory));
    } else {
       this._categories.update(current => [...current, newCategory as ServiceCategory]);
    }
  }

  async updateCategory(category: ServiceCategory, changeDesc: string = 'General Update'): Promise<void> {
    const newAuditItem: ServiceCategoryAudit = {
        id: Date.now(),
        action: 'Configuration Updated',
        actor: 'System Admin',
        timestamp: new Date(),
        description: changeDesc
    };

    const dataToUpdate = {
        ...category,
        auditTrail: [newAuditItem, ...(category.auditTrail || [])],
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${category.id}`, dataToUpdate as any));
    } else {
        this._categories.update(current => 
            current.map(c => c.id === category.id ? dataToUpdate : c)
        );
    }
  }

  async deleteCategory(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._categories.update(current => current.filter(c => c.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    // This is now handled by seeding logic if the collection is empty.
    // You can enhance this to add more data if needed.
    if (this._categories().length > 10) {
        console.log('Dummy data already seems to exist.');
        return;
    }
    await this._seedData(50);
  }

  private async _seedData(count: number = 0) {
    
    const mockData = count > 0 ? this._generateDummyCategories(count) : this._generateMockCategories();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateDummyCategories(count: number): any[] {
    const categories = [];
    const types = ['Legal', 'Finance', 'HR', 'Marketing', 'Operations', 'IT', 'Sales', 'Compliance', 'R&D', 'Logistics'];
    const docTypes = ['Reports', 'Contracts', 'Policies', 'Invoices', 'Memos', 'Agreements', 'Plans', 'Audits', 'Records', 'Manuals'];
    const statuses = ['Active', 'Inactive'];

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const docType = docTypes[Math.floor(Math.random() * docTypes.length)];
        const suffix = Math.floor(Math.random() * 10000);
        
        const categoryName = `${type} ${docType} ${suffix}`;
        const shortName = `${type.substring(0,3).toUpperCase()}-${docType.substring(0,3).toUpperCase()}${suffix}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        categories.push({
            id: `CAT-${1000 + i}`,
            categoryName,
            shortName,
            description: `Auto-generated category for ${type} ${docType} documents.`,
            isActive: status === 'Active',
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date(),
            auditTrail: [
                { id: 1, action: 'Category Created', actor: 'System Seed', timestamp: new Date(), description: 'Bulk generation' }
            ],
        });
    }
    return categories;
  }

  private _generateMockCategories(): ServiceCategory[] {
    return [
      {
        id: 'CAT-001',
        categoryName: 'Legal Documents',
        shortName: 'LEGAL',
        isActive: true,
        description: 'Contracts, NDAs, and other legally binding agreements.',
        createdBy: 'Sarah Jenkins',
        createdDate: new Date('2023-01-12T09:45:00'),
        updatedBy: 'Michael Ross',
        lastUpdated: new Date('2023-10-24T14:30:00'),
        auditTrail: [
            { id: 1, action: 'Security Level changed to Confidential', actor: 'Michael Ross', timestamp: new Date('2023-10-24') },
            { id: 2, action: 'Initial Setup', actor: 'Sarah Jenkins', timestamp: new Date('2023-01-12') }
        ]
      },
      {
        id: 'CAT-002',
        categoryName: 'Financial Statements',
        shortName: 'FIN',
        isActive: true,
        description: 'Quarterly reports, audits, and budget sheets.',
        createdBy: 'Finance Admin',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-02-15'),
        auditTrail: []
      },
      {
        id: 'CAT-003',
        categoryName: 'Human Resources',
        shortName: 'HR',
        isActive: true,
        description: 'Employee records, policy handbooks, and onboarding materials.',
        createdBy: 'HR VP',
        createdDate: new Date('2023-03-01'),
        updatedBy: 'HR VP',
        lastUpdated: new Date('2023-03-01'),
        auditTrail: []
      },
      {
        id: 'CAT-004',
        categoryName: 'Internal Policies',
        shortName: 'POL',
        isActive: false,
        description: 'Company-wide rules and standard operating procedures.',
        createdBy: 'Ops Manager',
        createdDate: new Date('2022-11-20'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-12-01'),
        auditTrail: []
      },
      {
        id: 'CAT-005',
        categoryName: 'Marketing Assets',
        shortName: 'MKT',
        isActive: true,
        description: 'Logos, brand guidelines, and campaign materials.',
        createdBy: 'CMO',
        createdDate: new Date('2023-05-10'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-05-10'),
        auditTrail: []
      },
      {
        id: 'CAT-006',
        categoryName: 'Compliance & Regulatory',
        shortName: 'COMP-REG',
        isActive: true,
        description: 'This category encompasses all documentation required for external audits, industry compliance standards, and internal regulatory protocols.',
        createdBy: 'Elena Vance',
        createdDate: new Date('2023-03-05T10:15:00'),
        updatedBy: 'James Wilson',
        lastUpdated: new Date('2023-11-18T16:20:00'),
        auditTrail: [
            { id: 1, action: 'Security Level changed to Restricted', actor: 'James Wilson', timestamp: new Date('2023-11-18') },
            { id: 2, action: 'Short Name updated from CR to COMP-REG', actor: 'Elena Vance', timestamp: new Date('2023-08-12') },
            { id: 3, action: 'Category Initial Setup', actor: 'Elena Vance', timestamp: new Date('2023-03-05') }
        ]
      }
    ];
  }
}